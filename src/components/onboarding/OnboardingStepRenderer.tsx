
import React from "react";
import { UserTypeStep, PersonalInfoStep, LocationStep, PlanStep, PaymentStep, PreAssessmentStep, RhythmAssessmentStep } from "./steps";
import { UserType, PersonalInfoFormValues, PlanType, PaymentFormValues } from "./steps";

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
          countdown={userTypeCountdown}
          selectedType={userType}
        />
      );
      
    case 2:
      return (
        <PersonalInfoStep
          onComplete={onPersonalInfoComplete}
          countdown={personalInfoCountdown}
          initialData={personalInfo}
        />
      );
      
    case 3:
      return (
        <LocationStep
          onComplete={onLocationComplete}
          countdown={locationCountdown}
          initialData={location}
        />
      );
      
    case 4:
      return (
        <PlanStep
          onComplete={onPlanSelected}
          selectedPlan={selectedPlan}
        />
      );
      
    case 5:
      return (
        <PaymentStep
          onComplete={onPaymentComplete}
          selectedPlan={selectedPlan}
          billingPeriod={billingPeriod}
        />
      );
      
    case 6:
      return (
        <PreAssessmentStep
          onComplete={onPreAssessmentComplete}
          selectedPlan={selectedPlan}
        />
      );
      
    case 7:
      return (
        <RhythmAssessmentStep
          onComplete={onRhythmAssessmentComplete}
        />
      );
      
    default:
      return <div>Invalid step</div>;
  }
};
