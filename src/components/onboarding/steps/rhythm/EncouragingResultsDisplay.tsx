import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Target, Heart, Sparkles } from "lucide-react";
import { UserType } from "@/types/user";

interface EncouragingResultsDisplayProps {
  assessmentResult: any;
  onContinue: () => void;
}

export function EncouragingResultsDisplay({ assessmentResult, onContinue }: EncouragingResultsDisplayProps) {
  const {
    overallScore,
    focusScore,
    energyScore,
    timeManagementScore,
    resilienceScore,
    // Add other relevant scores here
  } = assessmentResult;

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return "Excellent";
    } else if (score >= 60) {
      return "Good";
    } else if (score >= 40) {
      return "Fair";
    } else {
      return "Needs Improvement";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Encouraging Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Overall Rhythm Score</h3>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{overallScore}</div>
            <Badge>{getScoreBadge(overallScore)}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3 space-y-1">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">Focus</h4>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-blue-900">{focusScore}</div>
                <Badge variant="secondary">{getScoreBadge(focusScore)}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-3 space-y-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <h4 className="font-medium">Energy</h4>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-green-900">{energyScore}</div>
                <Badge variant="secondary">{getScoreBadge(energyScore)}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-3 space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <h4 className="font-medium">Time Management</h4>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-purple-900">{timeManagementScore}</div>
                <Badge variant="secondary">{getScoreBadge(timeManagementScore)}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-3 space-y-1">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-600" />
                <h4 className="font-medium">Resilience</h4>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-red-900">{resilienceScore}</div>
                <Badge variant="secondary">{getScoreBadge(resilienceScore)}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="text-sm text-muted-foreground">
          These scores provide insights into different aspects of your daily rhythm.
        </p>

        <Button onClick={onContinue} className="w-full">
          Continue to Personalized Recommendations
        </Button>
      </CardContent>
    </Card>
  );
}
