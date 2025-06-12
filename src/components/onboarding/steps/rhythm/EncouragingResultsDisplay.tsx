
import React from "react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { PersonalizedResultsDisplay } from "./PersonalizedResultsDisplay";

interface EncouragingResultsDisplayProps {
  assessmentResult: AssessmentResult;
}

export function EncouragingResultsDisplay({ assessmentResult }: EncouragingResultsDisplayProps) {
  return (
    <PersonalizedResultsDisplay 
      assessmentResult={assessmentResult}
      onContinue={() => {}} // This will be handled by the parent component
    />
  );
}
