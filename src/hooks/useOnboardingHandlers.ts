
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PersonalInfoFormValues } from "@/components/onboarding/steps/PersonalInfoStep";
import { PlanType } from "@/components/onboarding/steps/PlanStep";
import { PaymentFormValues } from "@/components/onboarding/steps/PaymentStep";

interface UseOnboardingHandlersProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setPersonalInfo: (info: PersonalInfoFormValues) => void;
  setLocation: (location: any) => void;
  setSelectedPlan: (plan: PlanType) => void;
  setPaymentData: (data: PaymentFormValues) => void;
  setShowPaymentConfirmation: (show: boolean) => void;
  setIsDirectNavigation: (isDirect: boolean) => void;
  totalSteps: number;
  paymentData: PaymentFormValues | null;
  selectedPlan: PlanType;
}

export const useOnboardingHandlers = (props: UseOnboardingHandlersProps) => {
  const navigate = useNavigate();

  const goToPreviousStep = () => {
    if (props.currentStep > 1) {
      props.setCurrentStep(props.currentStep - 1);
      props.setIsDirectNavigation(true);
    } else {
      navigate("/");
    }
  };

  const handlePersonalInfoComplete = (personalInfo: PersonalInfoFormValues) => {
    props.setPersonalInfo(personalInfo);
    props.setCurrentStep(2);
  };

  const handleLocationComplete = (location: any) => {
    props.setLocation(location);
    props.setCurrentStep(3);
  };

  const handlePlanSelected = (plan: PlanType) => {
    props.setSelectedPlan(plan);
    
    if (plan === "basic") {
      // Skip payment for basic plan trial and go directly to assessment
      props.setCurrentStep(5);
    } else {
      props.setCurrentStep(4);
    }
  };

  const handlePaymentComplete = (paymentData: PaymentFormValues) => {
    props.setPaymentData(paymentData);
    props.setShowPaymentConfirmation(true);
  };

  const handlePaymentConfirm = () => {
    props.setShowPaymentConfirmation(false);
    props.setCurrentStep(5);
    toast.success("Payment processed successfully!");
  };

  const handleRhythmAssessmentComplete = (responses: any) => {
    // Store completion status
    localStorage.setItem("myrhythm_onboarding_complete", "true");
    localStorage.setItem("myrhythm_assessment_complete", "true");
    
    // Show success message and redirect to dashboard
    toast.success("Welcome to MyRhythm! Your personalized experience is ready.");
    
    // Navigate directly to dashboard
    navigate("/dashboard", { replace: true });
  };

  return {
    goToPreviousStep,
    handlePersonalInfoComplete,
    handleLocationComplete,
    handlePlanSelected,
    handlePaymentComplete,
    handlePaymentConfirm,
    handleRhythmAssessmentComplete,
  };
};
