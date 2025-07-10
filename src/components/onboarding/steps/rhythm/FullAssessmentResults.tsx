
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { focusAreas } from "@/utils/rhythmAnalysis";
import { Star, ArrowRight, Brain, Trophy, Target, BookOpen } from "lucide-react";
import { UserType } from "../UserTypeStep";

interface FullAssessmentResultsProps {
  assessmentResult: AssessmentResult;
  userType?: UserType | null;
  onContinue: () => void;
}

export function FullAssessmentResults({ assessmentResult, userType, onContinue }: FullAssessmentResultsProps) {
  const { focusArea, overallScore, personalizedData } = assessmentResult;
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Your Complete {getUserTypeDisplay()} Assessment</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Congratulations! Here are your personalized insights and action plan to help you achieve your goals.
        </p>
      </div>

      {/* Primary Focus Area Card - Full Content */}
      <Card className={`relative overflow-hidden border-2 bg-gradient-to-r ${focusInfo.gradient}`}>
        <CardHeader className="text-white relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">Your Primary Focus Area</CardTitle>
                <Badge className="bg-white/20 text-white border-white/30 mt-1">
                  {focusInfo.phase} - Complete Analysis
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{overallPercentage}%</div>
              <div className="text-sm text-white/80">Overall Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-white/95 text-gray-900">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{focusInfo.title}</h3>
              <p className="text-gray-700 leading-relaxed text-lg">{focusInfo.description}</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Your Personalized Action Plan
              </h4>
              <div className="space-y-3">
                {focusInfo.primaryActions.map((action, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalized Insights */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-2">Your Strengths</h5>
                <ul className="text-sm space-y-1">
                  <li className="text-blue-800">• Strong motivation for improvement</li>
                  <li className="text-blue-800">• Good self-awareness</li>
                  <li className="text-blue-800">• Ready for positive change</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-900 mb-2">Growth Opportunities</h5>
                <ul className="text-sm space-y-1">
                  <li className="text-purple-800">• Consistent daily routines</li>
                  <li className="text-purple-800">• Progress tracking habits</li>
                  <li className="text-purple-800">• Goal achievement systems</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Your Journey Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Assessment Score</span>
              <span className="text-sm font-bold">{overallPercentage}%</span>
            </div>
            <Progress value={overallPercentage} className="h-3" />
            <p className="text-sm text-gray-600">
              Great work! You've completed your assessment and are ready to begin your personalized journey.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <div className="text-center space-y-4 pt-4">
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-6 rounded-xl border-2 border-teal-200">
          <h3 className="text-xl font-bold text-teal-900 mb-2">
            🚀 Ready to Start Your {getUserTypeDisplay()} Journey?
          </h3>
          <p className="text-teal-700 mb-4">
            Access your personalized user guide and begin implementing your action plan today.
          </p>
          <Button 
            onClick={onContinue}
            size="lg" 
            className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 px-8 py-3 text-lg"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Access Your User Guide
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
