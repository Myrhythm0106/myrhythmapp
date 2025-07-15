import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Target, TrendingUp } from "lucide-react";
import { UserType } from "@/types/user";

interface RhythmAssessmentIntroProps {
  onStart: () => void;
}

export function RhythmAssessmentIntro({ onStart }: RhythmAssessmentIntroProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Understand Your Rhythm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p>
            Take our quick Rhythm Assessment to discover your unique patterns and
            optimize your daily life.
          </p>
          <p>
            This assessment analyzes your energy levels, focus patterns, and
            productivity peaks to provide personalized insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="flex items-center space-x-4">
              <Clock className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  Time Efficiency
                </h3>
                <p className="text-sm text-blue-700">
                  Optimize your schedule for peak performance.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="flex items-center space-x-4">
              <Target className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  Goal Alignment
                </h3>
                <p className="text-sm text-green-700">
                  Align your activities with your core objectives.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary">Quick & Insightful</Badge>
          <Button onClick={onStart}>
            Start Assessment
            <TrendingUp className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
