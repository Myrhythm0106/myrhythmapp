
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PersonalInfoFormValues } from "@/components/onboarding/steps/PersonalInfoStep";
import { PlanType } from "@/components/onboarding/steps/PlanStep";
import { PaymentFormValues } from "@/components/onboarding/steps/PaymentStep";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";
import { analyzeRhythmAssessment } from "@/utils/rhythmAnalysis";
import { useAuth } from "@/contexts/AuthContext";

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
  setAssessmentResult?: (result: any) => void;
  setIsCompiling?: (compiling: boolean) => void;
  setShowSummary?: (show: boolean) => void;
}

export const useOnboardingHandlers = (props: UseOnboardingHandlersProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
    
    // If user is already authenticated, skip personal info step (step 2) and go to step 3
    if (user) {
      // Pre-populate personal info from authenticated user
      const personalInfo: PersonalInfoFormValues = {
        name: user.user_metadata?.name || user.email?.split('@')[0] || '',
        email: user.email || '',
        password: '' // Not needed for authenticated users
      };
      props.setPersonalInfo(personalInfo);
      props.setCurrentStep(3); // Skip to location step
    } else {
      props.setCurrentStep(2); // Go to personal info step
    }
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
    
    // Skip payment step in onboarding - go directly to pre-assessment compilation
    // Payment will be handled in the post-assessment flow
    props.setCurrentStep(5); // Pre-assessment compilation
  };

  const handlePaymentComplete = (paymentData: PaymentFormValues) => {
    // This is now handled in the post-assessment flow
    props.setPaymentData(paymentData);
    props.setShowPaymentConfirmation(true);
  };

  const handlePaymentConfirm = () => {
    props.setShowPaymentConfirmation(false);
    props.setCurrentStep(5); // Go to pre-assessment compilation
    toast.success("Payment processed successfully!");
  };

  const handlePreAssessmentComplete = () => {
    props.setCurrentStep(6); // Go to actual assessment
  };

  const handleRhythmAssessmentComplete = (responses: any) => {
    // Get user type from localStorage
    const userType = localStorage.getItem("myrhythm_user_type") as UserType | null;
    
    // Assessment complete - analyze and show summary with personalized insights
    const analysisResult = analyzeRhythmAssessment(responses, userType || undefined);
    const completedAt = new Date().toISOString();
    const nextReviewDate = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const result: any = {
      id: `assessment-${Date.now()}`,
      completedAt,
      focusArea: analysisResult.focusArea,
      sectionScores: analysisResult.sectionScores,
      overallScore: analysisResult.overallScore,
      determinationReason: analysisResult.determinationReason,
      version: "1.0",
      nextReviewDate,
      userType: userType || undefined,
      personalizedData: analysisResult.personalizedData // Include personalized insights
    };
    
    // Store the assessment result but don't mark onboarding as complete yet
    localStorage.setItem("myrhythm_current_assessment", JSON.stringify(result));
    
    // DON'T navigate to dashboard yet - stay in onboarding flow
    // The PostAssessmentFlow will handle the preview -> payment -> results flow
    console.log("Assessment completed, moving to preview flow");
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
