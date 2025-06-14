
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Lock, Star, Sparkles, Heart, Brain } from "lucide-react";
import { AssessmentResult, focusAreas } from "@/utils/rhythmAnalysis";
import { cn } from "@/lib/utils";

interface AssessmentResultsPreviewProps {
  assessmentResult: AssessmentResult;
  onUnlockResults: () => void;
}

export function AssessmentResultsPreview({ assessmentResult, onUnlockResults }: AssessmentResultsPreviewProps) {
  const focusInfo = focusAreas[assessmentResult.focusArea];
  const overallPercentage = Math.round(assessmentResult.overallScore * 100);
  
  // Get top 2 section scores for teaser
  const topSections = Object.entries(assessmentResult.sectionScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2);

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'M': return Star;
      case 'Y': return Brain;
      case 'R': return Heart;
      case 'H': return Sparkles;
      case 'T': return Star;
      default: return Star;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Assessment Complete!</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">
          Your Rhythm Assessment Results Preview
        </h1>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your personalized insights are ready! Here's a preview of what we discovered about your unique rhythm and journey.
        </p>
      </div>

      {/* Primary Focus Area */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <focusInfo.icon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl text-primary">Your Primary Focus Area</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Badge variant="secondary" className="text-lg px-4 py-2 bg-primary text-white">
            {focusInfo.name}
          </Badge>
          <p className="text-gray-700 leading-relaxed max-w-lg mx-auto">
            {focusInfo.shortDescription}
          </p>
          <div className="bg-white/50 p-4 rounded-lg border border-primary/10">
            <p className="text-sm text-gray-600 italic">
              "Your rhythm signature suggests you're in the {focusInfo.phase} phase of your journey..."
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Your Rhythm Strength Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Rhythm Strength</span>
              <span className="text-lg font-bold text-primary">{overallPercentage}%</span>
            </div>
            <Progress value={overallPercentage} className="h-3" />
            <p className="text-sm text-gray-600">
              {overallPercentage >= 70 ? "Strong foundation - ready for optimization!" :
               overallPercentage >= 50 ? "Good progress - room for targeted growth!" :
               "Great starting point - exciting growth potential ahead!"}
            </p>
          </div>
          
          {/* Top Areas Preview */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-gray-900">Your Strongest Areas (Preview)</h4>
            {topSections.map(([sectionId, score], index) => {
              const percentage = Math.round(score * 100);
              return (
                <div key={sectionId} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-green-700">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">
                        {sectionId.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm font-bold text-green-600">{percentage}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <Lock className="h-4 w-4 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">
                Unlock detailed insights for all {Object.keys(assessmentResult.sectionScores).length} areas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Insights Teaser */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Your Complete Personalized Plan Awaits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="space-y-1">
                <div className="font-medium text-blue-700">📊 Detailed Analysis</div>
                <div>Complete breakdown of all 8 rhythm areas</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-purple-700">🎯 Action Plan</div>
                <div>Personalized strategies for your focus area</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-green-700">🚀 Goal Templates</div>
                <div>Ready-to-use goals tailored to your rhythm</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unlock CTA */}
      <div className="text-center space-y-4 pt-6">
        <Button 
          onClick={onUnlockResults}
          size="lg"
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-4 text-lg"
        >
          <Lock className="h-5 w-5 mr-2" />
          Unlock Your Complete Personalized Plan
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
        
        <p className="text-sm text-gray-500">
          Get your full assessment results, personalized action plan, and goal templates
        </p>
      </div>
    </div>
  );
}
