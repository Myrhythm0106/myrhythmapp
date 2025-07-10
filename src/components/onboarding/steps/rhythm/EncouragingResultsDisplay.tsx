
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { focusAreas } from "@/utils/rhythmAnalysis";
import { Trophy, Sparkles, ArrowRight } from "lucide-react";
import { UserType } from "../UserTypeStep";

interface EncouragingResultsDisplayProps {
  assessmentResult: AssessmentResult;
  userType?: UserType | null;
}

export function EncouragingResultsDisplay({ assessmentResult, userType }: EncouragingResultsDisplayProps) {
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
    <div className="max-w-3xl mx-auto space-y-6 text-center">
      <div className="space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <Trophy className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
          Congratulations! 🎉
        </h1>
        <p className="text-xl text-gray-700">
          You've completed your {getUserTypeDisplay()} Assessment
        </p>
      </div>

      <Card className="bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200">
        <CardContent className="p-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-teal-600" />
              <h2 className="text-2xl font-bold text-teal-800">You're Amazing!</h2>
              <Sparkles className="h-6 w-6 text-teal-600" />
            </div>
            <p className="text-lg text-teal-700">
              Taking this assessment shows your commitment to {getUserTypeDisplay().toLowerCase()} and personal growth.
            </p>
            <div className="bg-white/50 p-4 rounded-lg">
              <h3 className="font-semibold text-teal-800 mb-2">Your Primary Focus: {focusInfo.title}</h3>
              <Badge className="bg-teal-600 text-white px-4 py-2 text-lg">
                {overallPercentage}% Assessment Score
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-6 rounded-xl border-2 border-emerald-200">
        <h3 className="text-xl font-bold text-emerald-800 mb-2">
          ✨ You're Almost Ready! ✨
        </h3>
        <p className="text-emerald-700 mb-4">
          Your personalized {getUserTypeDisplay().toLowerCase()} journey is about to begin. You're just moments away from accessing powerful tools designed specifically for your needs.
        </p>
        <div className="flex items-center justify-center gap-2 text-emerald-600">
          <span>Next: Access Your Complete Results</span>
          <ArrowRight className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
