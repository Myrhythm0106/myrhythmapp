
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
import { toast } from "sonner";

interface PostAssessmentFlowProps {
  assessmentResult: AssessmentResult;
  onComplete: () => void;
}

type FlowStep = "results" | "choice" | "user-guide" | "goal-creation" | "life-management-setup" | "complete";

export function PostAssessmentFlow({ assessmentResult, onComplete }: PostAssessmentFlowProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<FlowStep>("results");
  const [selectedGoals, setSelectedGoals] = useState<any[]>([]);
  const [dashboardConfig, setDashboardConfig] = useState<any>(null);
  
  const focusInfo = focusAreas[assessmentResult.focusArea];

  const handleResultsNext = () => {
    setCurrentStep("choice");
  };

  const handleExploreGuide = () => {
    // Navigate to user guide
    navigate("/user-guide");
    onComplete();
  };

  const handleStartGoals = () => {
    setCurrentStep("goal-creation");
  };

  const handleLifeManagementSetup = () => {
    setCurrentStep("life-management-setup");
  };

  const handleBackToChoice = () => {
    setCurrentStep("choice");
  };

  const handleGoalCreationComplete = () => {
    // Store completion data
    localStorage.setItem("myrhythm_initial_setup_complete", "true");
    localStorage.setItem("myrhythm_goals_created", "true");
    
    toast.success("Welcome to Your Personalized MyRhythm! 🎉", {
      description: "Your first goal has been created and your journey begins now.",
      duration: 5000
    });
    
    // Navigate directly to dashboard
    navigate("/dashboard");
    onComplete();
  };

  const handleLifeManagementComplete = () => {
    // Store completion data for life management setup
    localStorage.setItem("myrhythm_life_management_setup_complete", "true");
    localStorage.setItem("myrhythm_foundation_established", "true");
    
    toast.success("Your Life Management Foundation is Complete! 🌟", {
      description: "Your personalized MyRhythm system is ready and configured for success.",
      duration: 5000
    });
    
    // Navigate directly to dashboard
    navigate("/dashboard");
    onComplete();
  };

  const renderStepContent = () => {
    switch (currentStep) {
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

      case "life-management-setup":
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
