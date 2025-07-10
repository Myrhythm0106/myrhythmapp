
import React, { useEffect, useMemo, useState } from "react";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { OnboardingStepRenderer } from "@/components/onboarding/OnboardingStepRenderer";
import { AuthenticationGate } from "@/components/onboarding/AuthenticationGate";
import { useAutoProgression } from "@/hooks/useAutoProgression";
import { useOnboardingLogic } from "@/hooks/useOnboardingLogic";
import { useOnboardingHandlers } from "@/hooks/useOnboardingHandlers";
import { useAuth } from "@/contexts/AuthContext";
import { Preview3Background } from "@/components/ui/Preview3Background";

// Updated steps - streamlined 5-step flow
const UPDATED_STEPS = [
  { id: 1, title: "Tell Us About You", description: "Share your brain health journey type" },
  { id: 2, title: "Location Setup", description: "Where are you based?" },
  { id: 3, title: "Plan Selection", description: "Choose your MyRhythm experience" },
  { id: 4, title: "Pre-Assessment", description: "Preparing your personalized assessment" },
  { id: 5, title: "Rhythm Assessment", description: "Discover your unique cognitive patterns" }
];
const TOTAL_STEPS = UPDATED_STEPS.length;

const Onboarding = () => {
  console.log("=== ONBOARDING PAGE LOADING ===");
  console.log("Onboarding: Component is rendering");
  console.log("Onboarding: Location:", window.location.href);
  console.log("Onboarding: TOTAL_STEPS:", TOTAL_STEPS);
  
  const { user, loading } = useAuth();
  const [authenticationComplete, setAuthenticationComplete] = useState(false);
  
  console.log("Onboarding: Auth state - user:", !!user, "loading:", loading);
  
  // Check authentication status
  useEffect(() => {
    if (user && !loading) {
      console.log("Onboarding: User is authenticated, allowing access to onboarding");
      setAuthenticationComplete(true);
    } else if (!loading && !user) {
      console.log("Onboarding: User is not authenticated, showing authentication gate");
      setAuthenticationComplete(false);
    }
  }, [user, loading]);

  // Add error boundary to catch any issues
  try {
    const onboardingState = useOnboardingLogic(TOTAL_STEPS);
    
    const {
      currentStep,
      userType,
      location,
      personalInfo,
      selectedPlan,
      billingPeriod,
      isUserTypeSelected,
      isPersonalInfoValid,
      isLocationValid,
      isPlanSelected,
      isDirectNavigation,
      setPersonalInfo,
      setIsUserTypeSelected,
      setIsLocationValid,
      setIsPlanSelected,
    } = onboardingState;

    console.log("Onboarding: Current step:", currentStep);
    console.log("Onboarding: Onboarding state loaded successfully");

    const handlers = useOnboardingHandlers({
      ...onboardingState,
      totalSteps: TOTAL_STEPS,
      selectedPlan,
      userType,
      setIsUserTypeSelected,
      setIsLocationValid,
      setIsPlanSelected,
    });

    // Handle authenticated user flow - auto-populate personal info from authenticated user
    useEffect(() => {
      if (user && !loading && !personalInfo && authenticationComplete) {
        console.log("Onboarding: Auto-populating personal info for authenticated user");
        const autoPersonalInfo = {
          name: user.user_metadata?.name || user.email?.split('@')[0] || '',
          email: user.email || '',
          password: ''
        };
        setPersonalInfo(autoPersonalInfo);
      }
    }, [user, loading, personalInfo, setPersonalInfo, authenticationComplete]);

    // Auto-progression for plan selection only
    const { countdown: planCountdown } = useAutoProgression({
      isFormValid: isPlanSelected,
      onProgress: () => handlers.handlePlanSelected(selectedPlan),
      enabled: true,
      delay: 3000
    });

    // Data persistence check
    const hasUnsavedData = React.useMemo(() => {
      if (currentStep === 5) {
        const savedAssessment = localStorage.getItem('form_data_rhythm_assessment');
        return !!savedAssessment;
      }
      return false;
    }, [currentStep]);

    const handleSaveProgress = () => {
      localStorage.setItem('myrhythm_onboarding_current_step', currentStep.toString());
      localStorage.setItem('myrhythm_onboarding_progress_saved', new Date().toISOString());
    };

    // Get current step information
    const getCurrentStepInfo = () => {
      return UPDATED_STEPS.find(step => step.id === currentStep) || UPDATED_STEPS[0];
    };

    const currentStepInfo = getCurrentStepInfo();
    console.log("Onboarding: Current step info:", currentStepInfo);

    // Step validation
    const stepValidation = handlers.getStepValidation();

    // Show loading while auth is being checked
    if (loading) {
      console.log("Onboarding: Showing loading screen");
      return (
        <Preview3Background>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-lg font-medium">Setting up your personalized journey...</p>
              <p className="text-sm text-muted-foreground">Preparing your brain health experience</p>
            </div>
          </div>
        </Preview3Background>
      );
    }

    // Show authentication gate if user is not authenticated
    if (!authenticationComplete) {
      console.log("Onboarding: Showing authentication gate");
      return (
        <Preview3Background>
          <AuthenticationGate 
            onAuthSuccess={() => {
              console.log("Onboarding: Authentication successful, proceeding to onboarding");
              setAuthenticationComplete(true);
            }}
          />
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
          onStepClick={handlers.goToStep}
          title={currentStepInfo.title}
          description={currentStepInfo.description}
          hasUnsavedData={hasUnsavedData}
          onSaveProgress={handleSaveProgress}
          dataDescription={currentStep === 5 ? "your assessment responses" : "your progress"}
          canGoNext={stepValidation.canGoNext}
          canGoPrevious={stepValidation.canGoPrevious}
          onNext={handlers.goToNextStep}
          nextLabel={currentStep === TOTAL_STEPS ? "Complete Assessment" : undefined}
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
      </Preview3Background>
    );
    
  } catch (error) {
    console.error("Onboarding: Critical error in component:", error);
    
    return (
      <Preview3Background>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md mx-auto p-8">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-800">Setup Error</h1>
            <p className="text-red-600">
              We encountered an issue loading your brain health setup.
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 mr-3 transition-colors"
              >
                Refresh Setup
              </button>
              <button 
                onClick={() => window.location.href = '/preview-3'} 
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Home
              </button>
            </div>
            <details className="text-left mt-4">
              <summary className="cursor-pointer text-red-700 font-medium">Technical Details</summary>
              <pre className="text-xs text-red-600 mt-2 p-3 bg-red-50 rounded overflow-auto">
                {error instanceof Error ? error.message : String(error)}
              </pre>
            </details>
          </div>
        </div>
      </Preview3Background>
    );
  }
};

export default Onboarding;
