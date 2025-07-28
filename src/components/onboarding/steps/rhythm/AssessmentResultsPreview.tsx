import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Star, TrendingUp, Lock, Sparkles, Clock } from "lucide-react";

interface AssessmentResultsPreviewProps {
  assessmentResult: any;
  onUpgrade: () => void;
  onContinue: () => void;
  daysLeft?: number;
}

export function AssessmentResultsPreview({ 
  assessmentResult, 
  onUpgrade, 
  onContinue, 
  daysLeft = 7 
}: AssessmentResultsPreviewProps) {
  const overallScore = assessmentResult?.overallScore || 75;
  const primaryRhythm = assessmentResult?.primaryRhythm || "Balanced Achiever";
  const keyInsights = assessmentResult?.keyInsights?.slice(0, 3) || [
    "You have strong focus during morning hours",
    "Your energy peaks align with cognitive demands",
    "You benefit from structured break patterns"
  ];
  const primaryFocus = assessmentResult?.primaryFocus || "Optimizing morning productivity";

  return (
    <div className="space-y-6">
      {/* Experience First Banner */}
      <Card className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 border border-emerald-200/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-semibold text-foreground">
                  🎉 You're experiencing your personalized insights first!
                </p>
                <p className="text-sm text-muted-foreground">
                  See the value, then choose your plan based on what works for you
                </p>
              </div>
            </div>
            <Button onClick={onUpgrade} size="sm" className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:opacity-90">
              Unlock Full Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Results Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Your Rhythm Assessment Insights
            <Badge variant="secondary" className="ml-auto">Preview</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Score & Primary Rhythm */}
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

          {/* Key Insights Preview */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Key Insights
            </h4>
            <div className="space-y-2">
              {keyInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Focus Area */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Your Primary Focus Area
            </h4>
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-foreground font-medium">{primaryFocus}</p>
              <p className="text-sm text-muted-foreground mt-1">
                This is where you'll see the biggest impact on your daily rhythm
              </p>
            </div>
          </div>

          {/* Value-First Unlock Preview */}
          <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border border-primary/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Ready to unlock your complete plan?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    You've seen the power of personalized insights. Here's what awaits in your full plan:
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Brain className="h-3 w-3 text-primary" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Complete Cognitive Profile</p>
                      <p className="text-muted-foreground">8+ additional insights tailored to your specific patterns</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                    <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <TrendingUp className="h-3 w-3 text-accent" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">30-Day Action Roadmap</p>
                      <p className="text-muted-foreground">Week-by-week personalized strategies for maximum impact</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                    <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="h-3 w-3 text-secondary" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Advanced Rhythm Optimization</p>
                      <p className="text-muted-foreground">Comprehensive assessment + ongoing tracking tools</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <Button onClick={onUpgrade} className="w-full bg-gradient-to-r from-primary via-accent to-secondary hover:opacity-90">
                    Unlock Your Complete Plan
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Based on what you've experienced, choose the plan that works for you
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <div className="pt-4 border-t space-y-3">
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm text-center text-muted-foreground">
                Want to explore more before deciding? You can continue with these preview insights.
              </p>
            </div>
            <Button onClick={onContinue} variant="outline" className="w-full">
              Continue with Preview for Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}