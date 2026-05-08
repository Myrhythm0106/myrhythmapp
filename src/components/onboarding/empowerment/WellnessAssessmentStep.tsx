import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MoodStateSelector, MoodValue } from "@/components/sophisticated/MoodStateSelector";

interface WellnessAssessmentStepProps {
  onFeelingSelect: (feeling: string) => void;
}

export function WellnessAssessmentStep({ onFeelingSelect }: WellnessAssessmentStepProps) {
  return (
    <Card className="border-0 shadow-2xl bg-card">
      <CardContent className="p-12 text-center space-y-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Wellness Assessment
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Select your current state. We'll calibrate today's experience around it.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <MoodStateSelector onChange={(v: MoodValue) => onFeelingSelect(v)} />
        </div>
      </CardContent>
    </Card>
  );
}
