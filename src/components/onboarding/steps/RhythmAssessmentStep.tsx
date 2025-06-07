
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RhythmAssessmentView } from "./rhythm/RhythmAssessmentView";
import { RhythmSummaryView } from "./rhythm/RhythmSummaryView";
import { AssessmentCompiling } from "./rhythm/AssessmentCompiling";
import { AssessmentResponses, sections } from "./rhythm/rhythmAssessmentData";
import { 
  analyzeRhythmAssessment, 
  storeFocusArea,
  storeAssessmentResult,
  AssessmentResult
} from "@/utils/rhythmAnalysis";

interface RhythmAssessmentStepProps {
  onComplete: (responses: any) => void;
}

export function RhythmAssessmentStep({ onComplete }: RhythmAssessmentStepProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponses>({});
  const [isCompiling, setIsCompiling] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

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
      // Start compilation process
      setIsCompiling(true);
    }
  };

  const handleCompilationComplete = () => {
    // Assessment complete - analyze and show summary
    const analysisResult = analyzeRhythmAssessment(responses);
    const completedAt = new Date().toISOString();
    const nextReviewDate = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const result: AssessmentResult = {
      id: `assessment-${Date.now()}`,
      completedAt,
      focusArea: analysisResult.focusArea,
      sectionScores: analysisResult.sectionScores,
      overallScore: analysisResult.overallScore,
      determinationReason: analysisResult.determinationReason,
      version: "1.0",
      nextReviewDate
    };
    
    // Store the assessment result
    storeAssessmentResult(result);
    
    // Store the focus area determination
    storeFocusArea(analysisResult.focusArea, result);
    
    setAssessmentResult(result);
    setIsCompiling(false);
    setShowSummary(true);
  };

  const handleBack = () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    
    if (isCompiling) {
      // Don't allow going back during compilation
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
        {/* Info section */}
        <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-5 w-5 text-blue-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">This assessment will help us understand your unique rhythm and create a personalized experience just for you.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div>
            <h3 className="font-medium text-blue-900">Rhythm Assessment</h3>
            <p className="text-sm text-blue-700">Discover your unique rhythm to personalize your MyRhythm experience.</p>
          </div>
        </div>

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
