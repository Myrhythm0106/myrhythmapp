
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
  
  switch (currentStep) {
    case 1:
      return (
        <UserTypeStep
          onComplete={onUserTypeComplete}
          initialValue={userType}
        />
      );
      
    case 2:
      return (
        <LocationStep
          onComplete={onLocationComplete}
          initialValues={location}
        />
      );
      
    case 3:
      return (
        <PlanStep
          onComplete={onPlanSelected}
          selectedPlan={selectedPlan}
        />
      );
      
    case 4:
      return (
        <PreAssessmentStep
          onComplete={onPreAssessmentComplete}
        />
      );
      
    case 5:
      return (
        <RhythmAssessmentStep
          onComplete={onRhythmAssessmentComplete}
        />
      );
      
    default:
      return <div>Invalid step</div>;
  }
};
