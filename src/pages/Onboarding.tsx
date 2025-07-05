
import React, { useEffect, useMemo } from "react";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { PaymentConfirmationDialog } from "@/components/onboarding/PaymentConfirmationDialog";
import { OnboardingStepRenderer } from "@/components/onboarding/OnboardingStepRenderer";
import { STEPS } from "@/components/onboarding/OnboardingSteps";
import { useAutoProgression } from "@/hooks/useAutoProgression";
import { useOnboardingLogic } from "@/hooks/useOnboardingLogic";
import { useOnboardingHandlers } from "@/hooks/useOnboardingHandlers";
import { useAuth } from "@/contexts/AuthContext";
import { Preview3Background } from "@/components/ui/Preview3Background";

// Updated steps for professional deployment - now includes payment step
const UPDATED_STEPS = [
  { id: 1, title: "All About You", description: "Tell us about yourself" },
  { id: 2, title: "Personal Info", description: "Create your account" },
  { id: 3, title: "Location", description: "Where are you based?" },
  { id: 4, title: "Choose Plan", description: "Select your subscription" },
  { id: 5, title: "Start Trial", description: "Begin your 7-day free trial" },
  { id: 6, title: "Pre-Assessment", description: "Preparing your assessment" },
  { id: 7, title: "Rhythm Assessment", description: "Discover your unique patterns" }
];
const TOTAL_STEPS = UPDATED_STEPS.length;

const Onboarding = () => {
  console.log("=== ONBOARDING PAGE LOADING (PRODUCTION) ===");
  console.log("Onboarding: Component is rendering");
  console.log("Onboarding: Location:", window.location.href);
  console.log("Onboarding: TOTAL_STEPS:", TOTAL_STEPS);
  
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
  console.log("Onboarding: Onboarding state loaded successfully");

  const handlers = useOnboardingHandlers({
    ...onboardingState,
    totalSteps: TOTAL_STEPS,
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

  // Auto-progression disabled for user type, personal info, and location steps
  const { countdown: userTypeCountdown } = useAutoProgression({
    isFormValid: isUserTypeSelected,
    onProgress: () => handlers.handleUserTypeComplete({ type: userType! }),
    enabled: false
  });

  const { countdown: personalInfoCountdown } = useAutoProgression({
    isFormValid: isPersonalInfoValid,
    onProgress: () => handlers.handlePersonalInfoComplete(personalInfo!),
    enabled: false
  });
  
  const { countdown: locationCountdown } = useAutoProgression({
    isFormValid: isLocationValid,
    onProgress: () => handlers.handleLocationComplete(location!),
    enabled: false
  });
  
  // Enable auto-progression for plan selection with 3-second delay
  const { countdown: planCountdown } = useAutoProgression({
    isFormValid: isPlanSelected,
    onProgress: () => handlers.handlePlanSelected(selectedPlan),
    enabled: true,
    delay: 3000
  });

  // Data persistence check
  const hasUnsavedData = React.useMemo(() => {
    if (currentStep === 7) { // Assessment step
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
    return UPDATED_STEPS.find(step => step.id === currentStep) || UPDATED_STEPS[0];
  };

  const currentStepInfo = getCurrentStepInfo();
  console.log("Onboarding: Current step info:", currentStepInfo);

  // Show loading while auth is being checked
  if (loading) {
    console.log("Onboarding: Showing loading screen");
    return (
      <Preview3Background>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Setting up your personalized journey...</p>
          </div>
        </div>
      </Preview3Background>
    );
  }

  console.log("Onboarding: About to render main onboarding content");
  console.log("=== END ONBOARDING DEBUG ===");

  return (
    <Preview3Background>
      <OnboardingLayout 
        currentStep={currentStep} 
        totalSteps={TOTAL_STEPS}
        onBack={handlers.goToPreviousStep}
        title={currentStepInfo.title}
        description={currentStepInfo.description}
        hasUnsavedData={hasUnsavedData}
        onSaveProgress={handleSaveProgress}
        dataDescription={currentStep === 7 ? "your assessment responses" : "your progress"}
      >
        <OnboardingStepRenderer
          currentStep={currentStep}
          userType={userType}
          personalInfo={personalInfo}
          location={location}
          selectedPlan={selectedPlan}
          userTypeCountdown={null}
          personalInfoCountdown={null}
          locationCountdown={null}
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
    </Preview3Background>
  );
};

export default Onboarding;
