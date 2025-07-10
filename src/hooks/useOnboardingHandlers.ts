
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
    console.log("OnboardingHandlers: Going to previous step from", props.currentStep);
    if (props.currentStep > 1) {
      props.setCurrentStep(props.currentStep - 1);
    }
  };

  const goToNextStep = () => {
    console.log("OnboardingHandlers: Going to next step from", props.currentStep);
    if (props.currentStep < props.totalSteps) {
      props.setCurrentStep(props.currentStep + 1);
    } else if (props.currentStep === props.totalSteps) {
      // If on last step, complete onboarding
      console.log("OnboardingHandlers: Completing onboarding, navigating to dashboard");
      navigate("/dashboard");
    }
  };

  const goToStep = (stepNumber: number) => {
    console.log("OnboardingHandlers: Going to step", stepNumber);
    if (stepNumber >= 1 && stepNumber <= props.totalSteps) {
      props.setCurrentStep(stepNumber);
    }
  };

  const handleUserTypeComplete = (data: { type: UserType }) => {
    console.log("OnboardingHandlers: User type selected:", data.type);
    props.setUserType(data.type);
    props.setIsUserTypeSelected(true);
    toast.success("User type selected!");
  };

  const handlePersonalInfoComplete = (data: PersonalInfoFormValues) => {
    console.log("OnboardingHandlers: Personal info completed");
    props.setPersonalInfo(data);
    toast.success("Personal information saved!");
  };

  const handleLocationComplete = (data: any) => {
    console.log("OnboardingHandlers: Location completed");
    props.setLocation(data);
    props.setIsLocationValid(true);
    toast.success("Location saved!");
  };

  const handlePlanSelected = (plan: PlanType, billingPeriod: 'monthly' | 'annual' = 'monthly') => {
    console.log("OnboardingHandlers: Plan selected:", plan, "Billing:", billingPeriod);
    props.setSelectedPlan(plan);
    props.setBillingPeriod(billingPeriod);
    props.setIsPlanSelected(true);
    toast.success("Plan selected!");
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
    const validation = {
      canGoNext: (() => {
        switch (props.currentStep) {
          case 1:
            const hasUserType = props.userType !== null;
            console.log("Step 1 validation - hasUserType:", hasUserType, "userType:", props.userType);
            return hasUserType;
          case 2:
            console.log("Step 2 validation - location is optional, can always proceed");
            return true; // Location is optional
          case 3:
            const hasPlan = props.selectedPlan !== null;
            console.log("Step 3 validation - hasPlan:", hasPlan, "selectedPlan:", props.selectedPlan);
            return hasPlan;
          case 4:
            console.log("Step 4 validation - pre-assessment auto-advances");
            return true; // Pre-assessment auto-advances
          case 5:
            console.log("Step 5 validation - assessment has its own completion logic");
            return true; // Assessment has its own completion logic
          default:
            return false;
        }
      })(),
      canGoPrevious: props.currentStep > 1
    };
    
    console.log("Step validation result:", validation);
    return validation;
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
