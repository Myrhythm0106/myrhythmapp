
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RhythmAssessmentView } from "./rhythm/RhythmAssessmentView";
import { RhythmSummaryView } from "./rhythm/RhythmSummaryView";
import { AssessmentResponses, sections } from "./rhythm/rhythmAssessmentData";
import { analyzeRhythmAssessment, storeFocusArea } from "@/utils/rhythmAnalysis";

interface RhythmAssessmentStepProps {
  onComplete: (responses: any) => void;
}

export function RhythmAssessmentStep({ onComplete }: RhythmAssessmentStepProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponses>({});
  const [showSummary, setShowSummary] = useState(false);

  const handleResponse = (questionId: string, value: string) => {
    const sectionId = sections[currentSection].id.toString();
    setResponses(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [questionId]: parseInt(value, 10)
      }
    }));
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      // Assessment complete - analyze and show summary
      const focusArea = analyzeRhythmAssessment(responses);
      const assessmentData = {
        responses,
        focusArea,
        completedAt: new Date().toISOString(),
        assessmentVersion: "1.0"
      };
      
      // Store the focus area determination
      storeFocusArea(focusArea, assessmentData);
      
      setShowSummary(true);
    }
  };

  const handleBack = () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    } else {
      setHasStarted(false);
    }
  };

  const handleSummaryComplete = () => {
    onComplete(responses);
  };

  if (!hasStarted) {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Your journey is unique, and so is your rhythm.
            </h3>
            <div className="space-y-3 text-gray-700">
              <p>
                We believe in the power of your story, not to dwell on what was, but to illuminate the path forward.
              </p>
              <p>
                You're about to take a small, yet powerful step towards a more personalized experience. We'll ask a few gentle questions that will help us understand your unique beat.
              </p>
              <p className="font-medium">
                There are no right or wrong answers, only your truth.
              </p>
              <p className="text-lg font-semibold text-blue-700">
                Let's begin to build your future, together.
              </p>
            </div>
          </div>
        </Card>
        
        <div className="flex justify-center">
          <Button 
            onClick={() => setHasStarted(true)}
            size="lg"
            className="px-8 py-3"
          >
            Begin Assessment
          </Button>
        </div>
      </div>
    );
  }

  if (showSummary) {
    return (
      <RhythmSummaryView 
        onComplete={handleSummaryComplete}
        onBack={handleBack}
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
