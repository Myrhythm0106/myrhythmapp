import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Target, TrendingUp, ArrowRight, CheckCircle, Sparkles, Gift } from "lucide-react";
import { UserType } from "@/types/user";

interface PreAssessmentStepProps {
  onComplete: (data: any) => void;
  onSkipPayment?: () => void;
  userType: UserType;
}

export function PreAssessmentStep({ onComplete, onSkipPayment, userType }: PreAssessmentStepProps) {
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
    // Proceed to payment gate then assessment
    const assessmentData = {
      userType: userType,
      paymentPath: 'full'
    };
    onComplete(assessmentData);
  };

  const handleSkipPayment = () => {
    // Skip payment and go directly to brief assessment
    if (onSkipPayment) {
      onSkipPayment();
    }
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Assessment Ready</p>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            
            {/* Payment Options */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="font-semibold text-foreground">Full Experience</p>
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Get your complete personalized plan with detailed insights, comprehensive assessment, and ongoing support.
                </p>
                <Button onClick={handleContinue} disabled={isLoading} className="w-full">
                  Start Full Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Or</p>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border border-dashed border-muted-foreground/30">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium text-foreground">Experience First</p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Try our brief assessment to get a preview of your personalized insights, then decide on your plan based on the value you experience.
                </p>
                <Button 
                  onClick={handleSkipPayment} 
                  disabled={isLoading || !onSkipPayment} 
                  variant="outline"
                  className="w-full"
                >
                  Try Assessment Preview
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

