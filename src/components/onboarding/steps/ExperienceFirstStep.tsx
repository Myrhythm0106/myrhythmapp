import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Sparkles, ArrowRight } from "lucide-react";

interface ExperienceFirstStepProps {
  onTryPreview: () => void;
  onUpgrade: () => void;
}

export function ExperienceFirstStep({ onTryPreview, onUpgrade }: ExperienceFirstStepProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-beacon-600 to-beacon-800 bg-clip-text text-transparent">
          Experience MyRhythm First
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Try our assessment preview to see how MyRhythm works, then decide if you'd like the full personalized experience.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Preview Option */}
        <Card className="relative hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-blue-800">Try Preview</CardTitle>
              <Badge className="bg-blue-100 text-blue-700">Free</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>2-3 minutes</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-gray-700">
                Experience a simplified version of our assessment and see sample insights.
              </p>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Quick assessment with basic questions</div>
                <div>• Sample personalized insights</div>
                <div>• Overview of the MyRhythm approach</div>
                <div>• Upgrade option after trying</div>
              </div>
            </div>

            <Button 
              onClick={onTryPreview} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Try Assessment Preview
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Full Experience */}
        <Card className="relative hover:shadow-lg transition-shadow border-2 hover:border-beacon-200 bg-gradient-to-br from-beacon-50 to-beacon-100">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-beacon-800">Full Experience</CardTitle>
              <Badge className="bg-beacon-600 text-white">Recommended</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="h-4 w-4" />
              <span>Complete personalization</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-gray-700">
                Get the full MyRhythm assessment with comprehensive insights and personalized recommendations.
              </p>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Complete MYRHYTHM assessment</div>
                <div>• Detailed cognitive pattern analysis</div>
                <div>• Personalized improvement strategies</div>
                <div>• Ongoing support and tracking</div>
              </div>
            </div>

            <Button 
              onClick={onUpgrade} 
              className="w-full bg-gradient-to-r from-beacon-600 to-beacon-700 hover:from-beacon-700 hover:to-beacon-800"
            >
              Start Full Experience
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          No commitment required for the preview. Upgrade anytime to unlock your full potential.
        </p>
      </div>
    </div>
  );
}