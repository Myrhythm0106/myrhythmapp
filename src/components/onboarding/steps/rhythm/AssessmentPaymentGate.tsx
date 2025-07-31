import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Star, TrendingUp, Lock, Sparkles, Clock, CheckCircle2, Zap, Users, Calendar } from "lucide-react";
import { PaymentCallToAction } from "./preview/PaymentCallToAction";
import { generateSampleAssessmentResult } from "@/utils/rhythmAnalysis";
import { UserType } from "@/types/user";

interface AssessmentPaymentGateProps {
  assessmentResult: any;
  onPaymentSelect: (option: 'trial' | 'monthly' | 'annual' | 'skip') => void;
  onContinueWithFree: () => void;
  userType?: UserType;
  daysLeft?: number;
}

export function AssessmentPaymentGate({ 
  assessmentResult, 
  onPaymentSelect,
  onContinueWithFree,
  userType = 'cognitive-optimization',
  daysLeft = 7 
}: AssessmentPaymentGateProps) {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [displayResult, setDisplayResult] = useState<any>(null);
  
  // Generate compelling sample result if none provided
  useEffect(() => {
    const result = assessmentResult || generateSampleAssessmentResult(userType);
    setDisplayResult(result);
  }, [assessmentResult, userType]);
  
  const overallScore = displayResult?.overallScore || 75;
  const primaryRhythm = displayResult?.primaryRhythm || "Balanced Achiever";
  const keyInsights = displayResult?.keyInsights?.slice(0, 2) || [
    "You have strong focus during morning hours",
    "Your energy peaks align with cognitive demands"
  ];
  
  if (!displayResult) {
    return <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  const handleUnlockFull = () => {
    setShowPaymentOptions(true);
  };

  const handlePaymentSelection = (option: 'trial' | 'monthly' | 'annual' | 'skip') => {
    onPaymentSelect(option);
  };

  if (showPaymentOptions) {
    return (
      <div className="space-y-6">
        <PaymentCallToAction onPaymentSelect={handlePaymentSelection} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Assessment Complete Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Assessment Complete! 🎉
              </h2>
              <p className="text-muted-foreground">
                Your personalized MYRHYTHM insights are ready
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Your MYRHYTHM Profile Preview
            <Badge variant="secondary" className="ml-auto">Preview</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Rhythm & Score */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground">{primaryRhythm}</h3>
              <p className="text-muted-foreground">Your Primary Rhythm Signature</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Rhythm Score</span>
                <Badge variant="outline">{overallScore}%</Badge>
              </div>
              <Progress value={overallScore} className="h-2" />
            </div>
          </div>

          {/* Enticing Preview Insights */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Your Preview Insights
            </h4>
            <div className="space-y-2">
              {keyInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
                  <Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground font-medium">{insight}</p>
                </div>
              ))}
              
              {/* Teaser insights */}
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border-2 border-dashed">
                  <Lock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">🧠 Your optimal focus times and energy patterns</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border-2 border-dashed">
                  <Lock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">⚡ Personalized productivity enhancement strategies</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border-2 border-dashed">
                  <Lock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">📊 Daily action plan tailored to your rhythm</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20 text-center">
              <p className="text-sm text-primary font-semibold">
                ✨ + 15 more personalized insights, recommendations, and tools unlock with subscription
              </p>
            </div>
          </div>

          {/* Value Proposition */}
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Lock className="h-8 w-8 text-primary mx-auto" />
                <div>
                  <h4 className="font-semibold text-foreground text-lg mb-2">
                    Unlock Your Complete MYRHYTHM Plan
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span>Detailed Analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Daily Action Plan</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-primary" />
                      <span>Optimization Tools</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleUnlockFull} size="lg" className="flex-1 sm:flex-none">
                    Unlock Full Results
                  </Button>
                  <Button 
                    onClick={onContinueWithFree} 
                    variant="outline" 
                    size="lg"
                    className="flex-1 sm:flex-none"
                  >
                    Continue with Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}