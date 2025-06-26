
import React from "react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { AssessmentResultsPreview } from "../AssessmentResultsPreview";
import { PostAssessmentPayment } from "../PostAssessmentPayment";
import { PersonalizedResultsDisplay } from "../PersonalizedResultsDisplay";
import { PostAssessmentChoiceScreen } from "../PostAssessmentChoiceScreen";
import { MyRhythmFrameworkDisplay } from "../MyRhythmFrameworkDisplay";
import { FocusAreaGoalTemplates } from "../FocusAreaGoalTemplates";
import { LifeManagementSetupWizard } from "../LifeManagementSetupWizard";
import { SetupCompleteStep } from "../setup-steps/SetupCompleteStep";
import { AssessmentTeaserPreview } from "../AssessmentTeaserPreview";
import { RegistrationPrompt } from "../RegistrationPrompt";

type FlowStep = "teaser-preview" | "registration-prompt" | "payment" | "results" | "choice" | "user-guide" | "goal-creation" | "life-operating-model-setup" | "complete";

interface FlowStepRendererProps {
  currentStep: FlowStep;
  assessmentResult: AssessmentResult;
  onPaymentSelect?: (option: 'trial' | 'monthly' | 'annual' | 'skip') => void;
  onPaymentOption?: (option: 'trial' | 'monthly' | 'annual') => void;
  onBackToPreview?: () => void;
  onExploreGuide?: () => void;
  onStartGoals?: () => void;
  onLifeManagementSetup?: () => void;
  onBackToChoice?: () => void;
  onGoalCreationComplete?: (goalData: any) => void;
  onLifeManagementComplete?: (setupData: any) => void;
  onTeaserComplete?: () => void;
  onRegistrationPrompt?: (action: 'register' | 'continue-guest') => void;
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
  onRegistrationPrompt,
}: FlowStepRendererProps) {
  
  switch (currentStep) {
    case "teaser-preview":
      return (
        <AssessmentTeaserPreview
          assessmentResult={assessmentResult}
          onContinue={onTeaserComplete || (() => {})}
        />
      );

    case "registration-prompt":
      return (
        <RegistrationPrompt
          onRegistrationChoice={onRegistrationPrompt || (() => {})}
        />
      );

    case "payment":
      return (
        <PostAssessmentPayment
          onSelectPaymentOption={onPaymentOption || (() => {})}
          onBack={onBackToPreview || (() => {})}
        />
      );

    case "results":
      return (
        <PersonalizedResultsDisplay
          assessmentResult={assessmentResult}
          onContinue={() => {}}
        />
      );

    case "choice":
      return (
        <PostAssessmentChoiceScreen
          assessmentResult={assessmentResult}
          onExploreGuide={onExploreGuide || (() => {})}
          onStartGoals={onStartGoals || (() => {})}
          onLifeManagementSetup={onLifeManagementSetup || (() => {})}
        />
      );

    case "user-guide":
      return (
        <MyRhythmFrameworkDisplay />
      );

    case "goal-creation":
      return (
        <FocusAreaGoalTemplates
          focusArea={assessmentResult.focusArea}
          onBack={onBackToChoice || (() => {})}
        />
      );

    case "life-operating-model-setup":
      return (
        <LifeManagementSetupWizard
          assessmentResult={assessmentResult}
          onComplete={() => onLifeManagementComplete?.({})}
          onBack={onBackToChoice || (() => {})}
        />
      );

    case "complete":
      return (
        <SetupCompleteStep
          onComplete={() => {}}
          setupData={{}}
          assessmentResult={assessmentResult}
        />
      );

    default:
      return (
        <AssessmentTeaserPreview
          assessmentResult={assessmentResult}
          onContinue={onTeaserComplete || (() => {})}
        />
      );
  }
}
