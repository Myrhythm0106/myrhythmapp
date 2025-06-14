
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";

interface FocusAreaCardProps {
  assessmentResult: AssessmentResult;
}

export function FocusAreaCard({ assessmentResult }: FocusAreaCardProps) {
  const progressPercentage = Math.round((assessmentResult.overallScore / 100) * 100);
  const focusAreaInfo = getFocusAreaInfo(assessmentResult.focusArea);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl">Your Primary Focus Area</h2>
            <p className="text-sm text-muted-foreground font-normal">
              Based on your assessment responses
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-primary capitalize">
            {focusAreaInfo.displayName}
          </h3>
          <p className="text-muted-foreground">
            {focusAreaInfo.description}
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress Assessment</span>
            <span className="text-sm font-bold">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <p className="text-xs text-muted-foreground text-center">
            You're making progress! Your personalized plan will help you build on this foundation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function getFocusAreaInfo(focusArea: string) {
  const focusAreas: Record<string, { displayName: string; description: string }> = {
    'cognitive-function': {
      displayName: 'Cognitive Function',
      description: 'Enhancing memory, attention, and mental clarity through targeted exercises and routines.'
    },
    'emotional-regulation': {
      displayName: 'Emotional Regulation',
      description: 'Building resilience and healthy coping strategies for emotional well-being.'
    },
    'physical-wellness': {
      displayName: 'Physical Wellness',
      description: 'Improving strength, mobility, and overall physical health through structured activities.'
    },
    'social-connection': {
      displayName: 'Social Connection',
      description: 'Strengthening relationships and building supportive community connections.'
    },
    'independence': {
      displayName: 'Independence',
      description: 'Developing skills and confidence for greater autonomy in daily activities.'
    },
    'routine-structure': {
      displayName: 'Routine & Structure',
      description: 'Creating consistent, supportive daily patterns that promote stability and growth.'
    }
  };

  return focusAreas[focusArea] || {
    displayName: focusArea.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: 'Your personalized focus area for optimal growth and recovery.'
  };
}
