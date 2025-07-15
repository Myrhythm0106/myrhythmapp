
import React from "react";
import { UserTypeStep } from "./steps/UserTypeStep";
import { LocationStep } from "./steps/LocationStep";
import { PlanStep } from "./steps/PlanStep";
import { PreAssessmentStep } from "./steps/rhythm/PreAssessmentStep";
import { RhythmAssessmentStep } from "./steps/RhythmAssessmentStep";
import { UserType } from "@/types/user";
import { PersonalInfoFormValues } from "./steps/PersonalInfoStep";
import { PlanType } from "./steps/PlanStep";

interface OnboardingStepRendererProps {
  currentStep: number;
  userType: UserType | null;
  personalInfo: PersonalInfoFormValues | null;
  location: any;
  selectedPlan: PlanType;
  billingPeriod?: 'monthly' | 'annual';
  userTypeCountdown: number | null;
  personalInfoCountdown: number | null;
  locationCountdown: number | null;
  planCountdown: number | null;
  onUserTypeComplete: (data: { type: UserType }) => void;
  onPersonalInfoComplete: (data: PersonalInfoFormValues) => void;
  onLocationComplete: (data: any) => void;
  onPlanSelected: (plan: PlanType, billingPeriod?: 'monthly' | 'annual') => void;
  onPreAssessmentComplete: () => void;
  onRhythmAssessmentComplete: () => void;
}

export const OnboardingStepRenderer = ({
  currentStep,
  userType,
  personalInfo,
  location,
  selectedPlan,
  billingPeriod = 'monthly',
  userTypeCountdown,
  personalInfoCountdown,
  locationCountdown,
  planCountdown,
  onUserTypeComplete,
  onPersonalInfoComplete,
  onLocationComplete,
  onPlanSelected,
  onPreAssessmentComplete,
  onRhythmAssessmentComplete,
}: OnboardingStepRendererProps) => {
  
  console.log("OnboardingStepRenderer: Rendering step", currentStep, "with userType:", userType);
  
  if (currentStep === 1) {
    console.log("OnboardingStepRenderer: Rendering UserTypeStep");
    return (
      <UserTypeStep
        onComplete={onUserTypeComplete}
        initialValue={userType}
      />
    );
  }
  
  if (currentStep === 2) {
    console.log("OnboardingStepRenderer: Rendering LocationStep");
    return (
      <LocationStep
        onComplete={onLocationComplete}
        initialValues={location}
      />
    );
  }
  
  if (currentStep === 3) {
    console.log("OnboardingStepRenderer: Rendering PlanStep");
    return (
      <PlanStep
        onComplete={onPlanSelected}
        selectedPlan={selectedPlan}
      />
    );
  }
  
  if (currentStep === 4) {
    console.log("OnboardingStepRenderer: Rendering PreAssessmentStep");
    return (
      <PreAssessmentStep
        onComplete={onPreAssessmentComplete}
        userType={userType}
      />
    );
  }
  
  if (currentStep === 5) {
    console.log("OnboardingStepRenderer: Rendering RhythmAssessmentStep with userType:", userType);
    return (
      <RhythmAssessmentStep
        onComplete={onRhythmAssessmentComplete}
      />
    );
  }
  
  console.error("OnboardingStepRenderer: Invalid step", currentStep);
  return (
    <div className="text-center p-8 bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60 rounded-lg border border-purple-200/30 border-l border-emerald-300/20">
      <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">Invalid Step</h2>
      <p>Current step: {currentStep}</p>
      <p>This step number is not handled by the renderer.</p>
    </div>
  );
};
