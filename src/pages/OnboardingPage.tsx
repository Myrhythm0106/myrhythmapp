
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthenticationGate } from "@/components/onboarding/AuthenticationGate";
import { OnboardingStepRenderer } from "@/components/onboarding/OnboardingStepRenderer";
import { SwipeableOnboarding } from "@/components/onboarding/SwipeableOnboarding";
import { useOnboardingLogic } from "@/hooks/useOnboardingLogic";
import { UserType } from "@/types/user";
import { PlanType } from "@/components/onboarding/steps/PlanStep";

export function OnboardingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const {
    currentStep,
    userType,
    personalInfo,
    location,
    selectedPlan,
    assessmentType,
    onboardingState,
    nextStep,
    prevStep,
    setUserType,
    setAssessmentType,
    setAssessmentResult,
    completeOnboarding,
  } = useOnboardingLogic(7);

  useEffect(() => {
    if (user && !loading) {
      setIsAuthenticated(true);
    }
  }, [user, loading]);

  const handleAuthSuccess = () => {
    console.log("OnboardingPage: Authentication successful");
    setIsAuthenticated(true);
  };

  const handleUserTypeComplete = (data: { type: UserType }) => {
    console.log("OnboardingPage: User type selected:", data.type);
    setUserType(data.type);
  };

  const handlePersonalInfoComplete = (data: any) => {
    console.log("OnboardingPage: Personal info completed");
    nextStep();
  };

  const handleLocationComplete = (data: any) => {
    console.log("OnboardingPage: Location completed");
    nextStep();
  };

  const handlePlanSelected = (plan: PlanType, billingPeriod?: 'monthly' | 'annual') => {
    console.log("OnboardingPage: Plan selected:", plan);
    nextStep();
  };

  const handlePreAssessmentComplete = () => {
    console.log("OnboardingPage: Pre-assessment completed - going to comprehensive assessment");
    setAssessmentType('comprehensive');
    nextStep(); // Skip assessment type selection, go directly to comprehensive assessment
  };

  const handleSkipPayment = () => {
    console.log("OnboardingPage: Payment skipped - going directly to brief assessment");
    setAssessmentType('brief');
    // Skip steps 5 (assessment type selection) and go directly to step 6 (assessment)
    nextStep(); // step 5
    nextStep(); // step 6 (assessment)
  };

  const handleAssessmentTypeSelected = (type: 'brief' | 'comprehensive') => {
    console.log("OnboardingPage: Assessment type selected:", type);
    setAssessmentType(type);
    nextStep();
  };

  const handleRhythmAssessmentComplete = (data: any) => {
    console.log("OnboardingPage: Rhythm assessment completed");
    setAssessmentResult(data);
    nextStep(); // Go to payment gate instead of completing onboarding
  };

  const handlePaymentGateComplete = () => {
    console.log("OnboardingPage: Payment gate completed");
    completeOnboarding('brain-health');
  };

  const handleNext = () => {
    if (currentStep < 7) {
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      prevStep();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthenticationGate onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60">
      <SwipeableOnboarding
        currentStep={currentStep}
        totalSteps={7}
        onNext={handleNext}
        onPrevious={handlePrevious}
        canGoNext={currentStep < 7}
        canGoPrevious={currentStep > 1}
        title="Welcome to MyRhythm"
      >
        <OnboardingStepRenderer
          currentStep={currentStep}
          userType={userType}
          personalInfo={personalInfo}
          location={location}
          selectedPlan={selectedPlan}
          assessmentType={assessmentType}
          assessmentResult={onboardingState.assessmentResult}
          userTypeCountdown={null}
          personalInfoCountdown={null}
          locationCountdown={null}
          planCountdown={null}
          onUserTypeComplete={handleUserTypeComplete}
          onPersonalInfoComplete={handlePersonalInfoComplete}
          onLocationComplete={handleLocationComplete}
          onPlanSelected={handlePlanSelected}
          onPreAssessmentComplete={handlePreAssessmentComplete}
          onSkipPayment={handleSkipPayment}
          onAssessmentTypeSelected={handleAssessmentTypeSelected}
          onRhythmAssessmentComplete={handleRhythmAssessmentComplete}
          onGoBack={handlePrevious}
          onComplete={handlePaymentGateComplete}
        />
      </SwipeableOnboarding>
    </div>
  );
}
