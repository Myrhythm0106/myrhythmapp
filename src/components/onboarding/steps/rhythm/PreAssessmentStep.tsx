import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Clock, Target, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";
import { UserType } from "@/types/user";

interface PreAssessmentStepProps {
  onComplete: (data: any) => void;
  userType: UserType;
}

export function PreAssessmentStep({ onComplete, userType }: PreAssessmentStepProps) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and data processing
    const simulateLoading = async () => {
      setProgress(30);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProgress(60);
      await new Promise((resolve) => setTimeout(resolve, 750));
      setProgress(90);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProgress(100);
      setIsLoading(false);
    };

    simulateLoading();
  }, []);

  const handleContinue = () => {
    // Placeholder for data to be passed to the next step
    const assessmentData = {
      userType: userType,
      // Add any other relevant data here
    };
    onComplete(assessmentData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Understanding Your Rhythm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <p className="text-lg">
            Before we dive in, let's take a moment to understand your unique rhythm.
          </p>
          <p className="text-muted-foreground">
            This quick assessment will help us personalize your experience and provide tailored
            recommendations.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Preparing Assessment</p>
              <p className="text-sm text-muted-foreground">{progress}%</p>
            </div>
            <Progress value={progress} />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Assessment Ready</p>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-muted-foreground">
              We're ready to begin! This assessment will take approximately 5-10 minutes.
            </p>
          </div>
        )}

        <div className="pt-4 border-t">
          <Button onClick={handleContinue} disabled={isLoading} className="w-full">
            Start Assessment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

