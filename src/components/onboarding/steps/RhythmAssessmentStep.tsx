
import React, { useState } from "react";
import { RhythmWelcomeView } from "./rhythm/RhythmWelcomeView";
import { RhythmSummaryView } from "./rhythm/RhythmSummaryView";
import { RhythmAssessmentView } from "./rhythm/RhythmAssessmentView";
import { AssessmentResponses, sections } from "./rhythm/rhythmAssessmentData";

interface RhythmAssessmentStepProps {
  onComplete: (responses: AssessmentResponses) => void;
}

export function RhythmAssessmentStep({ onComplete }: RhythmAssessmentStepProps) {
  const [currentView, setCurrentView] = useState<"welcome" | "assessment" | "summary">("welcome");
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponses>({});

  const handleBeginAssessment = () => {
    setCurrentView("assessment");
  };

  const handleResponse = (questionId: string, value: string) => {
    const sectionId = sections[currentSection].id.toString();
    setResponses(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [questionId]: parseInt(value)
      }
    }));
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      setCurrentView("summary");
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    } else {
      setCurrentView("welcome");
    }
  };

  const handleComplete = () => {
    onComplete(responses);
  };

  if (currentView === "welcome") {
    return <RhythmWelcomeView onBegin={handleBeginAssessment} />;
  }

  if (currentView === "summary") {
    return <RhythmSummaryView onComplete={handleComplete} />;
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
