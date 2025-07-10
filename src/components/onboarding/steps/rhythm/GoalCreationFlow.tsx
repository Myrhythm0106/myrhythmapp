
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, ArrowRight } from "lucide-react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { UserType } from "../UserTypeStep";

interface GoalCreationFlowProps {
  assessmentResult: AssessmentResult;
  onComplete: () => void;
  onBack: () => void;
  userType?: UserType | null;
}

export function GoalCreationFlow({ assessmentResult, onComplete, onBack, userType }: GoalCreationFlowProps) {
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
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
          <Target className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Set Your {getUserTypeDisplay()} Goals</h1>
        <p className="text-lg text-muted-foreground">
          Create personalized goals based on your assessment results
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Goal Creation Process</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Based on your {assessmentResult.focusArea} focus area, we'll help you create:</p>
          <ul className="space-y-2 ml-4">
            <li>• Short-term achievable milestones</li>
            <li>• Long-term transformation goals</li>
            <li>• Daily action steps</li>
            <li>• Progress tracking methods</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onComplete} className="flex-1">
          Create Goals
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
