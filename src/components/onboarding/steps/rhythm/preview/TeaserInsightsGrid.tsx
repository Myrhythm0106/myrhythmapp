
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Crown, Lock } from "lucide-react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";

interface TeaserInsightsGridProps {
  assessmentResult: AssessmentResult;
}

export function TeaserInsightsGrid({ assessmentResult }: TeaserInsightsGridProps) {
  const teaserInsights = getTeaserInsights();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {teaserInsights.map((insight, index) => (
        <Card key={index} className="relative overflow-hidden">
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </div>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">{insight.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {insight.preview}
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-dashed">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Full insight available with premium access
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getTeaserInsights() {
  const insights = [
    {
      title: "Your Optimal Energy Patterns",
      preview: "We've identified when you're most alert and productive. Your full plan includes personalized scheduling recommendations..."
    },
    {
      title: "Personalized Goal Framework",
      preview: "Based on your responses, we've created goal templates specifically for your situation. Access includes step-by-step guides..."
    },
    {
      title: "Support Network Integration",
      preview: "Your assessment shows opportunities for enhanced support. Premium features include family coordination tools..."
    },
    {
      title: "Progress Tracking System",
      preview: "We've designed custom metrics based on your priorities. Full access includes detailed progress analytics..."
    }
  ];

  return insights.slice(0, 3);
}
