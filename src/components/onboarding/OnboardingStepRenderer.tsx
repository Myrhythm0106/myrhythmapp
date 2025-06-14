
import React from "react";
import { UserTypeStep, UserType } from "./steps/UserTypeStep";
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import { LocationStep } from "./steps/LocationStep";
import { PlanStep } from "./steps/PlanStep";
// Payment step removed from onboarding flow
import { PreAssessmentCompiling } from "./steps/rhythm/PreAssessmentCompiling";
import { RhythmAssessmentStep } from "./steps/RhythmAssessmentStep";
import { PersonalInfoFormValues } from "./steps/PersonalInfoStep";
import { PlanType } from "./steps/PlanStep";
import { PaymentFormValues } from "./steps/PaymentStep";

type LocationFormValues = {
  country: string;
  state: string;
  town: string;
};

interface OnboardingStepRendererProps {
  currentStep: number;
  userType: UserType | null;
  personalInfo: PersonalInfoFormValues | null;
  location: LocationFormValues | null;
  selectedPlan: PlanType;
  userTypeCountdown: number | null;
  personalInfoCountdown: number | null;
  locationCountdown: number | null;
  planCountdown: number | null;
  onUserTypeComplete: (data: { type: UserType }) => void;
  onPersonalInfoComplete: (values: PersonalInfoFormValues) => void;
  onLocationComplete: (values: LocationFormValues) => void;
  onPlanSelected: (plan: PlanType) => void;
  onPaymentComplete: (values: PaymentFormValues) => void;
  onPreAssessmentComplete: () => void;
  onRhythmAssessmentComplete: (responses: any) => void;
}

export const OnboardingStepRenderer: React.FC<OnboardingStepRendererProps> = ({
  currentStep,
  userType,
  personalInfo,
  location,
  selectedPlan,
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
}) => {
  const renderStepContent = () => {
    try {
      switch (currentStep) {
        case 1:
          return (
            <div>
              <UserTypeStep 
                onComplete={onUserTypeComplete} 
                initialValue={userType || undefined} 
              />
              {userTypeCountdown && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Automatically proceeding in {userTypeCountdown} seconds...
                </div>
              )}
            </div>
          );
        case 2:
          return (
            <div>
              <PersonalInfoStep 
                onComplete={onPersonalInfoComplete} 
                initialValues={personalInfo || undefined} 
              />
              {personalInfoCountdown && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Automatically proceeding in {personalInfoCountdown} seconds...
                </div>
              )}
            </div>
          );
        case 3:
          return (
            <div>
              <LocationStep 
                onComplete={onLocationComplete} 
                initialValues={location || undefined} 
              />
              {locationCountdown && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Automatically proceeding in {locationCountdown} seconds...
                </div>
              )}
            </div>
          );
        case 4:
          return (
            <div>
              <PlanStep 
                onComplete={onPlanSelected} 
                selectedPlan={selectedPlan} 
              />
              {planCountdown && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Automatically proceeding in {planCountdown} seconds...
                </div>
              )}
            </div>
          );
        // Payment step (5) removed - now goes directly to pre-assessment
        case 5:
          return <PreAssessmentCompiling onComplete={onPreAssessmentComplete} userType={userType} />;
        case 6:
          return <RhythmAssessmentStep onComplete={onRhythmAssessmentComplete} />;
        default:
          console.error("Invalid step:", currentStep);
          return (
            <div className="text-center p-8">
              <p className="text-red-600">Invalid step. Please refresh and try again.</p>
              <button onClick={() => window.location.href = "/onboarding"} className="mt-4 text-blue-600 underline">
                Start Over
              </button>
            </div>
          );
      }
    } catch (error) {
      console.error("Error rendering step content:", error);
      return (
        <div className="text-center p-8">
          <p className="text-red-600">An error occurred. Please refresh and try again.</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 underline">
            Refresh Page
          </button>
        </div>
      );
    }
  };

  return <>{renderStepContent()}</>;
};
