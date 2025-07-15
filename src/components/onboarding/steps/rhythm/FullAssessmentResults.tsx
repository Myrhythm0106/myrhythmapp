import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Clock, Target, Brain, Heart, Star } from "lucide-react";
import { UserType } from "@/types/user";

interface FullAssessmentResultsProps {
  assessmentResult: any;
  onComplete: () => void;
}

export function FullAssessmentResults({ assessmentResult, onComplete }: FullAssessmentResultsProps) {
  const [showDetails, setShowDetails] = useState(false);

  const overallScore = assessmentResult?.overallScore || 75;
  const keyStrengths = assessmentResult?.keyStrengths || ["Focus", "Resilience"];
  const areasForImprovement = assessmentResult?.areasForImprovement || ["Energy Levels", "Stress Management"];
  const personalizedRecommendations = assessmentResult?.personalizedRecommendations || [
    "Incorporate short breaks every hour",
    "Practice mindfulness exercises",
    "Prioritize sleep hygiene"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Full Rhythm Assessment Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Overall Rhythm Score</h3>
            <Badge variant="secondary">{overallScore}%</Badge>
          </div>
          <Progress value={overallScore} />
        </div>

        {/* Key Strengths */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Key Strengths
          </h3>
          <div className="flex gap-2">
            {keyStrengths.map((strength, index) => (
              <Badge key={index} variant="outline">{strength}</Badge>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Areas for Improvement
          </h3>
          <div className="flex gap-2">
            {areasForImprovement.map((area, index) => (
              <Badge key={index} variant="destructive">{area}</Badge>
            ))}
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            Personalized Recommendations
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {personalizedRecommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t">
          <Button onClick={onComplete} className="w-full">
            Continue to Next Steps
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

