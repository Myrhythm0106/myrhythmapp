
import React, { useEffect, useMemo, useState } from "react";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { OnboardingStepRenderer } from "@/components/onboarding/OnboardingStepRenderer";
import { AuthenticationGate } from "@/components/onboarding/AuthenticationGate";
import { useAutoProgression } from "@/hooks/useAutoProgression";
import { useOnboardingLogic } from "@/hooks/useOnboardingLogic";
import { useOnboardingHandlers } from "@/hooks/useOnboardingHandlers";
import { useAuth } from "@/contexts/AuthContext";
import { Preview3Background } from "@/components/ui/Preview3Background";

// Web-specific onboarding steps (preserves original functionality)
const WEB_ONBOARDING_STEPS = [
  { id: 1, title: "All About You", description: "Tell us about yourself" },
  { id: 2, title: "Location", description: "Where are you based?" },
  { id: 3, title: "Choose Plan", description: "Select your subscription" },
  { id: 4, title: "Pre-Assessment", description: "Preparing your assessment" },
  { id: 5, title: "Rhythm Assessment", description: "Discover your unique patterns" }
];
const TOTAL_STEPS = WEB_ONBOARDING_STEPS.length;

const WebOnboarding = () => {
  console.log("=== WEB ONBOARDING PAGE LOADING ===");
  
  const { user, loading } = useAuth();
  const [authenticationComplete, setAuthenticationComplete] = useState(false);
  
  useEffect(() => {
    if (user && !loading) {
      console.log("WebOnboarding: User authenticated");
      setAuthenticationComplete(true);
    } else if (!loading && !user) {
      console.log("WebOnboarding: User not authenticated");
      setAuthenticationComplete(false);
    }
  }, [user, loading]);

  const onboardingState = useOnboardingLogic(TOTAL_STEPS);
  
  const {
    currentStep,
    userType,
    location,
    personalInfo,
    selectedPlan,
    billingPeriod,
    isUserTypeSelected,
    isLocationValid,
    isPlanSelected,
    setPersonalInfo,
  } = onboardingState;

  const handlers = useOnboardingHandlers({
    ...onboardingState,
    totalSteps: TOTAL_STEPS,
    selectedPlan,
    userType,
  });

  // Auto-populate personal info for authenticated users
  useEffect(() => {
    if (user && !loading && !personalInfo && authenticationComplete) {
      const autoPersonalInfo = {
        name: user.user_metadata?.name || user.email?.split('@')[0] || '',
        email: user.email || '',
        password: ''
      };
      setPersonalInfo(autoPersonalInfo);
    }
  }, [user, loading, personalInfo, setPersonalInfo, authenticationComplete]);

  // Auto-progression for plan selection
  const { countdown: planCountdown } = useAutoProgression({
    isFormValid: isPlanSelected,
    onProgress: () => handlers.handlePlanSelected(selectedPlan),
    enabled: true,
    delay: 3000
  });

  const hasUnsavedData = React.useMemo(() => {
    if (currentStep === 5) {
      const savedAssessment = localStorage.getItem('form_data_rhythm_assessment');
      return !!savedAssessment;
    }
    return false;
  }, [currentStep]);

  const handleSaveProgress = () => {
    localStorage.setItem('myrhythm_web_onboarding_current_step', currentStep.toString());
    localStorage.setItem('myrhythm_web_onboarding_progress_saved', new Date().toISOString());
  };

  const getCurrentStepInfo = () => {
    return WEB_ONBOARDING_STEPS.find(step => step.id === currentStep) || WEB_ONBOARDING_STEPS[0];
  };

  const currentStepInfo = getCurrentStepInfo();

  if (loading) {
    return (
      <Preview3Background>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Setting up your business onboarding...</p>
          </div>
        </div>
      </Preview3Background>
    );
  }

  if (!authenticationComplete) {
    return (
      <Preview3Background>
        <AuthenticationGate 
          onAuthSuccess={() => {
            console.log("WebOnboarding: Authentication successful");
            setAuthenticationComplete(true);
          }}
        />
      </Preview3Background>
    );
  }

  return (
    <Preview3Background>
      <div className="min-h-screen">
        {/* Web-specific header */}
        <div className="bg-white border-b px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">MyRhythm Business Onboarding</h1>
              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {TOTAL_STEPS}
              </div>
            </div>
          </div>
        </div>

        <OnboardingLayout 
          currentStep={currentStep} 
          totalSteps={TOTAL_STEPS}
          onBack={handlers.goToPreviousStep}
          onStepClick={handlers.goToStep}
          title={currentStepInfo.title}
          description={currentStepInfo.description}
          hasUnsavedData={hasUnsavedData}
          onSaveProgress={handleSaveProgress}
          dataDescription={currentStep === 5 ? "your assessment responses" : "your progress"}
        >
          <OnboardingStepRenderer
            currentStep={currentStep}
            userType={userType}
            personalInfo={personalInfo}
            location={location}
            selectedPlan={selectedPlan}
            billingPeriod={billingPeriod}
            userTypeCountdown={null}
            personalInfoCountdown={null}
            locationCountdown={null}
            planCountdown={planCountdown}
            onUserTypeComplete={handlers.handleUserTypeComplete}
            onPersonalInfoComplete={handlers.handlePersonalInfoComplete}
            onLocationComplete={handlers.handleLocationComplete}
            onPlanSelected={handlers.handlePlanSelected}
            onPreAssessmentComplete={handlers.handlePreAssessmentComplete}
            onRhythmAssessmentComplete={handlers.handleRhythmAssessmentComplete}
          />
        </OnboardingLayout>
      </div>
    </Preview3Background>
  );
};

export default WebOnboarding;
