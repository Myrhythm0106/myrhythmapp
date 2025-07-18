import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserType } from "@/types/user";
import { PostAssessmentWelcomeDashboard } from "./PostAssessmentWelcomeDashboard";
import { InteractiveUserGuide } from "./InteractiveUserGuide";
import { PostAssessmentManager } from "./post-assessment/PostAssessmentManager";
import { NextStepsWidget } from "./NextStepsWidget";
import { HelpOrientationSystem } from "./HelpOrientationSystem";

interface PostAssessmentFlowProps {
  userType: UserType;
  assessmentResult: any;
  onComplete: (data: any) => void;
}

export function PostAssessmentFlow({ userType, assessmentResult, onComplete }: PostAssessmentFlowProps) {
  const [activeStep, setActiveStep] = useState<
    "welcome" | "guide" | "setup" | "complete"
  >("welcome");
  const [showHelp, setShowHelp] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);

  const handleStepComplete = (data?: any) => {
    if (activeStep === "welcome") {
      setActiveStep("setup");
      setSetupProgress(25);
    } else if (activeStep === "guide") {
      setActiveStep("setup");
      setSetupProgress(25);
    } else if (activeStep === "setup") {
      setActiveStep("complete");
      setSetupProgress(100);
      onComplete(data || {});
    }
  };

  const handleWelcomeContinue = () => {
    handleStepComplete();
  };

  const handleGuideComplete = () => {
    handleStepComplete();
  };

  const handleSetupComplete = () => {
    handleStepComplete({ setupCompleted: true });
  };

  const handleNextAction = () => {
    handleStepComplete();
  };

  const handleShowGuide = () => {
    setActiveStep("guide");
  };

  const handleSetupProgress = (progress: number) => {
    setSetupProgress(progress);
  };

  const handleNavigateTo = (location: string) => {
    switch (location) {
      case 'life_setup':
        setActiveStep("setup");
        setSetupProgress(25);
        break;
      case 'user_guide':
        setActiveStep("guide");
        break;
      case 'dashboard':
        setActiveStep("complete");
        onComplete({ skipToEnd: true });
        break;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case "welcome":
        return (
          <PostAssessmentWelcomeDashboard
            userType={userType}
            assessmentResult={assessmentResult}
            onContinue={handleWelcomeContinue}
          />
        );
      case "guide":
        return (
          <InteractiveUserGuide
            onComplete={handleGuideComplete}
            onSkip={handleGuideComplete}
          />
        );
      case "setup":
        return (
          <PostAssessmentManager
            userType={userType}
            assessmentResult={assessmentResult}
            onComplete={handleSetupComplete}
          />
        );
      case "complete":
        return (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🎉</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Setup Complete!</h2>
              <p className="text-muted-foreground">
                You're all set to start living your MYRHYTHM. Your dashboard is ready!
              </p>
            </div>
          </div>
        );
      default:
        return <p>Loading...</p>;
    }
  };

  const getCurrentStepForWidget = () => {
    switch (activeStep) {
      case "welcome":
        return "assessment_complete";
      case "setup":
        return "calendar_setup"; // This could be more dynamic based on PostAssessmentManager state
      case "complete":
        return "setup_complete";
      default:
        return "assessment_complete";
    }
  };

  return (
    <div className="relative min-h-screen">
      {renderStepContent()}
      
      {/* Next Steps Widget - Always visible except on complete */}
      {activeStep !== "complete" && (
        <NextStepsWidget
          currentStep={getCurrentStepForWidget()}
          onNextAction={handleNextAction}
          onGetHelp={() => setShowHelp(true)}
          completionPercentage={setupProgress}
        />
      )}

      {/* Help Orientation System */}
      {showHelp && (
        <HelpOrientationSystem
          currentLocation={getCurrentStepForWidget()}
          onClose={() => setShowHelp(false)}
          onNavigateTo={handleNavigateTo}
          onStartOver={() => {
            setActiveStep("welcome");
            setSetupProgress(0);
          }}
        />
      )}
    </div>
  );
}
