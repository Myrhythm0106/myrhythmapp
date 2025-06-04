
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AssessmentResult, focusAreas } from "@/utils/rhythmAnalysis";
import { Heart, Sparkles, Target, TrendingUp, Star } from "lucide-react";

interface EncouragingResultsDisplayProps {
  assessmentResult: AssessmentResult;
}

export function EncouragingResultsDisplay({ assessmentResult }: EncouragingResultsDisplayProps) {
  const focusInfo = focusAreas[assessmentResult.focusArea];
  
  // Create encouraging strength indicators from section scores
  const strengthAreas = assessmentResult.sectionScores
    .map(section => ({
      name: section.title,
      strength: Math.round((section.average / 3) * 100),
      isTopStrength: section.average >= 2.0
    }))
    .sort((a, b) => b.strength - a.strength);

  const topStrengths = strengthAreas.filter(area => area.isTopStrength).slice(0, 3);
  const growthAreas = strengthAreas.filter(area => !area.isTopStrength);

  const inspirationalQuotes = {
    sleep: "Rest is not a luxury, it's a foundation for your healing journey.",
    cognitive: "Your mind is incredibly resilient, and every challenge strengthens your capacity for growth.",
    emotional: "Your emotional awareness is a superpower that will guide your recovery.",
    physical: "Your body knows how to heal, and every step forward is a victory.",
    social: "Connection is medicine, and you're building the support network that will carry you forward."
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero Section */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 overflow-hidden">
        <CardContent className="p-8 text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${focusInfo.gradient} flex items-center justify-center shadow-lg`}>
            <Target className="h-10 w-10 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            🎉 Your MyRhythm Focus Discovered!
          </h2>
          
          <Badge className={`text-lg py-2 px-6 mb-4 ${
            focusInfo.color === 'red' ? 'bg-red-100 text-red-800 border-red-300' : 
            focusInfo.color === 'blue' ? 'bg-blue-100 text-blue-800 border-blue-300' : 
            focusInfo.color === 'purple' ? 'bg-purple-100 text-purple-800 border-purple-300' : 
            focusInfo.color === 'green' ? 'bg-green-100 text-green-800 border-green-300' : 
            'bg-amber-100 text-amber-800 border-amber-300'
          }`}>
            {focusInfo.title}
          </Badge>
          
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
            {focusInfo.description}
          </p>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-600">Today's Inspiration</span>
            </div>
            <p className="text-gray-800 font-medium italic">
              "{inspirationalQuotes[assessmentResult.focusArea as keyof typeof inspirationalQuotes]}"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Strengths Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">Your Strengths</h3>
            </div>
            <div className="space-y-3">
              {topStrengths.length > 0 ? (
                topStrengths.map((area, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-700">{area.name}</span>
                      <span className="text-sm text-green-600">Strong Foundation</span>
                    </div>
                    <Progress value={area.strength} className="h-2 bg-green-100" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-green-700">
                  Every journey starts with unique strengths - yours are still emerging!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">Growth Opportunities</h3>
            </div>
            <div className="space-y-3">
              {growthAreas.slice(0, 3).map((area, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-700">{area.name}</span>
                    <span className="text-sm text-blue-600">Ready to Flourish</span>
                  </div>
                  <Progress value={Math.max(area.strength, 20)} className="h-2 bg-blue-100" />
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-600 mt-3 italic">
              These areas represent your greatest potential for positive change
            </p>
          </CardContent>
        </Card>
      </div>

      {/* What's Next Section */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-800">Your Journey Forward</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/60 rounded-lg">
              <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-purple-800 mb-1">Personalized Support</h4>
              <p className="text-sm text-purple-700">
                Your app will be customized specifically for your {focusInfo.title.toLowerCase()} focus
              </p>
            </div>
            
            <div className="text-center p-4 bg-white/60 rounded-lg">
              <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-blue-800 mb-1">Gentle Progress</h4>
              <p className="text-sm text-blue-700">
                Small, achievable steps that build on your existing strengths
              </p>
            </div>
            
            <div className="text-center p-4 bg-white/60 rounded-lg">
              <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-green-800 mb-1">Celebrate Wins</h4>
              <p className="text-sm text-green-700">
                Every small victory matters and will be acknowledged along the way
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white/80 rounded-lg border border-purple-200">
            <p className="text-center text-purple-800 font-medium">
              Remember: This assessment shows your current rhythm, not your destination. 
              You're exactly where you need to be to start your unique journey forward. ✨
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
