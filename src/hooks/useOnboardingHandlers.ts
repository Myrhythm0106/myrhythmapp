
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { PersonalInfoFormValues } from "@/components/onboarding/steps/PersonalInfoStep";
import { PlanType } from "@/components/onboarding/steps/PlanStep";
import { PaymentFormValues } from "@/components/onboarding/steps/PaymentStep";

type LocationFormValues = {
  country: string;
  state: string;
  town: string;
};

interface UseOnboardingHandlersProps {
  currentStep: number;
  totalSteps: number;
  setCurrentStep: (step: number) => void;
  setLocation: (location: LocationFormValues) => void;
  setPersonalInfo: (info: PersonalInfoFormValues) => void;
  setSelectedPlan: (plan: PlanType) => void;
  setPaymentData: (data: PaymentFormValues) => void;
  setShowPaymentConfirmation: (show: boolean) => void;
  setIsPersonalInfoValid: (valid: boolean) => void;
  setIsLocationValid: (valid: boolean) => void;
  setIsPlanSelected: (selected: boolean) => void;
  setIsDirectNavigation: (direct: boolean) => void;
  paymentData: PaymentFormValues | null;
  selectedPlan: PlanType;
}

export const useOnboardingHandlers = ({
  currentStep,
  totalSteps,
  setCurrentStep,
  setLocation,
  setPersonalInfo,
  setSelectedPlan,
  setPaymentData,
  setShowPaymentConfirmation,
  setIsPersonalInfoValid,
  setIsLocationValid,
  setIsPlanSelected,
  setIsDirectNavigation,
  paymentData,
  selectedPlan,
}: UseOnboardingHandlersProps) => {
  const navigate = useNavigate();

  // Step navigation functions
  const goToNextStep = () => {
    const nextStep = Math.min(currentStep + 1, totalSteps);
    setCurrentStep(nextStep);
    setIsDirectNavigation(false);
  };
  
  const goToPreviousStep = () => {
    if (currentStep === 1) {
      navigate("/");
    } else {
      const prevStep = Math.max(currentStep - 1, 1);
      setCurrentStep(prevStep);
      setIsDirectNavigation(true);
    }
  };

  // Function to add 6-month reminder to calendar
  const addSixMonthReminder = () => {
    try {
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      
      const reminderEvent = {
        id: `rhythm-assessment-${Date.now()}`,
        title: "MyRhythm 6-Month Check-In",
        description: "Time for your rhythm assessment review! We'll check in to see how your rhythm has evolved and update your experience accordingly.",
        date: sixMonthsFromNow.toISOString().split('T')[0],
        time: "10:00",
        type: "reminder",
        category: "wellness",
        requiresAcceptance: true,
        isSystemGenerated: true
      };
      
      const existingEvents = JSON.parse(localStorage.getItem("myrhythm_calendar_events") || "[]");
      existingEvents.push(reminderEvent);
      localStorage.setItem("myrhythm_calendar_events", JSON.stringify(existingEvents));
      localStorage.setItem("myrhythm_next_assessment_date", sixMonthsFromNow.toISOString());
    } catch (error) {
      console.error("Error adding 6-month reminder:", error);
    }
  };
  
  // Step handlers
  const handlePersonalInfoComplete = (values: PersonalInfoFormValues) => {
    try {
      localStorage.setItem("myrhythm_name", values.name);
      localStorage.setItem("myrhythm_email", values.email);
      localStorage.setItem("myrhythm_password", values.password);
      setPersonalInfo(values);
      setIsPersonalInfoValid(true);
      goToNextStep();
    } catch (error) {
      console.error("Error completing personal info step:", error);
      toast({
        title: "Error",
        description: "Failed to save personal information. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleLocationComplete = (values: LocationFormValues) => {
    try {
      setLocation(values);
      setIsLocationValid(true);
      goToNextStep();
    } catch (error) {
      console.error("Error completing location step:", error);
      toast({
        title: "Error",
        description: "Failed to save location information. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handlePlanSelected = (plan: PlanType) => {
    try {
      setSelectedPlan(plan);
      setIsPlanSelected(true);
      goToNextStep();
    } catch (error) {
      console.error("Error selecting plan:", error);
      toast({
        title: "Error",
        description: "Failed to select plan. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handlePaymentComplete = (values: PaymentFormValues) => {
    try {
      setPaymentData(values);
      setShowPaymentConfirmation(true);
    } catch (error) {
      console.error("Error completing payment step:", error);
      toast({
        title: "Error",
        description: "Failed to process payment information. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handlePaymentConfirm = () => {
    try {
      console.log("Payment info:", paymentData);
      setShowPaymentConfirmation(false);
      goToNextStep();
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast({
        title: "Error",
        description: "Failed to confirm payment. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleRhythmAssessmentComplete = (responses: any) => {
    try {
      console.log("Rhythm assessment responses:", responses);
      
      const assessmentData = {
        responses,
        completedAt: new Date().toISOString(),
        assessmentVersion: "1.0"
      };
      
      // Store assessment and location data
      localStorage.setItem("myrhythm_rhythm_assessment", JSON.stringify(assessmentData));
      
      const assessmentHistory = [assessmentData];
      localStorage.setItem("myrhythm_assessment_history", JSON.stringify(assessmentHistory));
      
      addSixMonthReminder();
      
      localStorage.setItem('myrhythm_logged_in', 'true');
      sessionStorage.setItem('justRegistered', 'true');
      
      toast({
        title: "Your rhythm has been found!",
        description: "Welcome to MyRhythm. Your personalized experience is ready. A 6-month check-in has been added to your calendar.",
        variant: "default",
      });
      
      navigate("/welcome");
    } catch (error) {
      console.error("Error completing rhythm assessment:", error);
      toast({
        title: "Error",
        description: "Failed to complete rhythm assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    goToNextStep,
    goToPreviousStep,
    handlePersonalInfoComplete,
    handleLocationComplete,
    handlePlanSelected,
    handlePaymentComplete,
    handlePaymentConfirm,
    handleRhythmAssessmentComplete,
  };
};
