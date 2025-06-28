
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Info, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RhythmSectionHeader } from "./RhythmSectionHeader";
import { RhythmQuestionCard } from "./RhythmQuestionCard";
import { AssessmentResponses } from "./rhythmAssessmentData";
import { UserType } from "../UserTypeStep";
import { useFormPersistence } from "@/hooks/useFormPersistence";

interface RhythmAssessmentViewProps {
  currentSection: number;
  responses: AssessmentResponses;
  onResponse: (questionId: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  sections: any[];
  userType: UserType | null;
}

export function RhythmAssessmentView({
  currentSection,
  responses,
  onResponse,
  onNext,
  onBack,
  sections,
  userType
}: RhythmAssessmentViewProps) {
  const [autoProgressTimer, setAutoProgressTimer] = useState<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  // Form persistence for assessment data
  const {
    saveData,
    hasUnsavedChanges,
    lastSaved
  } = useFormPersistence(responses, {
    key: 'rhythm_assessment',
    enabled: true,
    autoSave: true,
    saveInterval: 15000 // Save every 15 seconds
  });
  
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

  // Auto-advance when all questions in section are answered - reduced to 1.5 seconds
  useEffect(() => {
    if (canProceed()) {
      setCountdown(2);
      
      const timer = setTimeout(() => {
        onNext();
        setCountdown(null);
      }, 1500); // Reduced from 3000 to 1500ms
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => prev ? prev - 1 : null);
      }, 750); // Adjusted for faster countdown
      
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

  const getUserTypeName = (type: UserType | null) => {
    switch (type) {
      case "brain-injury-recovery": return "Brain Injury Recovery";
      case "cognitive-optimization": return "Cognitive Development";
      case "caregiver-support": return "Caregiver & Family Support";
      case "wellness-productivity": return "Wellness & Productivity";
      default: return "Unknown";
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Data persistence indicator */}
      {lastSaved && (
        <div className="flex items-center justify-between text-xs text-muted-foreground bg-green-50 px-3 py-2 rounded">
          <span>✓ Progress saved {new Date(lastSaved).toLocaleTimeString()}</span>
          {hasUnsavedChanges && <span className="text-amber-600">• Unsaved changes</span>}
        </div>
      )}

      {/* User Type Indicator */}
      {userType && (
        <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <User className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Assessment for: {getUserTypeName(userType)}
          </span>
        </div>
      )}

      {/* Info header */}
      <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-5 w-5 text-blue-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">This assessment helps us understand your unique rhythm and personalize your MyRhythm experience. Answer honestly - there are no right or wrong answers.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div>
          <h3 className="font-medium text-blue-900">Rhythm Assessment</h3>
          <p className="text-sm text-blue-700">Help us understand your unique journey and rhythm.</p>
        </div>
      </div>

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
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center animate-pulse">
          <p className="text-green-700 font-medium">
            Moving to next section in {countdown}...
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
