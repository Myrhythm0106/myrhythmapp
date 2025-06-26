
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { focusAreas } from "@/utils/rhythmAnalysis";
import { Lock, Star, ArrowRight, Brain, Eye } from "lucide-react";

interface AssessmentTeaserPreviewProps {
  assessmentResult: AssessmentResult;
  onContinue: () => void;
}

export function AssessmentTeaserPreview({ assessmentResult, onContinue }: AssessmentTeaserPreviewProps) {
  const { focusArea, overallScore, personalizedData } = assessmentResult;
  const focusInfo = focusAreas[focusArea];
  
  const overallPercentage = Math.round((overallScore / 3) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Your Rhythm Assessment Complete!</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We've analyzed your responses and identified your primary focus area. Here's a preview of your personalized insights.
        </p>
      </div>

      {/* Primary Focus Area Card */}
      <Card className={`relative overflow-hidden border-2 bg-gradient-to-r ${focusInfo.gradient}`}>
        <CardHeader className="text-white relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">Your Primary Focus Area</CardTitle>
                <Badge className="bg-white/20 text-white border-white/30 mt-1">
                  {focusInfo.phase}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{overallPercentage}%</div>
              <div className="text-sm text-white/80">Overall Progress</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-white/95 text-gray-900">
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{focusInfo.title}</h3>
              <p className="text-gray-700 leading-relaxed">{focusInfo.description}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Your Top Recommended Actions:</h4>
              <div className="space-y-2">
                {focusInfo.primaryActions.slice(0, 2).map((action, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-gray-700">{action}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <Lock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500 italic">
                    + {focusInfo.primaryActions.length - 2} more personalized recommendations available with full access
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview of Additional Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="relative">
          <div className="absolute top-3 right-3">
            <Lock className="h-4 w-4 text-gray-400" />
          </div>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Personalized Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">
              We've identified {personalizedData?.insights?.length || 4} specific insights about your unique rhythm patterns...
            </p>
            <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
              <p className="text-sm font-medium text-gray-800">
                Preview: {personalizedData?.insights?.[0]?.title || "Your unique strength areas"}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {personalizedData?.insights?.[0]?.description?.substring(0, 80) || "Based on your responses, we've identified key areas where you naturally excel"}...
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 text-xs text-gray-500">
              <Lock className="h-3 w-3" />
              <span>Full personalized profile available with registration</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative">
          <div className="absolute top-3 right-3">
            <Lock className="h-4 w-4 text-gray-400" />
          </div>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-green-600" />
              Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">
              Your step-by-step personalized plan to strengthen your rhythm...
            </p>
            <div className="space-y-2">
              <div className="bg-green-50 p-2 rounded text-sm">
                <span className="font-medium text-green-800">Week 1-2:</span>
                <span className="text-green-700 ml-2">Foundation building exercises</span>
              </div>
              <div className="bg-gray-100 p-2 rounded text-sm flex items-center gap-2">
                <Lock className="h-3 w-3 text-gray-400" />
                <span className="text-gray-500">Weeks 3-8: Advanced strategies</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 text-xs text-gray-500">
              <Lock className="h-3 w-3" />
              <span>Complete 8-week plan available with full access</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress indicator */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3 mb-2">
          <Progress value={overallPercentage} className="flex-1 h-3" />
          <span className="text-sm font-medium text-blue-800">{overallPercentage}%</span>
        </div>
        <p className="text-sm text-blue-700">
          Your assessment shows {overallPercentage >= 70 ? 'strong' : overallPercentage >= 50 ? 'moderate' : 'developing'} rhythm patterns. 
          Register to unlock your complete personalized journey plan.
        </p>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4 pt-4">
        <Button 
          onClick={onContinue}
          size="lg" 
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-8 py-3 text-lg"
        >
          See How to Get Full Access
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-sm text-gray-500">
          Discover your complete personalized rhythm plan and start your transformation journey
        </p>
      </div>
    </div>
  );
}
