
import React from "react";
import { UserTypeStep } from "./steps/UserTypeStep";
import { LocationStep } from "./steps/LocationStep";
import { PlanStep } from "./steps/PlanStep";
import { PreAssessmentStep } from "./steps/rhythm/PreAssessmentStep";
import { AssessmentTypeSelection } from "./steps/rhythm/AssessmentTypeSelection";
import { BriefAssessmentView } from "./steps/rhythm/BriefAssessmentView";
import { RhythmAssessmentView } from "./steps/rhythm/RhythmAssessmentView";
import { BackButton } from "@/components/ui/BackButton";
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
  assessmentType?: 'brief' | 'comprehensive' | null;
  userTypeCountdown: number | null;
  personalInfoCountdown: number | null;
  locationCountdown: number | null;
  planCountdown: number | null;
  onUserTypeComplete: (data: { type: UserType }) => void;
  onPersonalInfoComplete: (data: PersonalInfoFormValues) => void;
  onLocationComplete: (data: any) => void;
  onPlanSelected: (plan: PlanType, billingPeriod?: 'monthly' | 'annual') => void;
  onPreAssessmentComplete: () => void;
  onAssessmentTypeSelected: (type: 'brief' | 'comprehensive') => void;
  onRhythmAssessmentComplete: (data: any) => void;
  onGoBack?: () => void;
}

export const OnboardingStepRenderer = ({
  currentStep,
  userType,
  personalInfo,
  location,
  selectedPlan,
  billingPeriod = 'monthly',
  assessmentType,
  userTypeCountdown,
  personalInfoCountdown,
  locationCountdown,
  planCountdown,
  onUserTypeComplete,
  onPersonalInfoComplete,
  onLocationComplete,
  onPlanSelected,
  onPreAssessmentComplete,
  onAssessmentTypeSelected,
  onRhythmAssessmentComplete,
  onGoBack,
}: OnboardingStepRendererProps) => {
  
  console.log("OnboardingStepRenderer: Rendering step", currentStep, "with userType:", userType);
  
  const renderStepWithBackButton = (stepComponent: React.ReactNode) => (
    <div className="space-y-4">
      {currentStep > 1 && onGoBack && (
        <div className="mb-4">
          <BackButton 
            onClick={onGoBack}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          />
        </div>
      )}
      {stepComponent}
    </div>
  );
  
  if (currentStep === 1) {
    console.log("OnboardingStepRenderer: Rendering UserTypeStep");
    return renderStepWithBackButton(
      <UserTypeStep
        onComplete={onUserTypeComplete}
        initialValue={userType}
      />
    );
  }
  
  if (currentStep === 2) {
    console.log("OnboardingStepRenderer: Rendering LocationStep");
    return renderStepWithBackButton(
      <LocationStep
        onComplete={onLocationComplete}
        initialValues={location}
      />
    );
  }
  
  if (currentStep === 3) {
    console.log("OnboardingStepRenderer: Rendering PreAssessmentStep");
    return renderStepWithBackButton(
      <PreAssessmentStep
        onComplete={onPreAssessmentComplete}
        userType={userType}
      />
    );
  }
  
  if (currentStep === 4) {
    console.log("OnboardingStepRenderer: Rendering Assessment Type Selection");
    return renderStepWithBackButton(
      <AssessmentTypeSelection
        onSelectType={onAssessmentTypeSelected}
      />
    );
  }
  
  if (currentStep === 5) {
    console.log("OnboardingStepRenderer: Rendering Assessment with type:", assessmentType, "userType:", userType);
    if (assessmentType === 'brief') {
      return renderStepWithBackButton(
        <BriefAssessmentView
          userType={userType || 'brain-injury'}
          onComplete={onRhythmAssessmentComplete}
        />
      );
    } else if (assessmentType === 'comprehensive') {
      return renderStepWithBackButton(
        <RhythmAssessmentView
          userType={userType || 'brain-injury'}
          onComplete={onRhythmAssessmentComplete}
        />
      );
    }
    // Fallback if no assessment type selected
    return renderStepWithBackButton(
      <AssessmentTypeSelection
        onSelectType={onAssessmentTypeSelected}
      />
    );
  }
  
  if (currentStep === 6) {
    console.log("OnboardingStepRenderer: Rendering PlanStep");
    return renderStepWithBackButton(
      <PlanStep
        onComplete={onPlanSelected}
        selectedPlan={selectedPlan}
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
