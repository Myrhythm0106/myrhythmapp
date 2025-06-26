
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type FlowStep = "teaser-preview" | "registration-prompt" | "payment" | "results" | "choice" | "user-guide" | "goal-creation" | "life-operating-model-setup" | "complete";

export const useFlowHandlers = (
  setCurrentStep: (step: FlowStep) => void,
  onComplete: () => void,
  triggerEncouragement: (type: string, data: any) => void,
  assessmentResult: any
) => {
  const navigate = useNavigate();

  const handleBackToPreview = () => {
    setCurrentStep("teaser-preview");
  };

  const handleResultsNext = () => {
    setCurrentStep("choice");
  };

  const handleExploreGuide = () => {
    localStorage.setItem("myrhythm_onboarding_complete", "true");
    localStorage.setItem("myrhythm_assessment_complete", "true");
    
    navigate("/user-guide");
    onComplete();
  };

  const handleStartGoals = () => {
    setCurrentStep("goal-creation");
  };

  const handleLifeManagementSetup = () => {
    setCurrentStep("life-operating-model-setup");
  };

  const handleBackToChoice = () => {
    setCurrentStep("choice");
  };

  const handleGoalCreationComplete = () => {
    localStorage.setItem("myrhythm_onboarding_complete", "true");
    localStorage.setItem("myrhythm_assessment_complete", "true");
    localStorage.setItem("myrhythm_initial_setup_complete", "true");
    localStorage.setItem("myrhythm_goals_created", "true");
    
    triggerEncouragement('goal_created', {
      userType: assessmentResult.userType
    });
    
    toast.success("Welcome to Your Personalized MyRhythm! 🎉", {
      description: "Your first goal has been created and your journey begins now.",
      duration: 5000
    });
    
    navigate("/dashboard");
    onComplete();
  };

  const handleLifeManagementComplete = () => {
    localStorage.setItem("myrhythm_onboarding_complete", "true");
    localStorage.setItem("myrhythm_assessment_complete", "true");
    localStorage.setItem("myrhythm_life_operating_model_setup_complete", "true");
    localStorage.setItem("myrhythm_operating_foundation_established", "true");
    
    toast.success("Your Life Operating Model is Live! 🌟", {
      description: "Your personalized operating system is ready and configured for optimal performance.",
      duration: 5000
    });
    
    navigate("/dashboard");
    onComplete();
  };

  return {
    handleBackToPreview,
    handleResultsNext,
    handleExploreGuide,
    handleStartGoals,
    handleLifeManagementSetup,
    handleBackToChoice,
    handleGoalCreationComplete,
    handleLifeManagementComplete
  };
};
