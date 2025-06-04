
import React, { useState } from "react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { PostAssessmentFlow } from "./PostAssessmentFlow";
import { MotivationalMessageView } from "./MotivationalMessageView";

interface RhythmSummaryViewProps {
  onComplete: () => void;
  onBack?: () => void;
  assessmentResult: AssessmentResult | null;
}

export function RhythmSummaryView({ onComplete, onBack, assessmentResult }: RhythmSummaryViewProps) {
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
    />
  );
}
