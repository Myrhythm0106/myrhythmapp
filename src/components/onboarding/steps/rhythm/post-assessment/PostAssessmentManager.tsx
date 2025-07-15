import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserType } from "@/types/user";
import { CalendarIntegrationFlow } from "./CalendarIntegrationFlow";
import { PomodoroSetupFlow } from "./PomodoroSetupFlow";
import { SupportCircleIntegrationFlow } from "./SupportCircleIntegrationFlow";

interface PostAssessmentManagerProps {
  userType: UserType;
  assessmentResult: any;
  onComplete: () => void;
}

export function PostAssessmentManager({ userType, assessmentResult, onComplete }: PostAssessmentManagerProps) {
  const [activeStep, setActiveStep] = useState<'calendar' | 'pomodoro' | 'support'>('calendar');

  const handleStepComplete = () => {
    switch (activeStep) {
      case 'calendar':
        setActiveStep('pomodoro');
        break;
      case 'pomodoro':
        setActiveStep('support');
        break;
      case 'support':
        onComplete();
        break;
    }
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        {activeStep === 'calendar' && (
          <CalendarIntegrationFlow
            userType={userType}
            assessmentResult={assessmentResult}
            onComplete={handleStepComplete}
          />
        )}

        {activeStep === 'pomodoro' && (
          <PomodoroSetupFlow
            userType={userType}
            assessmentResult={assessmentResult}
            onComplete={handleStepComplete}
          />
        )}

        {activeStep === 'support' && (
          <SupportCircleIntegrationFlow
            userType={userType}
            assessmentResult={assessmentResult}
            onComplete={handleStepComplete}
          />
        )}
      </CardContent>
    </Card>
  );
}
