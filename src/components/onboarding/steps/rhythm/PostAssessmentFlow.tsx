
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Target, Calendar, Settings, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AssessmentResult, focusAreas } from "@/utils/rhythmAnalysis";
import { EncouragingResultsDisplay } from "./EncouragingResultsDisplay";
import { FocusAreaGoalTemplates } from "./FocusAreaGoalTemplates";
import { QuickDashboardSetup } from "./QuickDashboardSetup";
import { PostAssessmentChoiceScreen } from "./PostAssessmentChoiceScreen";
import { LifeManagementSetupWizard } from "./LifeManagementSetupWizard";
import { EnhancedGoalCreationWizard } from "../../../goals/EnhancedGoalCreationWizard";
import { AssessmentResultsPreview } from "./AssessmentResultsPreview";
import { PostAssessmentPayment } from "./PostAssessmentPayment";
import { useEncouragement } from "../../../encouragement/EncouragementEngine";
import { toast } from "sonner";

interface PostAssessmentFlowProps {
  assessmentResult: AssessmentResult;
  onComplete: () => void;
}

type FlowStep = "preview" | "payment" | "results" | "choice" | "user-guide" | "goal-creation" | "life-operating-model-setup" | "complete";

export function PostAssessmentFlow({ assessmentResult, onComplete }: PostAssessmentFlowProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<FlowStep>("preview");
  const [selectedGoals, setSelectedGoals] = useState<any[]>([]);
  const [dashboardConfig, setDashboardConfig] = useState<any>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  const { triggerEncouragement, EncouragementComponent } = useEncouragement();
  const focusInfo = focusAreas[assessmentResult.focusArea];

  const handleUnlockResults = () => {
    setCurrentStep("payment");
  };

  const handlePaymentOption = async (option: 'trial' | 'monthly' | 'annual' | 'skip-trial-monthly') => {
    // Simulate payment processing
    console.log("Processing payment option:", option);
    
    // Show payment processing
    toast.info("Processing your selection...", {
      duration: 2000
    });

    // Simulate API call delay
    setTimeout(() => {
      // Mark payment as completed
      setPaymentCompleted(true);
      localStorage.setItem("myrhythm_payment_completed", "true");
      localStorage.setItem("myrhythm_subscription_active", "true");
      
      // Trigger encouragement for payment success
      triggerEncouragement('payment_success', {
        userType: assessmentResult.userType,
        customMessage: "🎉 Welcome to your personalized MyRhythm experience! Your support circle will now be notified of your progress!"
      });
      
      // Show success toast
      toast.success("Payment successful! 🎉", {
        description: "Your support circle will now be notified of your progress!",
        duration: 5000
      });
      
      // Move to full results
      setCurrentStep("results");
    }, 2000);
  };

  const handleBackToPreview = () => {
    setCurrentStep("preview");
  };

  const handleResultsNext = () => {
    setCurrentStep("choice");
  };

  const handleExploreGuide = () => {
    // Mark onboarding as complete first
    localStorage.setItem("myrhythm_onboarding_complete", "true");
    localStorage.setItem("myrhythm_assessment_complete", "true");
    
    // Navigate to user guide
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
    // Store completion data
    localStorage.setItem("myrhythm_onboarding_complete", "true");
    localStorage.setItem("myrhythm_assessment_complete", "true");
    localStorage.setItem("myrhythm_initial_setup_complete", "true");
    localStorage.setItem("myrhythm_goals_created", "true");
    
    // Trigger goal creation encouragement
    triggerEncouragement('goal_created', {
      userType: assessmentResult.userType
    });
    
    toast.success("Welcome to Your Personalized MyRhythm! 🎉", {
      description: "Your first goal has been created and your journey begins now.",
      duration: 5000
    });
    
    // Navigate directly to dashboard
    navigate("/dashboard");
    onComplete();
  };

  const handleLifeManagementComplete = () => {
    // Store completion data for life operating model setup
    localStorage.setItem("myrhythm_onboarding_complete", "true");
    localStorage.setItem("myrhythm_assessment_complete", "true");
    localStorage.setItem("myrhythm_life_operating_model_setup_complete", "true");
    localStorage.setItem("myrhythm_operating_foundation_established", "true");
    
    toast.success("Your Life Operating Model is Live! 🌟", {
      description: "Your personalized operating system is ready and configured for optimal performance.",
      duration: 5000
    });
    
    // Navigate directly to dashboard
    navigate("/dashboard");
    onComplete();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "preview":
        return (
          <AssessmentResultsPreview 
            assessmentResult={assessmentResult}
            onUnlockResults={handleUnlockResults}
          />
        );
        
      case "payment":
        return (
          <PostAssessmentPayment
            onSelectPaymentOption={handlePaymentOption}
            onBack={handleBackToPreview}
          />
        );
        
      case "results":
        return <EncouragingResultsDisplay assessmentResult={assessmentResult} />;
        
      case "choice":
        return (
          <PostAssessmentChoiceScreen
            onExploreGuide={handleExploreGuide}
            onStartGoals={handleStartGoals}
            onLifeManagementSetup={handleLifeManagementSetup}
            assessmentResult={assessmentResult}
          />
        );
        
      case "goal-creation":
        return (
          <EnhancedGoalCreationWizard
            onComplete={handleGoalCreationComplete}
            focusArea={assessmentResult.focusArea}
          />
        );

      case "life-operating-model-setup":
        return (
          <LifeManagementSetupWizard
            onComplete={handleLifeManagementComplete}
            onBack={handleBackToChoice}
            assessmentResult={assessmentResult}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Encouragement Component */}
      {EncouragementComponent}
      
      {/* Step Content */}
      <div className="min-h-[400px]">
        {renderStepContent()}
      </div>

      {/* Navigation - only show for results step */}
      {currentStep === "results" && (
        <div className="flex justify-center pt-6 border-t">
          <Button onClick={handleResultsNext} className="bg-gradient-to-r from-primary to-primary/80">
            Continue to Next Steps
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
