
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PersonalInfoFormValues } from "@/components/onboarding/steps/PersonalInfoStep";
import { PlanType } from "@/components/onboarding/steps/PlanStep";
import { PaymentFormValues } from "@/components/onboarding/steps/PaymentStep";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";

interface UseOnboardingHandlersProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setUserType: (type: UserType) => void;
  setPersonalInfo: (info: PersonalInfoFormValues) => void;
  setLocation: (location: any) => void;
  setSelectedPlan: (plan: PlanType) => void;
  setPaymentData: (data: PaymentFormValues) => void;
  setShowPaymentConfirmation: (show: boolean) => void;
  setIsDirectNavigation: (isDirect: boolean) => void;
  totalSteps: number;
  paymentData: PaymentFormValues | null;
  selectedPlan: PlanType;
  userType: UserType | null;
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

  const handleUserTypeComplete = (userTypeData: { type: UserType }) => {
    props.setUserType(userTypeData.type);
    
    // Store user type for later use
    localStorage.setItem("myrhythm_user_type", userTypeData.type);
    
    props.setCurrentStep(2);
  };

  const handlePersonalInfoComplete = (personalInfo: PersonalInfoFormValues) => {
    props.setPersonalInfo(personalInfo);
    props.setCurrentStep(3);
  };

  const handleLocationComplete = (location: any) => {
    props.setLocation(location);
    props.setCurrentStep(4);
  };

  const handlePlanSelected = (plan: PlanType) => {
    props.setSelectedPlan(plan);
    
    if (plan === "basic") {
      // Skip payment for basic plan trial and go directly to assessment
      props.setCurrentStep(6);
    } else {
      props.setCurrentStep(5);
    }
  };

  const handlePaymentComplete = (paymentData: PaymentFormValues) => {
    props.setPaymentData(paymentData);
    props.setShowPaymentConfirmation(true);
  };

  const handlePaymentConfirm = () => {
    props.setShowPaymentConfirmation(false);
    props.setCurrentStep(6);
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
    handleUserTypeComplete,
    handlePersonalInfoComplete,
    handleLocationComplete,
    handlePlanSelected,
    handlePaymentComplete,
    handlePaymentConfirm,
    handleRhythmAssessmentComplete,
  };
};
