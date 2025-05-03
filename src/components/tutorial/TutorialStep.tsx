
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

export interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  video: string;
}

interface TutorialStepProps {
  step: TutorialStep;
  currentStep: number;
  stepIndex: number;
  stepsCount: number;
}

export function TutorialStep({ step, currentStep, stepIndex, stepsCount }: TutorialStepProps) {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="bg-primary/10 p-6 rounded-full">
          {step.icon}
        </div>
        <h3 className="text-2xl font-semibold">{step.title}</h3>
        <p className="text-lg text-muted-foreground max-w-md">{step.description}</p>
        <div className="flex justify-center space-x-2 pt-4">
          {Array.from({ length: stepsCount }).map((_, i) => (
            <div 
              key={i} 
              className={`h-2 w-2 rounded-full transition-all ${i === currentStep ? 'bg-primary w-4' : 'bg-muted'}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
