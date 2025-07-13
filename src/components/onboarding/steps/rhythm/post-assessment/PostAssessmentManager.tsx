
import React, { useState } from "react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { UserType } from "../../UserTypeStep";
import { FullAssessmentResults } from "../FullAssessmentResults";
import { PersonalizedBreakSuggestions } from "../PersonalizedBreakSuggestions";
import { CalendarIntegrationFlow } from "./CalendarIntegrationFlow";
import { PomodoroSetupFlow } from "./PomodoroSetupFlow";
import { CompletionSummary } from "./CompletionSummary";

interface PostAssessmentManagerProps {
  assessmentResult: AssessmentResult;
  userType?: UserType | null;
  hasPaidPremium?: boolean;
  onComplete: () => void;
}

type FlowStep = "results" | "break-suggestions" | "calendar-integration" | "pomodoro-setup" | "complete";

export function PostAssessmentManager({ 
  assessmentResult, 
  userType, 
  hasPaidPremium = false, 
  onComplete 
}: PostAssessmentManagerProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>("results");
  const [selectedBreaks, setSelectedBreaks] = useState<string[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [pomodoroSettings, setPomodoroSettings] = useState<any>(null);

  const handleNextStep = () => {
    const stepOrder: FlowStep[] = ["results", "break-suggestions", "calendar-integration", "pomodoro-setup", "complete"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleStepComplete = (step: FlowStep, data?: any) => {
    switch (step) {
      case "break-suggestions":
        setSelectedBreaks(data);
        break;
      case "calendar-integration":
        setCalendarEvents(data);
        break;
      case "pomodoro-setup":
        setPomodoroSettings(data);
        break;
    }
    handleNextStep();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "results":
        return (
          <FullAssessmentResults 
            assessmentResult={assessmentResult}
            userType={userType}
            onContinue={() => handleStepComplete("results")}
          />
        );
      
      case "break-suggestions":
        return (
          <PersonalizedBreakSuggestions
            assessmentResult={assessmentResult}
            userType={userType}
            onBreaksSelected={(breaks) => handleStepComplete("break-suggestions", breaks)}
          />
        );
      
      case "calendar-integration":
        return (
          <CalendarIntegrationFlow
            assessmentResult={assessmentResult}
            userType={userType}
            selectedBreaks={selectedBreaks}
            onCalendarSetup={(events) => handleStepComplete("calendar-integration", events)}
          />
        );
      
      case "pomodoro-setup":
        return (
          <PomodoroSetupFlow
            assessmentResult={assessmentResult}
            userType={userType}
            onPomodoroSetup={(settings) => handleStepComplete("pomodoro-setup", settings)}
          />
        );
      
      case "complete":
        return (
          <CompletionSummary
            assessmentResult={assessmentResult}
            selectedBreaks={selectedBreaks}
            calendarEvents={calendarEvents}
            pomodoroSettings={pomodoroSettings}
            onComplete={onComplete}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {renderCurrentStep()}
    </div>
  );
}
