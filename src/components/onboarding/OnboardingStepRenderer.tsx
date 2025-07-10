
import React from "react";
import { UserTypeStep } from "./steps/UserTypeStep";
import { LocationStep } from "./steps/LocationStep";
import { PlanStep } from "./steps/PlanStep";
import { PreAssessmentStep } from "./steps/rhythm/PreAssessmentStep";
import { RhythmAssessmentStep } from "./steps/RhythmAssessmentStep";
import { UserType } from "./steps/UserTypeStep";
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
  
  console.log("OnboardingStepRenderer: Rendering step", currentStep);
  console.log("OnboardingStepRenderer: Current user type:", userType);
  
  switch (currentStep) {
    case 1:
      console.log("OnboardingStepRenderer: Rendering UserTypeStep");
      return (
        <div className="w-full">
          <UserTypeStep
            onComplete={onUserTypeComplete}
            initialValue={userType}
          />
        </div>
      );
      
    case 2:
      console.log("OnboardingStepRenderer: Rendering LocationStep");
      return (
        <LocationStep
          onComplete={onLocationComplete}
          initialValues={location}
        />
      );
      
    case 3:
      console.log("OnboardingStepRenderer: Rendering PlanStep");
      return (
        <PlanStep
          onComplete={onPlanSelected}
          selectedPlan={selectedPlan}
        />
      );
      
    case 4:
      console.log("OnboardingStepRenderer: Rendering PreAssessmentStep");
      return (
        <PreAssessmentStep
          onComplete={onPreAssessmentComplete}
        />
      );
      
    case 5:
      console.log("OnboardingStepRenderer: Rendering RhythmAssessmentStep");
      return (
        <RhythmAssessmentStep
          onComplete={onRhythmAssessmentComplete}
        />
      );
      
    default:
      console.error("OnboardingStepRenderer: Invalid step", currentStep);
      return (
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-4">Invalid Step</h2>
          <p>Current step: {currentStep}</p>
          <p>Please contact support if this error persists.</p>
        </div>
      );
  }
};
