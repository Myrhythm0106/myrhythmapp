
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserType } from "../UserTypeStep";
import { Section } from "./rhythmAssessmentData";

interface RhythmAssessmentViewProps {
  currentSection: number;
  responses: Record<string, any>;
  onResponse: (questionId: string, response: any) => void;
  onNext: () => void;
  onBack: () => void;
  sections: Section[];
  userType?: UserType | null;
  isRestoringFromSave?: boolean;
}

export function RhythmAssessmentView({
  currentSection,
  responses,
  onResponse,
  onNext,
  onBack,
  sections,
  userType,
  isRestoringFromSave = false
}: RhythmAssessmentViewProps) {
  console.log("RhythmAssessmentView: Rendering for userType:", userType, "currentSection:", currentSection);
  console.log("RhythmAssessmentView: Available sections:", sections.length);
  console.log("RhythmAssessmentView: isRestoringFromSave:", isRestoringFromSave);
  
  const [validationKey, setValidationKey] = useState(0);

  // Force validation recalculation when responses change or restoration completes
  useEffect(() => {
    if (!isRestoringFromSave) {
      console.log("RhythmAssessmentView: Triggering validation update due to state change");
      setValidationKey(prev => prev + 1);
    }
  }, [responses, currentSection, isRestoringFromSave]);

  if (!sections || sections.length === 0) {
    console.error("RhythmAssessmentView: No sections available");
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold mb-4">Loading Assessment...</h2>
        <p className="text-muted-foreground">
          Preparing your personalized questions...
        </p>
      </div>
    );
  }

  const currentSectionData = sections[currentSection];
  
  if (!currentSectionData) {
    console.log("RhythmAssessmentView: No current section, completing assessment");
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold mb-4">Assessment Complete!</h2>
        <p className="text-muted-foreground mb-6">
          Thank you for completing your personalized assessment.
        </p>
        <Button onClick={onNext} size="lg">
          View Results
        </Button>
      </div>
    );
  }

  const currentSectionResponses = responses[currentSectionData.id.toString()] || {};
  const answeredQuestions = Object.keys(currentSectionResponses).length;
  const totalQuestions = currentSectionData.questions.length;
  const canProceed = answeredQuestions === totalQuestions;

  console.log("RhythmAssessmentView: Section", currentSection, "validation:");
  console.log("- Section ID:", currentSectionData.id);
  console.log("- Current section responses:", currentSectionResponses);
  console.log("- Answered questions:", answeredQuestions);
  console.log("- Total questions:", totalQuestions);
  console.log("- Can proceed:", canProceed);
  console.log("- Validation key:", validationKey);

  const handleQuestionResponse = (questionId: string, value: number) => {
    console.log("RhythmAssessmentView: Recording response for", questionId, ":", value);
    onResponse(questionId, value);
    
    // Force validation update after response
    setTimeout(() => {
      setValidationKey(prev => prev + 1);
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Restoration Status */}
      {isRestoringFromSave && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-800 font-medium">Restoring your assessment progress...</span>
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-r ${currentSectionData.gradient}`}>
              {currentSectionData.phase}
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">{currentSectionData.title}</h3>
              <p className="text-sm text-muted-foreground">{currentSectionData.phaseDescription}</p>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            Section {currentSection + 1} of {sections.length}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
          />
        </div>

        <p className="text-muted-foreground italic mb-6">
          {currentSectionData.narrative}
        </p>
      </div>

      {/* Questions */}
      <Card className="p-6">
        <div className="space-y-6">
          {currentSectionData.questions.map((question, index) => {
            const currentResponse = currentSectionResponses[question.id];
            
            return (
              <div key={question.id} className="space-y-4">
                <h3 className="text-lg font-medium">{question.text}</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Never / Not at all</span>
                    <span>Often / Very much</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleQuestionResponse(question.id, value)}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all text-sm font-medium ${
                          currentResponse === value
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Progress */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Questions answered: {answeredQuestions} of {totalQuestions}</span>
            {canProceed && (
              <span className="text-green-600 font-medium">✓ Section complete</span>
            )}
          </div>
          
          {/* Debug info (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
              <div>Debug - Validation Key: {validationKey}</div>
              <div>Debug - Can Proceed: {canProceed ? 'YES' : 'NO'}</div>
              <div>Debug - isRestoringFromSave: {isRestoringFromSave ? 'YES' : 'NO'}</div>
            </div>
          )}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={currentSection === 0}
        >
          Previous
        </Button>
        
        <Button
          key={`next-btn-${validationKey}`} // Force re-render with validation key
          onClick={onNext}
          disabled={!canProceed || isRestoringFromSave}
          className={canProceed ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          {currentSection === sections.length - 1 ? 'Complete Assessment' : 'Next Section'}
        </Button>
      </div>
    </div>
  );
}
