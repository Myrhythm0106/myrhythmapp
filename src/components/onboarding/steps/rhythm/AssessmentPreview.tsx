import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lock, ArrowRight, Brain, Target, Users, Sparkles } from "lucide-react";

interface AssessmentPreviewProps {
  assessmentResult: any;
  onUpgrade: () => void;
  onContinueWithPreview: (data: any) => void;
}

export function AssessmentPreview({ assessmentResult, onUpgrade, onContinueWithPreview }: AssessmentPreviewProps) {
  const [showFullPreview, setShowFullPreview] = useState(false);

  const previewInsights = [
    {
      icon: Brain,
      title: "Memory Bridge Integration",
      preview: "Your assessment reveals strong potential for voice-to-calendar transformation...",
      locked: "Unlock your complete Memory Bridge profile with personalized voice processing patterns and calendar optimization strategies.",
      color: "bg-blue-500"
    },
    {
      icon: Target,
      title: "Cognitive Patterns",
      preview: "Initial analysis shows focused attention strengths...",
      locked: "Access your full cognitive pattern analysis with 12 detailed insights and personalized optimization techniques.",
      color: "bg-purple-500"
    },
    {
      icon: Users,
      title: "Support Network Integration",
      preview: "Your responses indicate collaborative tendencies...",
      locked: "Discover your complete support network strategy with family integration tools and progress sharing systems.",
      color: "bg-green-500"
    },
    {
      icon: Sparkles,
      title: "Personalized Recommendations",
      preview: "Based on your responses, we recommend morning routine optimization...",
      locked: "Get 25+ personalized recommendations including Memory Bridge setup, calendar automation, and daily wellness protocols.",
      color: "bg-amber-500"
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Assessment Preview
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Here's a glimpse of your personalized MyRhythm profile. Upgrade to unlock your complete cognitive wellness journey.
        </p>
      </div>

      {/* Memory Bridge Feature Highlight */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-blue-900">Memory Bridge: Your Game-Changer</CardTitle>
              <p className="text-blue-700">Transform conversations into actionable calendar events</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-800">
            <strong>What you'll get:</strong> Record meetings, get AI-powered summaries, and automatically convert key discussion points into calendar actions with A.C.T.S. framework integration.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">Preview Features:</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Basic voice recording</li>
                <li>• Simple summary generation</li>
                <li>• Manual calendar integration</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                Full Version: <Lock className="h-4 w-4" />
              </h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• AI-powered A.C.T.S. extraction</li>
                <li>• Automatic calendar scheduling</li>
                <li>• Smart follow-up reminders</li>
                <li>• Progress tracking & analytics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Insights Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {previewInsights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Card key={index} className="relative border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${insight.color} flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">{insight.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {insight.preview}
                </p>
                
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Unlock Full Analysis</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {insight.locked}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onUpgrade}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
        >
          Unlock Full Experience
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        <Button
          onClick={() => onContinueWithPreview(assessmentResult)}
          variant="outline"
          size="lg"
          className="px-8 py-3"
        >
          Continue with Preview
        </Button>
      </div>

      {/* Value Proposition */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Why Upgrade Now?
          </h3>
          <p className="text-green-800 mb-4">
            Get immediate access to Memory Bridge, your complete cognitive profile, and 25+ personalized tools that transform how you manage your mental wellness.
          </p>
          <div className="flex justify-center gap-6 text-sm text-green-700">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>Memory Bridge included</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}