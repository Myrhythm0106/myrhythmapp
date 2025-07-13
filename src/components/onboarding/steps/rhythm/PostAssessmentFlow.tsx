
import React from "react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { PostAssessmentManager } from "./post-assessment/PostAssessmentManager";
import { UserType } from "../UserTypeStep";

interface PostAssessmentFlowProps {
  assessmentResult: AssessmentResult;
  onComplete: () => void;
  userType?: UserType | null;
  hasPaidPremium?: boolean;
}

export function PostAssessmentFlow({ assessmentResult, onComplete, userType, hasPaidPremium = false }: PostAssessmentFlowProps) {
  return (
    <PostAssessmentManager
      assessmentResult={assessmentResult}
      userType={userType}
      hasPaidPremium={hasPaidPremium}
      onComplete={onComplete}
    />
  );
}
