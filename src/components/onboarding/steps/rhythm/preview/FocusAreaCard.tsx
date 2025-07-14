import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Star } from "lucide-react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";

interface FocusAreaCardProps {
  assessmentResult: AssessmentResult;
}

export function FocusAreaCard({ assessmentResult }: FocusAreaCardProps) {
  const focusAreaInfo = getFocusAreaInfo(assessmentResult.focusArea);
  
  // Convert assessment score (0-3 scale) to a 5-star rating for better user understanding
  const starRating = Math.min(5, Math.max(0, (assessmentResult.overallScore / 3) * 5));
  const fullStars = Math.floor(starRating);
  const hasHalfStar = starRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

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
        
        <div className="space-y-3">
          <div className="text-center">
            <span className="text-sm font-medium block mb-2">Current Wellness Level</span>
            <div className="flex items-center justify-center gap-1 mb-2">
              {/* Full stars */}
              {Array.from({ length: fullStars }).map((_, i) => (
                <Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
              {/* Half star */}
              {hasHalfStar && (
                <div className="relative">
                  <Star className="h-5 w-5 text-gray-300" />
                  <div className="absolute inset-0 overflow-hidden w-1/2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              )}
              {/* Empty stars */}
              {Array.from({ length: emptyStars }).map((_, i) => (
                <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
              ))}
            </div>
            <span className="text-sm font-bold text-primary">
              {starRating.toFixed(1)}/5.0
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            You're on a great path! Your personalized plan will help you build on this foundation.
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
