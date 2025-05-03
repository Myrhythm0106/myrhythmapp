
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface TutorialFooterProps {
  currentStep: number;
  stepsCount: number;
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
}

export function TutorialFooter({ 
  currentStep, 
  stepsCount, 
  onPrevious, 
  onNext, 
  onSkip 
}: TutorialFooterProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === stepsCount - 1;
  
  return (
    <div className="w-full flex justify-between">
      {isFirstStep ? (
        <Button variant="outline" onClick={onSkip}>
          Skip Tutorial
        </Button>
      ) : (
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
      )}
      <Button onClick={onNext} className="animate-pulse">
        {!isLastStep ? (
          <>
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </>
        ) : (
          "Get Started"
        )}
      </Button>
    </div>
  );
}
