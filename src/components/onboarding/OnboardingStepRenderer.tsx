
import React from "react";
import { UserTypeStep } from "./steps/UserTypeStep";
// Removed PersonalInfoStep import since we're skipping it
import { LocationStep } from "./steps/LocationStep";
import { PlanStep } from "./steps/PlanStep";
import { PaymentStep } from "./steps/PaymentStep";
import { PreAssessmentStep } from "./steps/rhythm/PreAssessmentStep";
import { RhythmAssessmentStep } from "./steps/RhythmAssessmentStep";
import { UserType } from "./steps/UserTypeStep";
import { PersonalInfoFormValues } from "./steps/PersonalInfoStep";
import { PlanType } from "./steps/PlanStep";
import { PaymentFormValues } from "./steps/PaymentStep";

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
  onPaymentComplete: (data: PaymentFormValues) => void;
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
  onPaymentComplete,
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
        <PaymentStep
          onComplete={onPaymentComplete}
          selectedPlan={selectedPlan}
          billingPeriod={billingPeriod}
        />
      );
      
    case 5:
      return (
        <PreAssessmentStep
          onComplete={onPreAssessmentComplete}
        />
      );
      
    case 6:
      return (
        <RhythmAssessmentStep
          onComplete={onRhythmAssessmentComplete}
        />
      );
      
    default:
      return <div>Invalid step</div>;
  }
};
