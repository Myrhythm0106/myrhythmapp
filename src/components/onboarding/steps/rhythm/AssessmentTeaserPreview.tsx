
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { focusAreas } from "@/utils/rhythmAnalysis";
import { ArrowRight, Lock, Star } from "lucide-react";
import { UserType } from "../UserTypeStep";

interface AssessmentTeaserPreviewProps {
  assessmentResult: AssessmentResult;
  onContinue: () => void;
  userType?: UserType | null;
  onSeePricing?: () => void;
}

export function AssessmentTeaserPreview({ assessmentResult, onContinue, userType, onSeePricing }: AssessmentTeaserPreviewProps) {
  const { focusArea, overallScore } = assessmentResult;
  const focusInfo = focusAreas[focusArea];
  const overallPercentage = Math.round((overallScore / 3) * 100);

  const getUserTypeDisplay = () => {
    switch (userType) {
      case 'brain-injury': return 'Brain Injury Recovery';
      case 'caregiver': return 'Caregiver Support';
      case 'cognitive-optimization': return 'Cognitive Optimization';
      case 'wellness': return 'General Wellness';
      default: return 'Personal Development';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Your {getUserTypeDisplay()} Assessment Results</h1>
        <p className="text-lg text-muted-foreground">
          Here's a preview of your personalized insights
        </p>
      </div>

      {/* Teaser Focus Area Card */}
      <Card className={`relative overflow-hidden border-2 bg-gradient-to-r ${focusInfo.gradient}`}>
        <CardHeader className="text-white relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-white">Your Primary Focus Area</CardTitle>
              <Badge className="bg-white/20 text-white border-white/30 mt-1">
                {focusInfo.phase} - Preview
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{overallPercentage}%</div>
              <div className="text-sm text-white/80">Overall Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-white/95 text-gray-900">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">{focusInfo.title}</h3>
            <p className="text-gray-700 leading-relaxed">{focusInfo.description}</p>
            
            {/* Locked Content Preview */}
            <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300 relative">
              <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">Unlock Your Complete Action Plan</p>
                  <p className="text-sm text-gray-500">See personalized strategies & detailed insights</p>
                </div>
              </div>
              <div className="opacity-30">
                <h4 className="font-semibold text-gray-900 mb-2">Your Personalized Action Plan</h4>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teaser Benefits */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="text-center p-4">
          <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <h4 className="font-semibold">Personalized Insights</h4>
          <p className="text-sm text-muted-foreground">Tailored to your {getUserTypeDisplay().toLowerCase()}</p>
        </Card>
        <Card className="text-center p-4">
          <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <h4 className="font-semibold">Action Plans</h4>
          <p className="text-sm text-muted-foreground">Step-by-step guidance</p>
        </Card>
        <Card className="text-center p-4">
          <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <h4 className="font-semibold">Progress Tracking</h4>
          <p className="text-sm text-muted-foreground">Monitor your journey</p>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4">
        <div className="flex gap-4 justify-center">
          {onSeePricing && (
            <Button variant="outline" onClick={onSeePricing}>
              See Pricing Options
            </Button>
          )}
          <Button onClick={onContinue} size="lg">
            Continue Your Journey
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
