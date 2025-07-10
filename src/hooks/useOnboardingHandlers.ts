
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PersonalInfoFormValues } from "@/components/onboarding/steps/PersonalInfoStep";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";
import { PlanType } from "@/components/onboarding/steps/PlanStep";

interface UseOnboardingHandlersProps {
  currentStep: number;
  totalSteps: number;
  setCurrentStep: (step: number) => void;
  setUserType: (type: UserType) => void;
  setPersonalInfo: (info: PersonalInfoFormValues) => void;
  setLocation: (location: any) => void;
  setSelectedPlan: (plan: PlanType) => void;
  setBillingPeriod: (period: 'monthly' | 'annual') => void;
  setIsUserTypeSelected: (selected: boolean) => void;
  setIsLocationValid: (valid: boolean) => void;
  setIsPlanSelected: (selected: boolean) => void;
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

  const goToNextStep = () => {
    if (props.currentStep < props.totalSteps) {
      props.setCurrentStep(props.currentStep + 1);
    }
  };

  const goToStep = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= props.totalSteps) {
      props.setCurrentStep(stepNumber);
    }
  };

  const handleUserTypeComplete = (data: { type: UserType }) => {
    console.log("OnboardingHandlers: User type selected:", data.type);
    props.setUserType(data.type);
    props.setIsUserTypeSelected(true);
    toast.success("User type selected!");
    // Don't auto-advance - wait for user to click Next
  };

  const handlePersonalInfoComplete = (data: PersonalInfoFormValues) => {
    console.log("OnboardingHandlers: Personal info completed");
    props.setPersonalInfo(data);
    // Don't auto-advance - wait for user to click Next
  };

  const handleLocationComplete = (data: any) => {
    console.log("OnboardingHandlers: Location completed");
    props.setLocation(data);
    props.setIsLocationValid(true);
    toast.success("Location saved!");
    // Don't auto-advance - wait for user to click Next
  };

  const handlePlanSelected = (plan: PlanType, billingPeriod: 'monthly' | 'annual' = 'monthly') => {
    console.log("OnboardingHandlers: Plan selected:", plan, "Billing:", billingPeriod);
    props.setSelectedPlan(plan);
    props.setBillingPeriod(billingPeriod);
    props.setIsPlanSelected(true);
    toast.success("Plan selected!");
    // Don't auto-advance - wait for user to click Next
  };

  const handlePreAssessmentComplete = () => {
    console.log("OnboardingHandlers: Pre-assessment completed, proceeding to rhythm assessment");
    toast.success("Assessment prepared! Beginning your rhythm analysis.");
    props.setCurrentStep(5);
  };

  const handleRhythmAssessmentComplete = () => {
    console.log("OnboardingHandlers: Rhythm assessment completed, navigating to dashboard");
    toast.success("Assessment complete! Your personalized insights are ready.");
    navigate("/dashboard");
  };

  // Enhanced navigation validation
  const canGoToStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return true; // Always can go to user type
      case 2:
        return props.userType !== null; // Can go to location if user type selected
      case 3:
        return props.userType !== null; // Can go to plan if user type selected (location optional)
      case 4:
        return props.userType !== null && props.selectedPlan !== null; // Need user type and plan
      case 5:
        return props.userType !== null && props.selectedPlan !== null; // Need user type and plan for assessment
      default:
        return false;
    }
  };

  const getStepValidation = () => {
    return {
      canGoNext: (() => {
        switch (props.currentStep) {
          case 1:
            return props.userType !== null;
          case 2:
            return true; // Location is optional
          case 3:
            return props.selectedPlan !== null;
          case 4:
            return true; // Pre-assessment auto-advances
          case 5:
            return true; // Assessment has its own completion logic
          default:
            return false;
        }
      })(),
      canGoPrevious: props.currentStep > 1
    };
  };

  return {
    goToPreviousStep,
    goToNextStep,
    goToStep,
    handleUserTypeComplete,
    handlePersonalInfoComplete,
    handleLocationComplete,
    handlePlanSelected,
    handlePreAssessmentComplete,
    handleRhythmAssessmentComplete,
    canGoToStep,
    getStepValidation
  };
};
