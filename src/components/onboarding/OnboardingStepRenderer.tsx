
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
  
  console.log("=== ONBOARDING STEP RENDERER RENDERING ===");
  console.log("OnboardingStepRenderer: Component is rendering");
  console.log("OnboardingStepRenderer: Current step:", currentStep);
  console.log("OnboardingStepRenderer: Current user type:", userType);
  console.log("OnboardingStepRenderer: Props received:", {
    currentStep,
    userType,
    personalInfo,
    location,
    selectedPlan,
    billingPeriod
  });
  
  // Add visual debug indicator
  const debugStyle = {
    border: '3px solid blue',
    padding: '15px',
    margin: '10px',
    backgroundColor: '#f0f8ff'
  };
  
  if (currentStep === 1) {
    console.log("OnboardingStepRenderer: RENDERING STEP 1 - UserTypeStep");
    console.log("OnboardingStepRenderer: About to render UserTypeStep component");
    return (
      <div style={debugStyle}>
        <div style={{ color: 'blue', fontWeight: 'bold', marginBottom: '10px' }}>
          DEBUG: OnboardingStepRenderer - Rendering Step 1 (UserTypeStep)
        </div>
        <div style={{ marginBottom: '10px' }}>
          <p>Current Step: {currentStep}</p>
          <p>User Type: {userType || 'null'}</p>
          <p>onUserTypeComplete function: {typeof onUserTypeComplete}</p>
        </div>
        <UserTypeStep
          onComplete={onUserTypeComplete}
          initialValue={userType}
        />
      </div>
    );
  }
  
  if (currentStep === 2) {
    console.log("OnboardingStepRenderer: Rendering LocationStep for step 2");
    return (
      <div style={debugStyle}>
        <div style={{ color: 'blue', fontWeight: 'bold', marginBottom: '10px' }}>
          DEBUG: OnboardingStepRenderer - Rendering Step 2 (LocationStep)
        </div>
        <LocationStep
          onComplete={onLocationComplete}
          initialValues={location}
        />
      </div>
    );
  }
  
  if (currentStep === 3) {
    console.log("OnboardingStepRenderer: Rendering PlanStep for step 3");
    return (
      <div style={debugStyle}>
        <div style={{ color: 'blue', fontWeight: 'bold', marginBottom: '10px' }}>
          DEBUG: OnboardingStepRenderer - Rendering Step 3 (PlanStep)
        </div>
        <PlanStep
          onComplete={onPlanSelected}
          selectedPlan={selectedPlan}
        />
      </div>
    );
  }
  
  if (currentStep === 4) {
    console.log("OnboardingStepRenderer: Rendering PreAssessmentStep for step 4");
    return (
      <div style={debugStyle}>
        <div style={{ color: 'blue', fontWeight: 'bold', marginBottom: '10px' }}>
          DEBUG: OnboardingStepRenderer - Rendering Step 4 (PreAssessmentStep)
        </div>
        <PreAssessmentStep
          onComplete={onPreAssessmentComplete}
        />
      </div>
    );
  }
  
  if (currentStep === 5) {
    console.log("OnboardingStepRenderer: Rendering RhythmAssessmentStep for step 5");
    return (
      <div style={debugStyle}>
        <div style={{ color: 'blue', fontWeight: 'bold', marginBottom: '10px' }}>
          DEBUG: OnboardingStepRenderer - Rendering Step 5 (RhythmAssessmentStep)
        </div>
        <RhythmAssessmentStep
          onComplete={onRhythmAssessmentComplete}
        />
      </div>
    );
  }
  
  console.error("OnboardingStepRenderer: INVALID STEP NUMBER", currentStep);
  return (
    <div style={{ ...debugStyle, borderColor: 'red', backgroundColor: '#ffe0e0' }}>
      <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '10px' }}>
        ERROR: OnboardingStepRenderer - Invalid Step
      </div>
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4">Invalid Step</h2>
        <p>Current step: {currentStep}</p>
        <p>This step number is not handled by the renderer.</p>
        <p>Please contact support if this error persists.</p>
      </div>
    </div>
  );
};
