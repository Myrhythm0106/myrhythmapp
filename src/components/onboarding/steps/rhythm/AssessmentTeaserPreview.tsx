import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, TrendingUp, Brain, ArrowRight, Sparkles } from "lucide-react";
import { UserType } from "@/types/user";

interface AssessmentTeaserPreviewProps {
  assessmentResult: any;
  onContinue: () => void;
}

export function AssessmentTeaserPreview({ assessmentResult, onContinue }: AssessmentTeaserPreviewProps) {
  const {
    focusAreas,
    overallScore,
    timeCommitment,
    energyLevels
  } = assessmentResult;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Your Rhythm Assessment Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p>Based on your responses, here's a quick look at your personalized rhythm assessment:</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Overall Score: {overallScore}</Badge>
            {overallScore > 70 && <Sparkles className="h-4 w-4 text-yellow-500" />}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="flex items-center space-x-4">
              <Clock className="h-6 w-6 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold">Time Commitment</h3>
                <p className="text-sm text-muted-foreground">{timeCommitment}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="flex items-center space-x-4">
              <Target className="h-6 w-6 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold">Focus Areas</h3>
                <p className="text-sm text-muted-foreground">{focusAreas.join(', ')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="p-4 bg-purple-50 rounded-md border border-purple-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <h4 className="text-base font-semibold">Energy Levels</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Your energy levels are {energyLevels}. We'll help you optimize your day for peak performance.
          </p>
        </div>

        <Button onClick={onContinue} className="w-full">
          Continue to Full Results
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
