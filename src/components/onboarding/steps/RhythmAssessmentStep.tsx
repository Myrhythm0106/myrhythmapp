
import React, { useState } from "react";
import { AssessmentFlowManager } from "./rhythm/assessment/AssessmentFlowManager";
import { PostAssessmentManager } from "./rhythm/post-assessment/PostAssessmentManager";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { UserType } from "./UserTypeStep";

interface RhythmAssessmentStepProps {
  onComplete: (responses: any) => void;
  userType?: UserType | null;
  hasPaidPremium?: boolean;
}

export function RhythmAssessmentStep({ onComplete, userType, hasPaidPremium = false }: RhythmAssessmentStepProps) {
  console.log("RhythmAssessmentStep: Rendering with userType:", userType);
  
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  const handleAssessmentComplete = (result: AssessmentResult) => {
    console.log("RhythmAssessmentStep: Assessment completed, moving to post-assessment");
    setAssessmentResult(result);
  };

  const handlePostAssessmentComplete = () => {
    console.log("RhythmAssessmentStep: Post-assessment completed, calling onComplete");
    onComplete(assessmentResult);
  };

  if (!assessmentResult) {
    return (
      <AssessmentFlowManager
        userType={userType}
        onComplete={handleAssessmentComplete}
      />
    );
  }

  return (
    <PostAssessmentManager
      assessmentResult={assessmentResult}
      userType={userType}
      hasPaidPremium={hasPaidPremium}
      onComplete={handlePostAssessmentComplete}
    />
  );
}
