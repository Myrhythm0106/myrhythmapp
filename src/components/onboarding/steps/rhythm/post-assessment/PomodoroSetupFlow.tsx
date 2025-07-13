
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, ArrowRight } from "lucide-react";
import { UserType } from "../../UserTypeStep";
import { AssessmentResult } from "@/utils/rhythmAnalysis";

interface PomodoroSetupFlowProps {
  assessmentResult: AssessmentResult;
  userType?: UserType | null;
  onPomodoroSetup: (settings: any) => void;
}

export function PomodoroSetupFlow({ assessmentResult, userType, onPomodoroSetup }: PomodoroSetupFlowProps) {
  const getRecommendedSettings = () => {
    switch (userType) {
      case 'brain-injury':
        return { workMinutes: 15, shortBreak: 10, longBreak: 20, cycles: 2 };
      case 'caregiver':
        return { workMinutes: 25, shortBreak: 5, longBreak: 15, cycles: 3 };
      case 'cognitive-optimization':
        return { workMinutes: 50, shortBreak: 10, longBreak: 20, cycles: 4 };
      default:
        return { workMinutes: 25, shortBreak: 5, longBreak: 15, cycles: 4 };
    }
  };

  const settings = getRecommendedSettings();

  return (
    <Card className="p-6">
      <CardHeader>
        <div className="flex items-center gap-3 mb-4">
          <Timer className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-2xl">Your Personalized Pomodoro Setup</CardTitle>
        </div>
        <p className="text-muted-foreground">
          Based on your assessment, we've optimized these focus settings for your {userType?.replace('-', ' ')} journey.
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold">Work Sessions</h3>
            <p className="text-2xl font-bold text-blue-600">{settings.workMinutes} min</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold">Short Breaks</h3>
            <p className="text-2xl font-bold text-green-600">{settings.shortBreak} min</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold">Long Breaks</h3>
            <p className="text-2xl font-bold text-purple-600">{settings.longBreak} min</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="font-semibold">Daily Cycles</h3>
            <p className="text-2xl font-bold text-orange-600">{settings.cycles}</p>
          </div>
        </div>

        <Button onClick={() => onPomodoroSetup(settings)} size="lg" className="w-full">
          Set Up My Focus Timer
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
