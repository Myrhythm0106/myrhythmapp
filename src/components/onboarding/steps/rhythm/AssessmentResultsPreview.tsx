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
      {/* Trial Status Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-foreground">
                  {daysLeft} days left in your trial
                </p>
                <p className="text-sm text-muted-foreground">
                  Unlock your complete personalized insights
                </p>
              </div>
            </div>
            <Button onClick={onUpgrade} size="sm" className="bg-primary hover:bg-primary/90">
              Upgrade Now
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

          {/* Locked Content Preview */}
          <Card className="bg-muted/30 border-dashed border-2">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <Lock className="h-8 w-8 text-muted-foreground mx-auto" />
                <div>
                  <h4 className="font-semibold text-foreground">Your Complete Personalized Roadmap</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    + 8 more detailed insights and recommendations
                  </p>
                  <p className="text-sm text-muted-foreground">
                    + Comprehensive personal rhythm profile
                  </p>
                  <p className="text-sm text-muted-foreground">
                    + Week-by-week action plan for the next month
                  </p>
                </div>
                <Button onClick={onUpgrade} variant="outline" size="sm">
                  Unlock Full Results
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <div className="pt-4 border-t">
            <Button onClick={onContinue} className="w-full">
              Continue with Preview Results
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}