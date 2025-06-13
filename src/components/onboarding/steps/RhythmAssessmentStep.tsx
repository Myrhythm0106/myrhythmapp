
import React from "react";
import { RhythmAssessmentView } from "./rhythm/RhythmAssessmentView";
import { RhythmSummaryView } from "./rhythm/RhythmSummaryView";
import { AssessmentCompiling } from "./rhythm/AssessmentCompiling";
import { RhythmAssessmentIntro } from "./rhythm/RhythmAssessmentIntro";
import { useRhythmAssessment } from "@/hooks/useRhythmAssessment";
import { UserType } from "./UserTypeStep";

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
    handleResponse,
    handleNext,
    handleCompilationComplete,
    handleBack,
    handleBeginAssessment
  } = useRhythmAssessment();

  const handleSummaryComplete = () => {
    onComplete(responses);
  };

  // Get user type for personalized messaging
  const userType = localStorage.getItem("myrhythm_user_type") as UserType | null;

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

  if (showSummary) {
    return (
      <RhythmSummaryView 
        onComplete={handleSummaryComplete}
        onBack={handleBack}
        assessmentResult={assessmentResult}
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
    />
  );
}
