
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { focusAreas } from "@/utils/rhythmAnalysis";
import { Lock, Star, ArrowRight, Brain, Eye, Crown, Zap, Timer } from "lucide-react";

interface AssessmentTeaserPreviewProps {
  assessmentResult: AssessmentResult;
  onContinue: () => void;
}

export function AssessmentTeaserPreview({ assessmentResult, onContinue }: AssessmentTeaserPreviewProps) {
  const { focusArea, overallScore, personalizedData } = assessmentResult;
  const focusInfo = focusAreas[focusArea];
  
  const overallPercentage = Math.round((overallScore / 3) * 100);

  const handleUpgradeClick = () => {
    console.log("Upgrade button clicked - navigating to payment");
    onContinue();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Current Mode Header */}
      <div className="text-center space-y-2">
        <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-300 px-4 py-2">
          <Eye className="h-4 w-4 mr-2" />
          Current Mode: Basic Preview
        </Badge>
        <p className="text-sm text-gray-600">
          Get a taste of your personalized insights. Upgrade for complete analysis.
        </p>
      </div>

      {/* Urgent Upgrade Banner */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Timer className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-800">Limited Time: Complete Assessment Today</p>
                <p className="text-sm text-red-600">Get 20% off Premium - Expires in 24 hours</p>
              </div>
            </div>
            <Button 
              onClick={handleUpgradeClick}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              View Pricing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Your Assessment Preview</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We've identified your primary focus area. This is just a preview - upgrade for complete personalized plan.
        </p>
      </div>

      {/* Primary Focus Area Card - Limited Content */}
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
                  {focusInfo.phase} - Preview Mode
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{overallPercentage}%</div>
              <div className="text-sm text-white/80">Basic Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-white/95 text-gray-900">
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{focusInfo.title}</h3>
              <p className="text-gray-700 leading-relaxed">{focusInfo.description.substring(0, 120)}...</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <Lock className="h-4 w-4" />
                <span>Complete description available with Premium</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview: Your Top Recommendation
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-gray-700">{focusInfo.primaryActions[0]}</span>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded border-l-4 border-orange-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-orange-600" />
                    <span className="font-semibold text-orange-800">Unlock {focusInfo.primaryActions.length - 1} More Personalized Strategies</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    Premium members get a complete personalized action plan with step-by-step guidance, 
                    progress tracking, and ongoing support to achieve their goals.
                  </p>
                  <Button 
                    onClick={handleUpgradeClick}
                    className="mt-3 bg-orange-600 hover:bg-orange-700 text-white text-sm"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    View Premium Plans
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locked Premium Features */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="relative border-2 border-dashed border-gray-300 bg-gray-50">
          <div className="absolute top-3 right-3">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Complete Personalized Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="bg-white p-2 rounded text-sm">
                <span className="font-medium text-gray-800">✓ 8 Detailed Insights</span>
              </div>
              <div className="bg-white p-2 rounded text-sm">
                <span className="font-medium text-gray-800">✓ Personalized Strengths Analysis</span>
              </div>
              <div className="bg-white p-2 rounded text-sm">
                <span className="font-medium text-gray-800">✓ Growth Opportunity Mapping</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <Button 
                onClick={handleUpgradeClick}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                See Pricing
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="relative border-2 border-dashed border-gray-300 bg-gray-50">
          <div className="absolute top-3 right-3">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              8-Week Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="bg-white p-2 rounded text-sm">
                <span className="font-medium text-gray-800">✓ Step-by-Step Weekly Goals</span>
              </div>
              <div className="bg-white p-2 rounded text-sm">
                <span className="font-medium text-gray-800">✓ Progress Tracking System</span>
              </div>
              <div className="bg-white p-2 rounded text-sm">
                <span className="font-medium text-gray-800">✓ Milestone Celebrations</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <Button 
                onClick={handleUpgradeClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                See Pricing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Basic Progress Indicator */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3 mb-2">
          <Progress value={overallPercentage} className="flex-1 h-3" />
          <span className="text-sm font-medium text-blue-800">{overallPercentage}%</span>
        </div>
        <p className="text-sm text-blue-700">
          Basic assessment complete. Premium analysis shows detailed progress breakdown across 12 key areas.
        </p>
      </div>

      {/* Main Call to Action */}
      <div className="text-center space-y-4 pt-4">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200">
          <h3 className="text-xl font-bold text-purple-900 mb-2">
            🚀 Ready for Your Complete Transformation Plan?
          </h3>
          <p className="text-purple-700 mb-4">
            Join thousands who've unlocked their full potential with our Premium assessment and personalized guidance.
          </p>
          <Button 
            onClick={handleUpgradeClick}
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 text-lg"
          >
            View Premium Plans & Pricing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-purple-600 mt-2">
            7-day free trial available • Cancel anytime • Full access
          </p>
        </div>
      </div>

      {/* What You're Missing Section */}
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200">
        <CardContent className="p-6 text-center">
          <h4 className="font-bold text-red-900 mb-3 text-lg">
            What You're Missing in Preview Mode:
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-red-700">• 7 Additional Personalized Insights</p>
              <p className="text-red-700">• Complete Strengths Analysis</p>
              <p className="text-red-700">• Detailed Growth Roadmap</p>
              <p className="text-red-700">• 8-Week Action Plan</p>
            </div>
            <div className="space-y-1">
              <p className="text-red-700">• Progress Tracking Dashboard</p>
              <p className="text-red-700">• Goal Setting Templates</p>
              <p className="text-red-700">• Milestone Celebrations</p>
              <p className="text-red-700">• Ongoing Support & Guidance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
