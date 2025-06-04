
import React, { useState } from "react";
import { Heart } from "lucide-react";
import { getCurrentFocusArea, AssessmentResult } from "@/utils/rhythmAnalysis";
import { useNavigate } from "react-router-dom";
import { MotivationalMessageView } from "./MotivationalMessageView";
import { MyRhythmFrameworkDisplay } from "./MyRhythmFrameworkDisplay";
import { PersonalizedFocusCard } from "./PersonalizedFocusCard";
import { RhythmSummaryActions } from "./RhythmSummaryActions";
import { AssessmentResultsDisplay } from "./AssessmentResultsDisplay";

interface RhythmSummaryViewProps {
  onComplete: () => void;
  onBack?: () => void;
  assessmentResult: AssessmentResult | null;
}

export function RhythmSummaryView({ onComplete, onBack, assessmentResult }: RhythmSummaryViewProps) {
  const navigate = useNavigate();
  const [showMotivationalMessage, setShowMotivationalMessage] = useState(false);
  const currentFocusArea = getCurrentFocusArea();
  const focusInfo = currentFocusArea ? require("@/utils/rhythmAnalysis").focusAreas[currentFocusArea] : null;

  const handlePersonalizeClick = () => {
    setShowMotivationalMessage(true);
    
    // Show motivational message for 4 seconds, then navigate to user guide
    setTimeout(() => {
      navigate("/guide");
    }, 4000);
  };

  // Map focus areas to MYRHYTHM steps (0-based index)
  const getFocusAreaStepIndex = (focusArea: string) => {
    switch (focusArea) {
      case 'structure': return 2; // R - Routine
      case 'emotional': return 1; // Y - Yearning 
      case 'achievement': return 0; // M - Mindset
      case 'community': return 3; // H - Health
      case 'growth': return 7; // M - Multiply (final step)
      default: return 0;
    }
  };

  const currentStepIndex = currentFocusArea ? getFocusAreaStepIndex(currentFocusArea) : -1;

  if (showMotivationalMessage) {
    return <MotivationalMessageView />;
  }

  return (
    <div className="space-y-8 text-center max-w-4xl mx-auto">
      <div className="space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
          <Heart className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
          We Found Your Rhythm
        </h1>
      </div>
      
      {assessmentResult && (
        <AssessmentResultsDisplay assessmentResult={assessmentResult} />
      )}
      
      <MyRhythmFrameworkDisplay currentStepIndex={currentStepIndex} />
      
      {focusInfo && <PersonalizedFocusCard focusInfo={focusInfo} />}
      
      <div className="space-y-6 text-left bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl">
        <p className="text-lg leading-relaxed text-gray-700">
          Based on your answers, we'll customise your MyRhythm experience. This helps your brain receive the structure, guidance, and rhythm it needs today.
        </p>
        <p className="text-sm text-gray-600 italic">
          Every 6 months, we'll check in again. Because your rhythm will evolve. And we'll evolve with you.
        </p>
      </div>

      <RhythmSummaryActions 
        onBack={onBack}
        onPersonalizeClick={handlePersonalizeClick}
      />
    </div>
  );
}
