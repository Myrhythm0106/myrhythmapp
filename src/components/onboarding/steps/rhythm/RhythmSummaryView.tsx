
import React, { useState } from "react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { PostAssessmentFlow } from "./PostAssessmentFlow";
import { MotivationalMessageView } from "./MotivationalMessageView";
import { UserType } from "@/types/user";

interface RhythmSummaryViewProps {
  onComplete: () => void;
  onBack?: () => void;
  assessmentResult: AssessmentResult | null;
  userType?: UserType | null;
}

export function RhythmSummaryView({ onComplete, onBack, assessmentResult, userType }: RhythmSummaryViewProps) {
  const [showMotivationalMessage, setShowMotivationalMessage] = useState(false);

  if (showMotivationalMessage) {
    return <MotivationalMessageView />;
  }

  if (!assessmentResult) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Assessment result not available</p>
      </div>
    );
  }

  return (
    <PostAssessmentFlow 
      assessmentResult={assessmentResult}
      onComplete={onComplete}
      userType={userType}
    />
  );
}
