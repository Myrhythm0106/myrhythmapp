
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RhythmAssessmentView } from "./rhythm/RhythmAssessmentView";

interface RhythmAssessmentStepProps {
  onComplete: (responses: any) => void;
}

export function RhythmAssessmentStep({ onComplete }: RhythmAssessmentStepProps) {
  const [hasStarted, setHasStarted] = useState(false);

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

  return <RhythmAssessmentView onComplete={onComplete} />;
}
