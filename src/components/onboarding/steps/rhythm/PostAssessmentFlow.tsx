
import React, { useState } from "react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { FlowStepRenderer } from "./flow/FlowStepRenderer";
import { FlowNavigation } from "./flow/FlowNavigation";
import { usePaymentHandlers } from "./flow/PaymentHandlers";
import { useFlowHandlers } from "./flow/FlowHandlers";
import { useEncouragement } from "../../../encouragement/EncouragementEngine";

interface PostAssessmentFlowProps {
  assessmentResult: AssessmentResult;
  onComplete: () => void;
}

type FlowStep = "teaser-preview" | "registration-prompt" | "payment" | "results" | "choice" | "user-guide" | "goal-creation" | "life-operating-model-setup" | "complete";

export function PostAssessmentFlow({ assessmentResult, onComplete }: PostAssessmentFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>("teaser-preview");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  const { triggerEncouragement, EncouragementComponent } = useEncouragement();

  const { handlePaymentSelect, handlePaymentOption } = usePaymentHandlers(
    setPaymentCompleted,
    setCurrentStep,
    triggerEncouragement,
    assessmentResult
  );

  const flowHandlers = useFlowHandlers(
    setCurrentStep,
    onComplete,
    triggerEncouragement,
    assessmentResult
  );

  const handleRegistrationPrompt = (action: 'register' | 'continue-guest') => {
    if (action === 'register') {
      // Navigate to registration
      window.location.href = '/auth';
    } else {
      setCurrentStep('payment');
    }
  };

  const handleTeaserComplete = () => {
    setCurrentStep('registration-prompt');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Encouragement Component */}
      {EncouragementComponent}
      
      {/* Step Content */}
      <div className="min-h-[400px]">
        <FlowStepRenderer
          currentStep={currentStep}
          assessmentResult={assessmentResult}
          onPaymentSelect={handlePaymentSelect}
          onPaymentOption={handlePaymentOption}
          onBackToPreview={flowHandlers.handleBackToPreview}
          onExploreGuide={flowHandlers.handleExploreGuide}
          onStartGoals={flowHandlers.handleStartGoals}
          onLifeManagementSetup={flowHandlers.handleLifeManagementSetup}
          onBackToChoice={flowHandlers.handleBackToChoice}
          onGoalCreationComplete={flowHandlers.handleGoalCreationComplete}
          onLifeManagementComplete={flowHandlers.handleLifeManagementComplete}
          onTeaserComplete={handleTeaserComplete}
          onRegistrationPrompt={handleRegistrationPrompt}
        />
      </div>

      {/* Navigation */}
      <FlowNavigation 
        currentStep={currentStep}
        onResultsNext={flowHandlers.handleResultsNext}
      />
    </div>
  );
}
