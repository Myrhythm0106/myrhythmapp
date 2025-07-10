
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, CheckCircle } from "lucide-react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { UserType } from "../UserTypeStep";

interface UserGuideIntegrationProps {
  assessmentResult: AssessmentResult;
  onBack: () => void;
  onContinue: () => void;
  userType?: UserType | null;
}

export function UserGuideIntegration({ assessmentResult, onBack, onContinue, userType }: UserGuideIntegrationProps) {
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Your {getUserTypeDisplay()} Guide</h1>
        <p className="text-lg text-muted-foreground">
          Access your personalized user guide tailored to your assessment results
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What's included in your guide:</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Personalized action plan based on your {assessmentResult.focusArea} focus</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Step-by-step implementation strategies</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Progress tracking tools and techniques</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Specialized guidance for {getUserTypeDisplay().toLowerCase()}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onContinue} className="flex-1">
          Access Guide
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
