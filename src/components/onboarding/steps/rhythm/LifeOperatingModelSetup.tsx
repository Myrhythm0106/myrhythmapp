
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, ArrowRight } from "lucide-react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { UserType } from "../UserTypeStep";

interface LifeOperatingModelSetupProps {
  assessmentResult: AssessmentResult;
  onComplete: () => void;
  onBack: () => void;
  userType?: UserType | null;
}

export function LifeOperatingModelSetup({ assessmentResult, onComplete, onBack, userType }: LifeOperatingModelSetupProps) {
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
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
          <Settings className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Life Operating Model Setup</h1>
        <p className="text-lg text-muted-foreground">
          Configure your personalized {getUserTypeDisplay().toLowerCase()} system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Setup Your Operating Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>We'll help you establish:</p>
          <ul className="space-y-2 ml-4">
            <li>• Daily routine optimization</li>
            <li>• Priority management system</li>
            <li>• Progress tracking dashboard</li>
            <li>• Personalized reminders and alerts</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onComplete} className="flex-1">
          Setup Model
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
