
import React from "react";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { PaymentConfirmationDialog } from "@/components/onboarding/PaymentConfirmationDialog";
import { OnboardingStepRenderer } from "@/components/onboarding/OnboardingStepRenderer";
import { STEPS } from "@/components/onboarding/OnboardingSteps";
import { useAutoProgression } from "@/hooks/useAutoProgression";
import { useOnboardingLogic } from "@/hooks/useOnboardingLogic";
import { useOnboardingHandlers } from "@/hooks/useOnboardingHandlers";

// Updated steps for new flow (removed payment step from onboarding)
const UPDATED_STEPS = STEPS.filter(step => step.id !== 5); // Remove payment step
const TOTAL_STEPS = UPDATED_STEPS.length; // Now 6 steps

const Onboarding = () => {
  const onboardingState = useOnboardingLogic(TOTAL_STEPS);
  
  const {
    currentStep,
    userType,
    location,
    personalInfo,
    selectedPlan,
    paymentData,
    showPaymentConfirmation,
    isUserTypeSelected,
    isPersonalInfoValid,
    isLocationValid,
    isPlanSelected,
    isDirectNavigation,
  } = onboardingState;

  const handlers = useOnboardingHandlers({
    ...onboardingState,
    totalSteps: TOTAL_STEPS,
    paymentData,
    selectedPlan,
    userType,
  });

  // Auto-progression for steps 1-4 (disabled for direct navigation)
  const { countdown: userTypeCountdown } = useAutoProgression({
    isFormValid: isUserTypeSelected,
    onProgress: () => handlers.handleUserTypeComplete({ type: userType! }),
    enabled: currentStep === 1 && userType !== null && !isDirectNavigation
  });

  const { countdown: personalInfoCountdown } = useAutoProgression({
    isFormValid: isPersonalInfoValid,
    onProgress: () => handlers.handlePersonalInfoComplete(personalInfo!),
    enabled: currentStep === 2 && personalInfo !== null && !isDirectNavigation
  });
  
  const { countdown: locationCountdown } = useAutoProgression({
    isFormValid: isLocationValid,
    onProgress: () => handlers.handleLocationComplete(location!),
    enabled: currentStep === 3 && location !== null && !isDirectNavigation
  });
  
  const { countdown: planCountdown } = useAutoProgression({
    isFormValid: isPlanSelected,
    onProgress: () => handlers.handlePlanSelected(selectedPlan),
    enabled: currentStep === 4 && isPlanSelected && !isDirectNavigation
  });

  // Get current step information (adjust for removed payment step)
  const getCurrentStepInfo = () => {
    if (currentStep <= 4) {
      return UPDATED_STEPS.find(step => step.id === currentStep) || UPDATED_STEPS[0];
    } else {
      // For steps 5 and 6 (pre-assessment and assessment), adjust the step mapping
      const adjustedSteps = [
        { id: 5, title: "Pre-Assessment", description: "Preparing your personalized assessment" },
        { id: 6, title: "Rhythm Assessment", description: "Discover your unique rhythm and patterns" }
      ];
      return adjustedSteps.find(step => step.id === currentStep) || adjustedSteps[0];
    }
  };

  const currentStepInfo = getCurrentStepInfo();

  return (
    <>
      <OnboardingLayout 
        currentStep={currentStep} 
        totalSteps={TOTAL_STEPS}
        onBack={handlers.goToPreviousStep}
        title={currentStepInfo.title}
        description={currentStepInfo.description}
      >
        <OnboardingStepRenderer
          currentStep={currentStep}
          userType={userType}
          personalInfo={personalInfo}
          location={location}
          selectedPlan={selectedPlan}
          userTypeCountdown={userTypeCountdown}
          personalInfoCountdown={personalInfoCountdown}
          locationCountdown={locationCountdown}
          planCountdown={planCountdown}
          onUserTypeComplete={handlers.handleUserTypeComplete}
          onPersonalInfoComplete={handlers.handlePersonalInfoComplete}
          onLocationComplete={handlers.handleLocationComplete}
          onPlanSelected={handlers.handlePlanSelected}
          onPaymentComplete={handlers.handlePaymentComplete}
          onPreAssessmentComplete={handlers.handlePreAssessmentComplete}
          onRhythmAssessmentComplete={handlers.handleRhythmAssessmentComplete}
        />
      </OnboardingLayout>
      
      <PaymentConfirmationDialog
        open={showPaymentConfirmation}
        onConfirm={handlers.handlePaymentConfirm}
        onCancel={() => onboardingState.setShowPaymentConfirmation(false)}
        selectedPlan={selectedPlan}
      />
    </>
  );
};

export default Onboarding;
