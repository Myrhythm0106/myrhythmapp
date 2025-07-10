
import React, { useState, useEffect } from "react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { FlowStepRenderer } from "./flow/FlowStepRenderer";
import { FlowNavigation } from "./flow/FlowNavigation";
import { useFlowHandlers } from "./flow/FlowHandlers";
import { useEncouragement } from "../../../encouragement/EncouragementEngine";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Crown, Star, Zap, ArrowRight, CheckCircle, Calendar, Users } from "lucide-react";
import { UserType } from "../UserTypeStep";
import { SmartPricingDisplay } from "./SmartPricingDisplay";
import { FullAssessmentResults } from "./FullAssessmentResults";
import { PersonalizedBreakSuggestions } from "./PersonalizedBreakSuggestions";
import { AutoCalendarPopulation } from "./AutoCalendarPopulation";

interface PostAssessmentFlowProps {
  assessmentResult: AssessmentResult;
  onComplete: () => void;
  userType?: UserType | null;
  hasPaidPremium?: boolean;
}

type FlowStep = "results" | "break-suggestions" | "calendar-integration" | "pomodoro-setup" | "complete";

export function PostAssessmentFlow({ assessmentResult, onComplete, userType, hasPaidPremium = false }: PostAssessmentFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>("results");
  const [selectedBreaks, setSelectedBreaks] = useState<string[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [pomodoroSettings, setPomodoroSettings] = useState<any>(null);
  
  const { triggerEncouragement, EncouragementComponent } = useEncouragement();

  const handleNextStep = () => {
    if (currentStep === "results") {
      setCurrentStep("break-suggestions");
    } else if (currentStep === "break-suggestions") {
      setCurrentStep("calendar-integration");
    } else if (currentStep === "calendar-integration") {
      setCurrentStep("pomodoro-setup");
    } else if (currentStep === "pomodoro-setup") {
      setCurrentStep("complete");
    }
  };

  const handleComplete = () => {
    console.log("PostAssessmentFlow: Complete with:", {
      selectedBreaks,
      calendarEvents,
      pomodoroSettings
    });
    onComplete();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "results":
        return (
          <FullAssessmentResults 
            assessmentResult={assessmentResult}
            userType={userType}
            onContinue={handleNextStep}
          />
        );
      
      case "break-suggestions":
        return (
          <PersonalizedBreakSuggestions
            assessmentResult={assessmentResult}
            userType={userType}
            onBreaksSelected={(breaks) => {
              setSelectedBreaks(breaks);
              handleNextStep();
            }}
          />
        );
      
      case "calendar-integration":
        return (
          <AutoCalendarPopulation
            assessmentResult={assessmentResult}
            userType={userType}
            selectedBreaks={selectedBreaks}
            onCalendarSetup={(events) => {
              setCalendarEvents(events);
              handleNextStep();
            }}
          />
        );
      
      case "pomodoro-setup":
        return (
          <PomodoroSetup
            assessmentResult={assessmentResult}
            userType={userType}
            onPomodoroSetup={(settings) => {
              setPomodoroSettings(settings);
              handleNextStep();
            }}
          />
        );
      
      case "complete":
        return (
          <CompletionSummary
            assessmentResult={assessmentResult}
            selectedBreaks={selectedBreaks}
            calendarEvents={calendarEvents}
            pomodoroSettings={pomodoroSettings}
            onComplete={handleComplete}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[
          { key: "results", label: "Results", icon: Star },
          { key: "break-suggestions", label: "Breaks", icon: Timer },
          { key: "calendar-integration", label: "Calendar", icon: Calendar },
          { key: "pomodoro-setup", label: "Focus", icon: Zap },
          { key: "complete", label: "Complete", icon: CheckCircle }
        ].map((step, index) => {
          const isActive = currentStep === step.key;
          const isCompleted = Object.keys({
            "results": 0,
            "break-suggestions": 1,
            "calendar-integration": 2,
            "pomodoro-setup": 3,
            "complete": 4
          }).indexOf(currentStep) > index;
          
          return (
            <div key={step.key} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isCompleted ? 'bg-green-500 text-white' :
                isActive ? 'bg-blue-500 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                <step.icon className="h-5 w-5" />
              </div>
              <span className={`ml-2 text-sm ${isActive ? 'font-semibold' : ''}`}>
                {step.label}
              </span>
              {index < 4 && <ArrowRight className="h-4 w-4 mx-3 text-gray-400" />}
            </div>
          );
        })}
      </div>
      
      {/* Encouragement Component */}
      {EncouragementComponent}
      
      {/* Step Content */}
      <div className="min-h-[400px]">
        {renderStepContent()}
      </div>
    </div>
  );
}

// Helper Components
function PomodoroSetup({ assessmentResult, userType, onPomodoroSetup }: any) {
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
      <h2 className="text-2xl font-semibold mb-4">Your Personalized Pomodoro Setup</h2>
      <p className="text-muted-foreground mb-6">
        Based on your assessment, we've optimized these focus settings for your {userType?.replace('-', ' ')} journey.
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold">Work Sessions</h3>
          <p className="text-2xl font-bold text-blue-600">{settings.workMinutes} min</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold">Short Breaks</h3>
          <p className="text-2xl font-bold text-green-600">{settings.shortBreak} min</p>
        </div>
      </div>

      <Button onClick={() => onPomodoroSetup(settings)} size="lg" className="w-full">
        Set Up My Focus Timer
      </Button>
    </Card>
  );
}

function CompletionSummary({ assessmentResult, selectedBreaks, calendarEvents, pomodoroSettings, onComplete }: any) {
  return (
    <Card className="p-6 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-semibold mb-4">🎉 Your Personalized Life System is Ready!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold">Break Suggestions</h3>
          <p className="text-sm text-muted-foreground">{selectedBreaks.length} personalized breaks</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold">Calendar Events</h3>
          <p className="text-sm text-muted-foreground">{calendarEvents.length} activities scheduled</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold">Focus Timer</h3>
          <p className="text-sm text-muted-foreground">Optimized for your needs</p>
        </div>
      </div>

      <Button onClick={onComplete} size="lg" className="bg-green-600 hover:bg-green-700">
        Start My Journey
      </Button>
    </Card>
  );
}
