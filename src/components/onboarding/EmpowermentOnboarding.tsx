
import React, { useState } from "react";
import { WellnessAssessmentStep } from "./empowerment/WellnessAssessmentStep";
import { GoalSettingStep } from "./empowerment/GoalSettingStep";
import { WelcomeStep } from "./empowerment/WelcomeStep";
import { EmpowermentHeader } from "./empowerment/EmpowermentHeader";

type EmpowermentStep = "feeling" | "goal" | "ready";

export function EmpowermentOnboarding() {
  const [currentStep, setCurrentStep] = useState<EmpowermentStep>("feeling");
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleFeelingSelect = (feeling: string) => {
    setSelectedFeeling(feeling);
    setTimeout(() => {
      setCurrentStep("goal");
    }, 500);
  };

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
    setTimeout(() => {
      setCurrentStep("ready");
    }, 500);
  };

  const handleStart = () => {
    // Store selections
    localStorage.setItem('myrhythm_initial_feeling', selectedFeeling || '');
    localStorage.setItem('myrhythm_primary_goal', selectedGoal || '');
    localStorage.setItem('myrhythm_empowerment_onboarding_completed', 'true');
    
    // Navigate to dashboard
    window.location.href = '/dashboard';
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case "feeling": return 1;
      case "goal": return 2;
      case "ready": return 3;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        <EmpowermentHeader currentStep={getStepNumber()} totalSteps={3} />

        {currentStep === "feeling" && (
          <WellnessAssessmentStep onFeelingSelect={handleFeelingSelect} />
        )}

        {currentStep === "goal" && (
          <GoalSettingStep onGoalSelect={handleGoalSelect} />
        )}

        {currentStep === "ready" && (
          <WelcomeStep onStart={handleStart} />
        )}
      </div>
    </div>
  );
}
