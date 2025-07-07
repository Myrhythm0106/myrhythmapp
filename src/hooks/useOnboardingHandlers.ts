
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PersonalInfoFormValues } from "@/components/onboarding/steps/PersonalInfoStep";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";
import { PlanType } from "@/components/onboarding/steps/PlanStep";
import { PaymentFormValues } from "@/components/onboarding/steps/PaymentStep";

interface UseOnboardingHandlersProps {
  currentStep: number;
  totalSteps: number;
  setCurrentStep: (step: number) => void;
  setUserType: (type: UserType) => void;
  setPersonalInfo: (info: PersonalInfoFormValues) => void;
  setLocation: (location: any) => void;
  setSelectedPlan: (plan: PlanType) => void;
  setBillingPeriod: (period: 'monthly' | 'annual') => void;
  setPaymentData: (data: PaymentFormValues) => void;
  setShowPaymentConfirmation: (show: boolean) => void;
  userType: UserType | null;
  selectedPlan: PlanType;
  billingPeriod?: 'monthly' | 'annual';
}

export const useOnboardingHandlers = (props: UseOnboardingHandlersProps) => {
  const navigate = useNavigate();

  const goToPreviousStep = () => {
    if (props.currentStep > 1) {
      props.setCurrentStep(props.currentStep - 1);
    }
  };

  const handleUserTypeComplete = (data: { type: UserType }) => {
    console.log("OnboardingHandlers: User type completed:", data.type);
    props.setUserType(data.type);
    props.setCurrentStep(2); // Go directly to location (step 2)
  };

  const handlePersonalInfoComplete = (data: PersonalInfoFormValues) => {
    console.log("OnboardingHandlers: Personal info completed");
    props.setPersonalInfo(data);
    props.setCurrentStep(3); // This handler is kept for compatibility but shouldn't be used
  };

  const handleLocationComplete = (data: any) => {
    console.log("OnboardingHandlers: Location completed");
    props.setLocation(data);
    props.setCurrentStep(3); // Go to plan selection (step 3)
  };

  const handlePlanSelected = (plan: PlanType, billingPeriod: 'monthly' | 'annual' = 'monthly') => {
    console.log("OnboardingHandlers: Plan selected:", plan, "Billing:", billingPeriod);
    props.setSelectedPlan(plan);
    props.setBillingPeriod(billingPeriod);
    props.setCurrentStep(4); // Go to payment (step 4)
  };

  const handlePaymentComplete = (data: PaymentFormValues) => {
    console.log("OnboardingHandlers: Payment completed:", data);
    props.setPaymentData(data);
    
    if (data.paymentIntentId === 'skipped' || data.paymentIntentId === 'continue_anyway') {
      // Skip to assessment without payment
      console.log("OnboardingHandlers: Skipping payment, proceeding to pre-assessment");
      props.setCurrentStep(5); // Go to pre-assessment (step 5)
    } else {
      // Show payment confirmation modal
      console.log("OnboardingHandlers: Showing payment confirmation");
      props.setShowPaymentConfirmation(true);
    }
  };

  const handlePaymentConfirm = () => {
    console.log("OnboardingHandlers: Payment confirmed, proceeding to pre-assessment");
    props.setShowPaymentConfirmation(false);
    props.setCurrentStep(5); // Go to pre-assessment (step 5)
  };

  const handlePreAssessmentComplete = () => {
    console.log("OnboardingHandlers: Pre-assessment completed, proceeding to rhythm assessment");
    props.setCurrentStep(6); // Go to rhythm assessment (step 6)
  };

  const handleRhythmAssessmentComplete = () => {
    console.log("OnboardingHandlers: Rhythm assessment completed, navigating to dashboard");
    toast.success("Welcome to MyRhythm! Your personalized journey begins now.");
    navigate("/dashboard");
  };

  return {
    goToPreviousStep,
    handleUserTypeComplete,
    handlePersonalInfoComplete,
    handleLocationComplete,
    handlePlanSelected,
    handlePaymentComplete,
    handlePaymentConfirm,
    handlePreAssessmentComplete,
    handleRhythmAssessmentComplete,
  };
};
