
import React, { useEffect } from "react";
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
      const timer = setTimeout(() => {
        onNext();
      }, 800); // Small delay to show the selection was made
      
      return () => clearTimeout(timer);
    }
  }, [sectionResponses, canProceed, onNext]);

  const progressPercentage = ((currentSection + 1) / sections.length) * 100;

  const handleResponse = (questionId: string, value: string) => {
    onResponse(questionId, value);
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
          className="flex items-center gap-2 bg-gradient-to-r from-beacon-600 to-beacon-800 hover:from-beacon-700 hover:to-beacon-900"
        >
          {currentSection === sections.length - 1 ? "Complete Assessment" : "Next Section"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
