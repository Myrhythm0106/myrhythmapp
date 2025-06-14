
import React from "react";
import { AssessmentResultsPreview } from "../AssessmentResultsPreview";
import { PostAssessmentPayment } from "../PostAssessmentPayment";
import { EncouragingResultsDisplay } from "../EncouragingResultsDisplay";
import { PostAssessmentChoiceScreen } from "../PostAssessmentChoiceScreen";
import { EnhancedGoalCreationWizard } from "../../../../goals/EnhancedGoalCreationWizard";
import { LifeManagementSetupWizard } from "../LifeManagementSetupWizard";
import { AssessmentResult } from "@/utils/rhythmAnalysis";

type FlowStep = "preview" | "payment" | "results" | "choice" | "user-guide" | "goal-creation" | "life-operating-model-setup" | "complete";

interface FlowStepRendererProps {
  currentStep: FlowStep;
  assessmentResult: AssessmentResult;
  onPaymentSelect: (option: 'trial' | 'monthly' | 'annual' | 'skip') => void;
  onPaymentOption: (option: 'trial' | 'monthly' | 'annual' | 'skip-trial-monthly') => void;
  onBackToPreview: () => void;
  onExploreGuide: () => void;
  onStartGoals: () => void;
  onLifeManagementSetup: () => void;
  onBackToChoice: () => void;
  onGoalCreationComplete: () => void;
  onLifeManagementComplete: () => void;
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
  onLifeManagementComplete
}: FlowStepRendererProps) {
  switch (currentStep) {
    case "preview":
      return (
        <AssessmentResultsPreview 
          assessmentResult={assessmentResult}
          onPaymentSelect={onPaymentSelect}
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
      return <EncouragingResultsDisplay assessmentResult={assessmentResult} />;
      
    case "choice":
      return (
        <PostAssessmentChoiceScreen
          onExploreGuide={onExploreGuide}
          onStartGoals={onStartGoals}
          onLifeManagementSetup={onLifeManagementSetup}
          assessmentResult={assessmentResult}
        />
      );
      
    case "goal-creation":
      return (
        <EnhancedGoalCreationWizard
          onComplete={onGoalCreationComplete}
          focusArea={assessmentResult.focusArea}
        />
      );

    case "life-operating-model-setup":
      return (
        <LifeManagementSetupWizard
          onComplete={onLifeManagementComplete}
          onBack={onBackToChoice}
          assessmentResult={assessmentResult}
        />
      );
      
    default:
      return null;
  }
}
