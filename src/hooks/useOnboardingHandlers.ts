
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
    props.setCurrentStep(4); // Go directly to pre-assessment (step 4) - skip payment
  };

  const handlePreAssessmentComplete = () => {
    console.log("OnboardingHandlers: Pre-assessment completed, proceeding to rhythm assessment");
    props.setCurrentStep(5); // Go to rhythm assessment (step 5)
  };

  const handleRhythmAssessmentComplete = () => {
    console.log("OnboardingHandlers: Rhythm assessment completed, navigating to mobile onboarding");
    toast.success("Assessment complete! Let's set up your mobile experience.");
    navigate("/onboarding"); // Navigate to mobile onboarding
  };

  return {
    goToPreviousStep,
    handleUserTypeComplete,
    handlePersonalInfoComplete,
    handleLocationComplete,
    handlePlanSelected,
    handlePreAssessmentComplete,
    handleRhythmAssessmentComplete,
  };
};
