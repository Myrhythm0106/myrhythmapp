
import React from "react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { AssessmentResultsPreview } from "../AssessmentResultsPreview";
import { AssessmentTeaserPreview } from "../AssessmentTeaserPreview";
import { EncouragingResultsDisplay } from "../EncouragingResultsDisplay";
import { UserGuideIntegration } from "../UserGuideIntegration";
import { GoalCreationFlow } from "../GoalCreationFlow";
import { LifeOperatingModelSetup } from "../LifeOperatingModelSetup";
import { RegistrationPrompt } from "../RegistrationPrompt";
import { UserType } from "../../UserTypeStep";

interface FlowStepRendererProps {
  currentStep: string;
  assessmentResult: AssessmentResult;
  userType?: UserType | null;
  onBackToPreview: () => void;
  onExploreGuide: () => void;
  onStartGoals: () => void;
  onLifeManagementSetup: () => void;
  onBackToChoice: () => void;
  onGoalCreationComplete: () => void;
  onLifeManagementComplete: () => void;
  onTeaserComplete: () => void;
  onRegistrationPrompt: (action: 'register' | 'continue-guest') => void;
  onSeePricing?: () => void;
}

export function FlowStepRenderer({
  currentStep,
  assessmentResult,
  userType,
  onBackToPreview,
  onExploreGuide,
  onStartGoals,
  onLifeManagementSetup,
  onBackToChoice,
  onGoalCreationComplete,
  onLifeManagementComplete,
  onTeaserComplete,
  onRegistrationPrompt,
  onSeePricing
}: FlowStepRendererProps) {
  switch (currentStep) {
    case "teaser-preview":
      return (
        <AssessmentTeaserPreview
          assessmentResult={assessmentResult}
          onContinue={onTeaserComplete}
          userType={userType}
          onSeePricing={onSeePricing}
        />
      );

    case "registration-prompt":
      return (
        <RegistrationPrompt
          onAction={onRegistrationPrompt}
          userType={userType}
        />
      );

    case "results":
      return (
        <EncouragingResultsDisplay
          assessmentResult={assessmentResult}
          userType={userType}
        />
      );

    case "choice":
      return (
        <AssessmentResultsPreview
          assessmentResult={assessmentResult}
          onPaymentSelect={(option) => {
            if (option === 'trial' || option === 'monthly' || option === 'annual') {
              // Handle payment selection
              console.log('Payment option selected:', option);
            } else {
              // Handle skip - continue to user guide
              onExploreGuide();
            }
          }}
          userType={userType}
        />
      );

    case "user-guide":
      return (
        <UserGuideIntegration
          assessmentResult={assessmentResult}
          onBack={onBackToChoice}
          onContinue={onStartGoals}
          userType={userType}
        />
      );

    case "goal-creation":
      return (
        <GoalCreationFlow
          assessmentResult={assessmentResult}
          onComplete={onGoalCreationComplete}
          onBack={onBackToChoice}
          userType={userType}
        />
      );

    case "life-operating-model-setup":
      return (
        <LifeOperatingModelSetup
          assessmentResult={assessmentResult}
          onComplete={onLifeManagementComplete}
          onBack={onBackToChoice}
          userType={userType}
        />
      );

    default:
      return null;
  }
}
