import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Target, Brain } from "lucide-react";
import { UserType } from "@/types/user";

interface AssessmentResultsPreviewProps {
  assessmentResult: any;
  onContinue: () => void;
}

export function AssessmentResultsPreview({ assessmentResult, onContinue }: AssessmentResultsPreviewProps) {
  const {
    focusScore,
    energyScore,
    clarityScore,
    productivityScore,
    overallScore,
    focusCategory,
    energyCategory,
    clarityCategory,
    productivityCategory,
  } = assessmentResult;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Assessment Results Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{focusScore}</div>
                <Badge variant="secondary">{focusCategory}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Energy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{energyScore}</div>
                <Badge variant="secondary">{energyCategory}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Clarity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{clarityScore}</div>
                <Badge variant="secondary">{clarityCategory}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Productivity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{productivityScore}</div>
                <Badge variant="secondary">{productivityCategory}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-xl font-semibold mb-2">Overall Rhythm Score</h3>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-extrabold">{overallScore}</div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={onContinue} className="w-full">
            Continue to Next Steps
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
