
import React from "react";
import { RhythmAssessmentView } from "./rhythm/RhythmAssessmentView";
import { AssessmentCompiling } from "./rhythm/AssessmentCompiling";
import { RhythmAssessmentIntro } from "./rhythm/RhythmAssessmentIntro";
import { PostAssessmentFlow } from "./rhythm/PostAssessmentFlow";
import { useRhythmAssessment } from "@/hooks/useRhythmAssessment";

interface RhythmAssessmentStepProps {
  onComplete: (responses: any) => void;
}

export function RhythmAssessmentStep({ onComplete }: RhythmAssessmentStepProps) {
  const {
    hasStarted,
    currentSection,
    responses,
    isCompiling,
    showSummary,
    assessmentResult,
    sections,
    userType,
    handleResponse,
    handleNext,
    handleCompilationComplete,
    handleBack,
    handleBeginAssessment
  } = useRhythmAssessment();

  const handlePostAssessmentComplete = () => {
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
    return <AssessmentCompiling onComplete={handleCompilationComplete} />;
  }

  if (showSummary && assessmentResult) {
    return (
      <PostAssessmentFlow
        assessmentResult={assessmentResult}
        onComplete={handlePostAssessmentComplete}
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
