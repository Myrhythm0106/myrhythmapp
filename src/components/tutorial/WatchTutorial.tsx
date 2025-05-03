
import React from 'react';
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { type TutorialStep } from './tutorialData';

interface WatchTutorialProps {
  tutorialSteps: TutorialStep[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export function WatchTutorial({ tutorialSteps, currentStep, setCurrentStep }: WatchTutorialProps) {
  return (
    <div className="p-6">
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6 overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center bg-black/5">
          {/* In a real app, this would be a video player */}
          <div className="text-primary">
            <Video className="h-16 w-16 opacity-70" />
          </div>
          <div className="absolute bottom-0 left-0 w-full bg-black/30 text-white p-3">
            <p className="font-semibold">{tutorialSteps[currentStep].title}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{tutorialSteps[currentStep].title}</h3>
        <p className="text-muted-foreground">{tutorialSteps[currentStep].description}</p>
      </div>

      <div className="flex justify-center space-x-2 mt-6">
        {tutorialSteps.map((_, i) => (
          <Button 
            key={i}
            variant={i === currentStep ? "default" : "outline"}
            size="sm"
            className="w-8 h-8 p-0 rounded-full"
            onClick={() => setCurrentStep(i)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}
