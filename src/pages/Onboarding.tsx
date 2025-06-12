
import React from "react";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { PaymentConfirmationDialog } from "@/components/onboarding/PaymentConfirmationDialog";
import { OnboardingStepRenderer } from "@/components/onboarding/OnboardingStepRenderer";
import { STEPS } from "@/components/onboarding/OnboardingSteps";
import { useAutoProgression } from "@/hooks/useAutoProgression";
import { useOnboardingLogic } from "@/hooks/useOnboardingLogic";
import { useOnboardingHandlers } from "@/hooks/useOnboardingHandlers";

const Onboarding = () => {
  const onboardingState = useOnboardingLogic(STEPS.length);
  
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
    totalSteps: STEPS.length,
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

  // Get current step information
  const currentStepInfo = STEPS.find(step => step.id === currentStep) || STEPS[0];

  return (
    <>
      <OnboardingLayout 
        currentStep={currentStep} 
        totalSteps={STEPS.length}
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
