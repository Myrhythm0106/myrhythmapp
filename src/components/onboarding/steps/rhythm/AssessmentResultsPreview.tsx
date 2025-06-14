
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Target, TrendingUp, Lock, Crown, Zap } from "lucide-react";

interface AssessmentResultsPreviewProps {
  assessmentResult: {
    focusArea: string;
    overallScore: number;
    sectionScores: Record<string, number>;
    determinationReason: string;
    personalizedData?: any;
  };
  onPaymentSelect: (option: 'trial' | 'monthly' | 'annual' | 'skip') => void;
}

export function AssessmentResultsPreview({ assessmentResult, onPaymentSelect }: AssessmentResultsPreviewProps) {
  // Calculate overall progress as a percentage
  const progressPercentage = Math.round((assessmentResult.overallScore / 100) * 100);
  
  // Get focus area information
  const focusAreaInfo = getFocusAreaInfo(assessmentResult.focusArea);
  
  // Get teaser insights based on assessment results
  const teaserInsights = getTeaserInsights(assessmentResult);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          <h1 className="text-3xl font-bold">Your Rhythm Assessment Results</h1>
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </div>
        <p className="text-lg text-muted-foreground">
          We've analyzed your responses and discovered valuable insights about your unique rhythm
        </p>
      </div>

      {/* Primary Focus Area Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl">Your Primary Focus Area</h2>
              <p className="text-sm text-muted-foreground font-normal">
                Based on your assessment responses
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-primary capitalize">
              {focusAreaInfo.displayName}
            </h3>
            <p className="text-muted-foreground">
              {focusAreaInfo.description}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress Assessment</span>
              <span className="text-sm font-bold">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-xs text-muted-foreground text-center">
              You're making progress! Your personalized plan will help you build on this foundation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Teaser Insights */}
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

      {/* Call to Action */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="text-center space-y-6 py-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Unlock Your Complete Personalized Plan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get your full assessment results, personalized action plans, goal templates, 
              and ongoing support to achieve your rhythm and recovery goals.
            </p>
          </div>
          
          {/* Payment Options */}
          <div className="grid gap-3 max-w-md mx-auto">
            <Button
              onClick={() => onPaymentSelect('trial')}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Start 7-Day Free Trial
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => onPaymentSelect('monthly')}
                variant="outline"
                size="sm"
              >
                Pay Monthly
              </Button>
              <Button
                onClick={() => onPaymentSelect('annual')}
                variant="outline"
                size="sm"
                className="relative"
              >
                <Zap className="h-4 w-4 mr-1" />
                Annual (Save 20%)
              </Button>
            </div>
            
            <Button
              onClick={() => onPaymentSelect('skip')}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              Continue with limited access
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to get focus area display information
function getFocusAreaInfo(focusArea: string) {
  const focusAreas: Record<string, { displayName: string; description: string }> = {
    'cognitive-function': {
      displayName: 'Cognitive Function',
      description: 'Enhancing memory, attention, and mental clarity through targeted exercises and routines.'
    },
    'emotional-regulation': {
      displayName: 'Emotional Regulation',
      description: 'Building resilience and healthy coping strategies for emotional well-being.'
    },
    'physical-wellness': {
      displayName: 'Physical Wellness',
      description: 'Improving strength, mobility, and overall physical health through structured activities.'
    },
    'social-connection': {
      displayName: 'Social Connection',
      description: 'Strengthening relationships and building supportive community connections.'
    },
    'independence': {
      displayName: 'Independence',
      description: 'Developing skills and confidence for greater autonomy in daily activities.'
    },
    'routine-structure': {
      displayName: 'Routine & Structure',
      description: 'Creating consistent, supportive daily patterns that promote stability and growth.'
    }
  };

  return focusAreas[focusArea] || {
    displayName: focusArea.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: 'Your personalized focus area for optimal growth and recovery.'
  };
}

// Helper function to generate teaser insights
function getTeaserInsights(assessmentResult: any) {
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

  // Return first 3 insights for preview
  return insights.slice(0, 3);
}
