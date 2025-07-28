import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { PersonalizedInsight } from "@/utils/personalizedInsights";
import { PremiumAssessmentResult } from "@/types/assessmentTypes";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Target, Lightbulb, TrendingUp, Heart, Star, ArrowRight, Sparkles, Crown } from "lucide-react";

interface PersonalizedResultsDisplayProps {
  assessmentResult: AssessmentResult | PremiumAssessmentResult;
  onContinue: () => void;
}

export function PersonalizedResultsDisplay({ assessmentResult, onContinue }: PersonalizedResultsDisplayProps) {
  const { hasFeature } = useSubscription();
  
  // Only show personalized results for paid users
  if (!hasFeature('personalizedInsights')) {
    return (
      <div className="text-center py-8">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Upgrade Required</h3>
            <p className="text-muted-foreground mb-6">
              Personalized insights are available with our premium plans. 
              Upgrade to unlock your complete MYRHYTHM profile with detailed cognitive patterns and custom recommendations.
            </p>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Personalized cognitive insights</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span>Custom action plans</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Detailed strength analysis</span>
            </div>
          </div>
          <Button onClick={onContinue} className="bg-gradient-to-r from-primary to-accent">
            View Upgrade Options
          </Button>
        </div>
      </div>
    );
  }
  
  if (!assessmentResult?.personalizedData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Personalized insights not available</p>
      </div>
    );
  }

  const { personalizedData, overallScore } = assessmentResult;

  const getInsightIcon = (type: PersonalizedInsight['type']) => {
    switch (type) {
      case "strength": return <Star className="h-5 w-5 text-green-600" />;
      case "challenge": return <Target className="h-5 w-5 text-orange-600" />;
      case "unique": return <Sparkles className="h-5 w-5 text-purple-600" />;
      case "opportunity": return <TrendingUp className="h-5 w-5 text-blue-600" />;
      default: return <Lightbulb className="h-5 w-5 text-gray-600" />;
    }
  };

  const getInsightBadgeColor = (type: PersonalizedInsight['type']) => {
    switch (type) {
      case "strength": return "bg-green-100 text-green-800 border-green-300";
      case "challenge": return "bg-orange-100 text-orange-800 border-orange-300";
      case "unique": return "bg-purple-100 text-purple-800 border-purple-300";
      case "opportunity": return "bg-blue-100 text-blue-800 border-blue-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with unique score story */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Heart className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Your Unique Rhythm Discovery</CardTitle>
          </div>
          <Badge className="mx-auto bg-primary/10 text-primary border-primary/20 px-4 py-1">
            {personalizedData.personalProfile.rhythmSignature}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {Math.round((overallScore / 3) * 100)}%
              <span className="text-lg text-gray-600 font-normal ml-2">overall progress</span>
            </div>
            <Progress value={(overallScore / 3) * 100} className="w-full max-w-md mx-auto h-3" />
          </div>
          
           <div className="bg-white/70 p-4 rounded-lg border border-blue-200">
             <p className="text-gray-700 leading-relaxed text-center">
               Your personalized analysis reveals unique patterns in your cognitive rhythm and provides targeted recommendations for optimization.
             </p>
           </div>
          
           <div className="text-center">
             <Badge variant="outline" className="capitalize bg-primary/5 text-primary border-primary/30 px-3 py-1">
               Primary Focus: {(assessmentResult as any).focusArea?.replace('-', ' ') || 'Cognitive Wellness'}
             </Badge>
           </div>
        </CardContent>
      </Card>

      {/* Personalized insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalizedData.insights.map((insight, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                    <Badge className={`text-xs ${getInsightBadgeColor(insight.type)}`}>
                      {insight.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                {insight.description}
              </p>
              {insight.actionable && (
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-primary">
                  <p className="text-sm font-medium text-gray-800">
                    💡 {insight.actionable}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Personal rhythm profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Personal Rhythm Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-gray-700 leading-relaxed">
              {personalizedData.personalProfile.personalizedMessage}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Unique Characteristics */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                What Makes You Unique
              </h4>
              <div className="space-y-2">
                {personalizedData.personalProfile.uniqueCharacteristics.map((char, index) => (
                  <div key={index} className="text-sm bg-purple-50 p-2 rounded border border-purple-200">
                    {char}
                  </div>
                ))}
              </div>
            </div>

            {/* Strength Areas */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Star className="h-4 w-4 text-green-600" />
                Your Strengths
              </h4>
               <div className="space-y-2">
                 {((personalizedData.personalProfile as any).strengths || (personalizedData.personalProfile as any).strengthAreas || []).map((strength: string, index: number) => (
                   <div key={index} className="text-sm bg-green-50 p-2 rounded border border-green-200">
                     {strength}
                   </div>
                 ))}
               </div>
            </div>

            {/* Growth Opportunities */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Growth Areas
              </h4>
              <div className="space-y-2">
                {personalizedData.personalProfile.growthOpportunities.map((opportunity, index) => (
                  <div key={index} className="text-sm bg-blue-50 p-2 rounded border border-blue-200">
                    {opportunity}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalized next steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Your Personalized Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {personalizedData.personalProfile.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center font-semibold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

       {/* Detailed determination reason */}
       <Card>
         <CardHeader>
           <CardTitle className="text-lg">Why This Focus Area Was Chosen For You</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
             <p className="text-gray-700 leading-relaxed">
               {(assessmentResult as any).determinationReason || "This focus area was selected based on your personalized assessment responses and cognitive patterns."}
             </p>
           </div>
         </CardContent>
       </Card>

      {/* Continue button */}
      <div className="flex justify-center pt-6">
        <Button onClick={onContinue} size="lg" className="bg-gradient-to-r from-primary to-primary/80">
          Continue to Your Personalized Journey
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}