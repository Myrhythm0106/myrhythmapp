
import React, { useEffect, useMemo } from "react";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { PaymentConfirmationDialog } from "@/components/onboarding/PaymentConfirmationDialog";
import { OnboardingStepRenderer } from "@/components/onboarding/OnboardingStepRenderer";
import { STEPS } from "@/components/onboarding/OnboardingSteps";
import { useAutoProgression } from "@/hooks/useAutoProgression";
import { useOnboardingLogic } from "@/hooks/useOnboardingLogic";
import { useOnboardingHandlers } from "@/hooks/useOnboardingHandlers";
import { useAuth } from "@/contexts/AuthContext";

// Updated steps for professional deployment
const UPDATED_STEPS = STEPS.filter(step => step.id !== 5); // Remove payment step from main flow
const TOTAL_STEPS = UPDATED_STEPS.length;

const Onboarding = () => {
  console.log("Onboarding: Component is rendering");
  
  const { user, loading } = useAuth();
  console.log("Onboarding: Auth state - user:", !!user, "loading:", loading);
  
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
    setCurrentStep,
    setPersonalInfo,
  } = onboardingState;

  console.log("Onboarding: Current step:", currentStep);

  const handlers = useOnboardingHandlers({
    ...onboardingState,
    totalSteps: TOTAL_STEPS,
    paymentData,
    selectedPlan,
    userType,
  });

  // Handle authenticated user flow - skip personal info if already authenticated
  useEffect(() => {
    if (user && !loading && currentStep === 2 && !personalInfo) {
      console.log("Onboarding: Auto-populating personal info for authenticated user");
      // Auto-populate personal info from authenticated user and proceed
      const autoPersonalInfo = {
        name: user.user_metadata?.name || user.email?.split('@')[0] || '',
        email: user.email || '',
        password: ''
      };
      setPersonalInfo(autoPersonalInfo);
      
      // Auto-proceed to location step after a brief moment
      setTimeout(() => {
        setCurrentStep(3);
      }, 1500);
    }
  }, [user, loading, currentStep, personalInfo, setPersonalInfo, setCurrentStep]);

  // Disable auto-progression for professional deployment to give users control
  const autoProgressionEnabled = false;

  // Auto-progression for steps 1-4 (disabled for professional use)
  const { countdown: userTypeCountdown } = useAutoProgression({
    isFormValid: isUserTypeSelected,
    onProgress: () => handlers.handleUserTypeComplete({ type: userType! }),
    enabled: currentStep === 1 && userType !== null && !isDirectNavigation && autoProgressionEnabled
  });

  const { countdown: personalInfoCountdown } = useAutoProgression({
    isFormValid: isPersonalInfoValid,
    onProgress: () => handlers.handlePersonalInfoComplete(personalInfo!),
    enabled: currentStep === 2 && personalInfo !== null && !isDirectNavigation && autoProgressionEnabled && !user
  });
  
  const { countdown: locationCountdown } = useAutoProgression({
    isFormValid: isLocationValid,
    onProgress: () => handlers.handleLocationComplete(location!),
    enabled: currentStep === 3 && location !== null && !isDirectNavigation && autoProgressionEnabled
  });
  
  const { countdown: planCountdown } = useAutoProgression({
    isFormValid: isPlanSelected,
    onProgress: () => handlers.handlePlanSelected(selectedPlan),
    enabled: currentStep === 4 && isPlanSelected && !isDirectNavigation && autoProgressionEnabled
  });

  // Data persistence check
  const hasUnsavedData = React.useMemo(() => {
    if (currentStep === 6) { // Assessment step
      const savedAssessment = localStorage.getItem('form_data_rhythm_assessment');
      return !!savedAssessment;
    }
    return false;
  }, [currentStep]);

  const handleSaveProgress = () => {
    // Save current step progress
    localStorage.setItem('myrhythm_onboarding_current_step', currentStep.toString());
    localStorage.setItem('myrhythm_onboarding_progress_saved', new Date().toISOString());
  };

  // Get current step information
  const getCurrentStepInfo = () => {
    if (currentStep <= 4) {
      return UPDATED_STEPS.find(step => step.id === currentStep) || UPDATED_STEPS[0];
    } else {
      // For steps 5 and 6 (pre-assessment and assessment)
      const adjustedSteps = [
        { id: 5, title: "Pre-Assessment", description: "Preparing your personalized assessment" },
        { id: 6, title: "Rhythm Assessment", description: "Discover your unique rhythm patterns" }
      ];
      return adjustedSteps.find(step => step.id === currentStep) || adjustedSteps[0];
    }
  };

  const currentStepInfo = getCurrentStepInfo();

  // Show loading while auth is being checked
  if (loading) {
    console.log("Onboarding: Showing loading screen");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-muted/60 to-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Setting up your personalized journey...</p>
        </div>
      </div>
    );
  }

  console.log("Onboarding: Rendering main onboarding content");

  return (
    <>
      <OnboardingLayout 
        currentStep={currentStep} 
        totalSteps={TOTAL_STEPS}
        onBack={handlers.goToPreviousStep}
        title={currentStepInfo.title}
        description={currentStepInfo.description}
        hasUnsavedData={hasUnsavedData}
        onSaveProgress={handleSaveProgress}
        dataDescription={currentStep === 6 ? "your assessment responses" : "your progress"}
      >
        <OnboardingStepRenderer
          currentStep={currentStep}
          userType={userType}
          personalInfo={personalInfo}
          location={location}
          selectedPlan={selectedPlan}
          userTypeCountdown={autoProgressionEnabled ? userTypeCountdown : null}
          personalInfoCountdown={autoProgressionEnabled && !user ? personalInfoCountdown : null}
          locationCountdown={autoProgressionEnabled ? locationCountdown : null}
          planCountdown={autoProgressionEnabled ? planCountdown : null}
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
