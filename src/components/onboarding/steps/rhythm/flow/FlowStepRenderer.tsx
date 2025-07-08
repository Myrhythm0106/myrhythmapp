
import React from "react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { AssessmentTeaserPreview } from "../AssessmentTeaserPreview";
import { RegistrationPrompt } from "../RegistrationPrompt";
import { PostAssessmentPayment } from "../PostAssessmentPayment";
import { PersonalizedResultsDisplay } from "../PersonalizedResultsDisplay";
import { PostAssessmentChoiceScreen } from "../PostAssessmentChoiceScreen";
import { MyRhythmFrameworkDisplay } from "../MyRhythmFrameworkDisplay";
import { FocusAreaGoalTemplates } from "../FocusAreaGoalTemplates";
import { LifeManagementSetupWizard } from "../LifeManagementSetupWizard";

type FlowStep = "teaser-preview" | "registration-prompt" | "payment" | "results" | "choice" | "user-guide" | "goal-creation" | "life-operating-model-setup" | "complete";

interface FlowStepRendererProps {
  currentStep: FlowStep;
  assessmentResult: AssessmentResult;
  onPaymentSelect: (option: 'trial' | 'monthly' | 'annual' | 'skip-trial-monthly') => void;
  onPaymentOption: (option: 'trial' | 'monthly' | 'annual' | 'skip-trial-monthly') => void;
  onBackToPreview: () => void;
  onExploreGuide: () => void;
  onStartGoals: () => void;
  onLifeManagementSetup: () => void;
  onBackToChoice: () => void;
  onGoalCreationComplete: () => void;
  onLifeManagementComplete: () => void;
  onTeaserComplete: () => void;
  onRegistrationPrompt: (action: 'register' | 'continue-guest') => void;
}

export function FlowStepRenderer({
  currentStep,
  assessmentResult,
  onPaymentSelect,
  onPaymentOption,
  onBackToPreview,
  onExploreGuide,
  onStartGoals,
  onLifeManagementSetup,
  onBackToChoice,
  onGoalCreationComplete,
  onLifeManagementComplete,
  onTeaserComplete,
  onRegistrationPrompt
}: FlowStepRendererProps) {
  const renderStep = () => {
    switch (currentStep) {
      case "teaser-preview":
        return (
          <AssessmentTeaserPreview
            assessmentResult={assessmentResult}
            onContinue={onTeaserComplete}
          />
        );

      case "registration-prompt":
        return (
          <RegistrationPrompt
            onRegister={() => onRegistrationPrompt('register')}
            onContinueGuest={() => onRegistrationPrompt('continue-guest')}
          />
        );

      case "payment":
        return (
          <PostAssessmentPayment
            onSelectPaymentOption={onPaymentOption}
            onBack={onBackToPreview}
          />
        );

      case "results":
        return (
          <PersonalizedResultsDisplay
            assessmentResult={assessmentResult}
            onContinue={onBackToChoice}
          />
        );

      case "choice":
        return (
          <PostAssessmentChoiceScreen
            assessmentResult={assessmentResult}
            onExploreGuide={onExploreGuide}
            onStartGoals={onStartGoals}
            onLifeManagementSetup={onLifeManagementSetup}
          />
        );

      case "user-guide":
        return (
          <MyRhythmFrameworkDisplay
            onBack={onBackToChoice}
          />
        );

      case "goal-creation":
        return (
          <FocusAreaGoalTemplates
            focusArea={assessmentResult.focusArea}
            onComplete={onGoalCreationComplete}
          />
        );

      case "life-operating-model-setup":
        return (
          <LifeManagementSetupWizard
            assessmentResult={assessmentResult}
            onComplete={onLifeManagementComplete}
            onBack={onBackToChoice}
          />
        );

      case "complete":
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Setup Complete!</h2>
            <p className="text-gray-600">Welcome to your personalized MyRhythm experience.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return <div>{renderStep()}</div>;
}
