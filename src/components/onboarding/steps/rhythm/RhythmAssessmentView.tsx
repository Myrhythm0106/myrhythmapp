
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { RhythmSectionHeader } from "./RhythmSectionHeader";
import { RhythmQuestionCard } from "./RhythmQuestionCard";
import { Section, AssessmentResponses, sections } from "./rhythmAssessmentData";

interface RhythmAssessmentViewProps {
  currentSection: number;
  responses: AssessmentResponses;
  onResponse: (questionId: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function RhythmAssessmentView({
  currentSection,
  responses,
  onResponse,
  onNext,
  onBack
}: RhythmAssessmentViewProps) {
  const [autoProgressTimer, setAutoProgressTimer] = useState<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const section = sections[currentSection];
  const sectionId = section.id.toString();
  const sectionResponses = responses[sectionId] || {};
  
  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSection]);
  
  const canProceed = () => {
    return section.questions.every(q => sectionResponses[q.id] !== undefined);
  };

  // Auto-advance when all questions in section are answered
  useEffect(() => {
    if (canProceed()) {
      setCountdown(3);
      
      const timer = setTimeout(() => {
        onNext();
        setCountdown(null);
      }, 3000);
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => prev ? prev - 1 : null);
      }, 1000);
      
      setAutoProgressTimer(timer);
      
      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
        setAutoProgressTimer(null);
        setCountdown(null);
      };
    } else {
      if (autoProgressTimer) {
        clearTimeout(autoProgressTimer);
        setAutoProgressTimer(null);
      }
      setCountdown(null);
    }
  }, [sectionResponses, canProceed, onNext]);

  const progressPercentage = ((currentSection + 1) / sections.length) * 100;

  const handleResponse = (questionId: string, value: string) => {
    onResponse(questionId, value);
  };

  const cancelAutoProgress = () => {
    if (autoProgressTimer) {
      clearTimeout(autoProgressTimer);
      setAutoProgressTimer(null);
    }
    setCountdown(null);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Progress</span>
          <span>{currentSection + 1} of {sections.length} Sections Complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Auto-progress notification */}
      {countdown && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-700 font-medium">
            Automatically moving to next section in {countdown} seconds...
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={cancelAutoProgress}
            className="mt-2"
          >
            Stay on this section
          </Button>
        </div>
      )}

      {/* Section Content */}
      <Card className="overflow-hidden">
        <RhythmSectionHeader section={section} />
        
        <CardContent className="p-6">
          <p className="text-lg leading-relaxed text-gray-700 mb-8">
            {section.narrative}
          </p>

          {/* Questions */}
          <div className="space-y-8">
            {section.questions.map((question) => (
              <RhythmQuestionCard
                key={question.id}
                question={question}
                value={sectionResponses[question.id]}
                onValueChange={(value) => handleResponse(question.id, value)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {currentSection === 0 ? "Back to Welcome" : "Previous"}
        </Button>

        <Button
          onClick={onNext}
          disabled={!canProceed()}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800"
        >
          {currentSection === sections.length - 1 ? "Complete Assessment" : "Next Section"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
