
import React, { useState } from "react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { UserType } from "../../UserTypeStep";
import { RhythmAssessmentIntro } from "../RhythmAssessmentIntro";
import { RhythmAssessmentView } from "../RhythmAssessmentView";
import { AssessmentCompiling } from "../AssessmentCompiling";
import { useRhythmAssessment } from "@/hooks/useRhythmAssessment";

interface AssessmentFlowManagerProps {
  userType?: UserType | null;
  onComplete: (result: AssessmentResult) => void;
}

export function AssessmentFlowManager({ userType, onComplete }: AssessmentFlowManagerProps) {
  const {
    hasStarted,
    currentSection,
    responses,
    isCompiling,
    assessmentResult,
    compilationError,
    sections,
    isRestoringFromSave,
    handleResponse,
    handleNext,
    handleCompilationComplete,
    handleManualContinue,
    handleBack,
    handleBeginAssessment,
    handleRetry
  } = useRhythmAssessment(userType);

  React.useEffect(() => {
    if (assessmentResult) {
      console.log("AssessmentFlowManager: Assessment result received, calling onComplete");
      onComplete(assessmentResult);
    }
  }, [assessmentResult, onComplete]);

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

  return (
    <RhythmAssessmentView
      currentSection={currentSection}
      responses={responses}
      onResponse={handleResponse}
      onNext={handleNext}
      onBack={handleBack}
      sections={sections}
      userType={userType}
      isRestoringFromSave={isRestoringFromSave}
    />
  );
}
