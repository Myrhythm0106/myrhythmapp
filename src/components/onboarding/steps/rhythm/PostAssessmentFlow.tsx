import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserType } from "@/types/user";
import { PostAssessmentWelcomeDashboard } from "./PostAssessmentWelcomeDashboard";
import { InteractiveUserGuide } from "./InteractiveUserGuide";
import { PostAssessmentManager } from "./post-assessment/PostAssessmentManager";
import { NextStepsWidget } from "./NextStepsWidget";
import { HelpOrientationSystem } from "./HelpOrientationSystem";
import { PersonalizedResultsDisplay } from "./PersonalizedResultsDisplay";
import { AssessmentResultsPreview } from "./AssessmentResultsPreview";
import { AssessmentPaymentGate } from "./AssessmentPaymentGate";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface PostAssessmentFlowProps {
  userType: UserType;
  assessmentResult: any;
  onComplete: (data: any) => void;
  onPaymentRequired?: () => void;
}

export function PostAssessmentFlow({ userType, assessmentResult, onComplete, onPaymentRequired }: PostAssessmentFlowProps) {
  const { hasFeature, subscriptionData, tier } = useSubscription();
  
  // Determine initial step based on subscription status
  const getInitialStep = () => {
    console.log("PostAssessmentFlow: Checking subscription status", { 
      tier, 
      subscribed: subscriptionData.subscribed,
      hasPremiumFeatures: hasFeature('personalizedInsights')
    });
    
    // If user has premium features or is subscribed, skip payment gate
    if (tier !== 'free' || subscriptionData.subscribed || hasFeature('personalizedInsights')) {
      console.log("PostAssessmentFlow: User has premium access, skipping payment gate");
      return "results";
    }
    
    console.log("PostAssessmentFlow: User needs payment, showing payment gate");
    return "payment-gate";
  };
  
  const [activeStep, setActiveStep] = useState<
    "payment-gate" | "results" | "welcome" | "guide" | "setup" | "complete"
  >(getInitialStep());
  const [showHelp, setShowHelp] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);

  const showFullResults = hasFeature('personalizedInsights');

  const handleStepComplete = (data?: any) => {
    if (activeStep === "payment-gate") {
      setActiveStep("results");
    } else if (activeStep === "results") {
      setActiveStep("welcome");
    } else if (activeStep === "welcome") {
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

  const handlePaymentSelect = (option: 'trial' | 'monthly' | 'annual' | 'skip') => {
    if (option === 'skip') {
      setActiveStep("results");
    } else {
      // Handle payment processing here
      onPaymentRequired?.();
      setActiveStep("results");
    }
  };

  const handleContinueWithFree = () => {
    setActiveStep("results");
  };

  const handleUpgrade = () => {
    // TODO: Navigate to upgrade flow
    console.log("Navigate to upgrade");
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
      case "payment-gate":
        return (
          <AssessmentPaymentGate
            assessmentResult={assessmentResult}
            onPaymentSelect={handlePaymentSelect}
            onContinueWithFree={handleContinueWithFree}
            userType={userType}
            daysLeft={subscriptionData.trial_days_left}
          />
        );
      case "results":
        return showFullResults ? (
          <PersonalizedResultsDisplay
            assessmentResult={assessmentResult}
            onContinue={handleStepComplete}
          />
        ) : (
          <AssessmentResultsPreview
            assessmentResult={assessmentResult}
            onUpgrade={handleUpgrade}
            onContinue={handleStepComplete}
            daysLeft={subscriptionData.trial_days_left}
          />
        );
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
      case "payment-gate":
        return "assessment_complete";
      case "results":
        return "assessment_complete";
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
      
      {/* Next Steps Widget - Always visible except on complete, results, and payment-gate */}
      {activeStep !== "complete" && activeStep !== "results" && activeStep !== "payment-gate" && (
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
