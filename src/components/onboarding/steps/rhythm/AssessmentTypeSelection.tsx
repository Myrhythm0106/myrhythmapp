
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, ArrowRight, CheckCircle } from "lucide-react";

interface AssessmentTypeSelectionProps {
  onSelectType: (type: 'brief' | 'comprehensive') => void;
}

export function AssessmentTypeSelection({ onSelectType }: AssessmentTypeSelectionProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-beacon-600 to-beacon-800 bg-clip-text text-transparent">
          Choose Your Assessment Experience
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We offer two assessment options to fit your time and needs. You can always upgrade to the comprehensive assessment later.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Brief Assessment */}
        <Card className="relative hover:shadow-lg transition-shadow border-2 hover:border-beacon-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-beacon-800">Quick Start</CardTitle>
              <Badge className="bg-green-100 text-green-700">Recommended</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>2-3 minutes</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-gray-700">
                Get started quickly with our essential questions that provide immediate, personalized recommendations.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>3 core questions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Immediate personalized insights</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Quick onboarding experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Can upgrade anytime</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => onSelectType('brief')} 
              className="w-full bg-gradient-to-r from-beacon-600 to-beacon-700 hover:from-beacon-700 hover:to-beacon-800"
            >
              Start Quick Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Comprehensive Assessment */}
        <Card className="relative hover:shadow-lg transition-shadow border-2 hover:border-purple-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-purple-800">Complete Experience</CardTitle>
              <Badge variant="outline" className="border-purple-200 text-purple-700">Most Accurate</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>5-7 minutes</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-gray-700">
                Our full assessment provides the most accurate and detailed recommendations for your unique needs.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span>6 comprehensive questions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span>Detailed personalized insights</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span>Advanced recommendations</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span>Full cognitive pattern analysis</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => onSelectType('comprehensive')} 
              variant="outline"
              className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              Start Complete Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Don't worry - you can always retake or upgrade your assessment later from your dashboard.
        </p>
      </div>
    </div>
  );
}
