
import React from "react";
import { RhythmAssessmentView } from "./rhythm/RhythmAssessmentView";
import { AssessmentCompiling } from "./rhythm/AssessmentCompiling";
import { RhythmAssessmentIntro } from "./rhythm/RhythmAssessmentIntro";
import { PostAssessmentFlow } from "./rhythm/PostAssessmentFlow";
import { useRhythmAssessment } from "@/hooks/useRhythmAssessment";
import { UserType } from "./UserTypeStep";

interface RhythmAssessmentStepProps {
  onComplete: (responses: any) => void;
  userType?: UserType | null;
  hasPaidPremium?: boolean;
}

export function RhythmAssessmentStep({ onComplete, userType, hasPaidPremium = false }: RhythmAssessmentStepProps) {
  console.log("RhythmAssessmentStep: Rendering with userType:", userType);
  
  const {
    hasStarted,
    currentSection,
    responses,
    isCompiling,
    showSummary,
    assessmentResult,
    compilationError,
    sections,
    handleResponse,
    handleNext,
    handleCompilationComplete,
    handleManualContinue,
    handleBack,
    handleBeginAssessment,
    handleRetry
  } = useRhythmAssessment(userType);

  const handlePostAssessmentComplete = () => {
    console.log("RhythmAssessmentStep: Assessment completed, calling onComplete");
    onComplete(responses);
  };

  if (!hasStarted) {
    return (
      <RhythmAssessmentIntro
        onBeginAssessment={handleBeginAssessment}
        userType={userType}
      />
    );
  }

  if (isCompiling) {
    return (
      <AssessmentCompiling 
        onComplete={handleCompilationComplete}
        error={compilationError}
        onManualContinue={handleManualContinue}
        onRetry={handleRetry}
      />
    );
  }

  if (showSummary && assessmentResult) {
    return (
      <PostAssessmentFlow
        assessmentResult={assessmentResult}
        onComplete={handlePostAssessmentComplete}
        userType={userType}
        hasPaidPremium={hasPaidPremium}
      />
    );
  }

  return (
    <RhythmAssessmentView
      currentSection={currentSection}
      responses={responses}
      onResponse={handleResponse}
      onNext={handleNext}
      onBack={handleBack}
      sections={sections}
      userType={userType}
    />
  );
}
