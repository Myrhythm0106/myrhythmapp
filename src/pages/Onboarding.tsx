
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { PersonalInfoStep, PersonalInfoFormValues } from "@/components/onboarding/steps/PersonalInfoStep";
import { PlanStep, PlanType } from "@/components/onboarding/steps/PlanStep";
import { PaymentStep, PaymentFormValues } from "@/components/onboarding/steps/PaymentStep";
import { LocationStep } from "@/components/onboarding/steps/LocationStep";
import { RhythmAssessmentStep } from "@/components/onboarding/steps/RhythmAssessmentStep";
import { PaymentConfirmationDialog } from "@/components/onboarding/PaymentConfirmationDialog";
import { useAutoProgression } from "@/hooks/useAutoProgression";

// Onboarding step definitions with new step 5
const STEPS = [
  {
    id: 1,
    title: "Complete your profile",
    description: "Just a few more details to personalize your experience"
  },
  {
    id: 2,
    title: "Where are you located?",
    description: "Tell us where you're from so we can personalize your experience"
  },
  {
    id: 3,
    title: "Select your plan",
    description: "Choose a plan that works for you"
  },
  {
    id: 4,
    title: "Complete your payment",
    description: "Secure payment information"
  },
  {
    id: 5,
    title: "Find Your Rhythm",
    description: "Help us understand your journey to personalize your experience"
  }
];

type LocationFormValues = {
  country: string;
  state: string;
  town: string;
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize currentStep from URL parameter or default to 1
  const [currentStep, setCurrentStep] = useState(() => {
    const stepParam = searchParams.get('step');
    const stepFromUrl = stepParam ? parseInt(stepParam, 10) : 1;
    return stepFromUrl >= 1 && stepFromUrl <= STEPS.length ? stepFromUrl : 1;
  });
  
  // Core state
  const [location, setLocation] = useState<LocationFormValues | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoFormValues | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("basic");
  const [paymentData, setPaymentData] = useState<PaymentFormValues | null>(null);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  
  // Form validation states for auto-progression
  const [isPersonalInfoValid, setIsPersonalInfoValid] = useState(false);
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [isPlanSelected, setIsPlanSelected] = useState(false);
  
  // Track if user came from direct navigation to disable auto-progression
  const [isDirectNavigation, setIsDirectNavigation] = useState(() => {
    const stepParam = searchParams.get('step');
    return stepParam !== null && parseInt(stepParam, 10) > 1;
  });
  
  // Auto-progression for steps 1-3 (disabled for direct navigation)
  const { countdown: personalInfoCountdown } = useAutoProgression({
    isFormValid: isPersonalInfoValid,
    onProgress: () => handlePersonalInfoComplete(personalInfo!),
    enabled: currentStep === 1 && personalInfo !== null && !isDirectNavigation
  });
  
  const { countdown: locationCountdown } = useAutoProgression({
    isFormValid: isLocationValid,
    onProgress: () => handleLocationComplete(location!),
    enabled: currentStep === 2 && location !== null && !isDirectNavigation
  });
  
  const { countdown: planCountdown } = useAutoProgression({
    isFormValid: isPlanSelected,
    onProgress: () => handlePlanSelected(selectedPlan),
    enabled: currentStep === 3 && isPlanSelected && !isDirectNavigation
  });

  // Sync URL with current step
  useEffect(() => {
    const stepParam = searchParams.get('step');
    const stepFromUrl = stepParam ? parseInt(stepParam, 10) : null;
    
    if (stepFromUrl !== currentStep) {
      setSearchParams({ step: currentStep.toString() });
    }
  }, [currentStep, searchParams, setSearchParams]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const stepParam = new URLSearchParams(window.location.search).get('step');
      const stepFromUrl = stepParam ? parseInt(stepParam, 10) : 1;
      
      if (stepFromUrl >= 1 && stepFromUrl <= STEPS.length) {
        setCurrentStep(stepFromUrl);
        setIsDirectNavigation(true); // Disable auto-progression for manual navigation
      } else {
        navigate("/");
      }
    };
    
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);
  
  // Step navigation functions
  const goToNextStep = () => {
    const nextStep = Math.min(currentStep + 1, STEPS.length);
    setCurrentStep(nextStep);
    setIsDirectNavigation(false); // Re-enable auto-progression for forward navigation
  };
  
  const goToPreviousStep = () => {
    if (currentStep === 1) {
      navigate("/");
    } else {
      const prevStep = Math.max(currentStep - 1, 1);
      setCurrentStep(prevStep);
      setIsDirectNavigation(true); // Disable auto-progression for back navigation
    }
  };
  
  // Function to add 6-month reminder to calendar
  const addSixMonthReminder = () => {
    try {
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      
      const reminderEvent = {
        id: `rhythm-assessment-${Date.now()}`,
        title: "MyRhythm 6-Month Check-In",
        description: "Time for your rhythm assessment review! We'll check in to see how your rhythm has evolved and update your experience accordingly.",
        date: sixMonthsFromNow.toISOString().split('T')[0],
        time: "10:00",
        type: "reminder",
        category: "wellness",
        requiresAcceptance: true,
        isSystemGenerated: true
      };
      
      // Store the reminder in localStorage for the calendar
      const existingEvents = JSON.parse(localStorage.getItem("myrhythm_calendar_events") || "[]");
      existingEvents.push(reminderEvent);
      localStorage.setItem("myrhythm_calendar_events", JSON.stringify(existingEvents));
      
      // Store the specific 6-month reminder date for tracking
      localStorage.setItem("myrhythm_next_assessment_date", sixMonthsFromNow.toISOString());
    } catch (error) {
      console.error("Error adding 6-month reminder:", error);
    }
  };
  
  // Step handlers
  const handlePersonalInfoComplete = (values: PersonalInfoFormValues) => {
    try {
      // Store user information
      localStorage.setItem("myrhythm_name", values.name);
      localStorage.setItem("myrhythm_email", values.email);
      localStorage.setItem("myrhythm_password", values.password);
      setPersonalInfo(values);
      setIsPersonalInfoValid(true);
      goToNextStep();
    } catch (error) {
      console.error("Error completing personal info step:", error);
      toast({
        title: "Error",
        description: "Failed to save personal information. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleLocationComplete = (values: LocationFormValues) => {
    try {
      // Store location information
      setLocation(values);
      setIsLocationValid(true);
      goToNextStep();
    } catch (error) {
      console.error("Error completing location step:", error);
      toast({
        title: "Error",
        description: "Failed to save location information. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handlePlanSelected = (plan: PlanType) => {
    try {
      setSelectedPlan(plan);
      setIsPlanSelected(true);
      goToNextStep();
    } catch (error) {
      console.error("Error selecting plan:", error);
      toast({
        title: "Error",
        description: "Failed to select plan. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handlePaymentComplete = (values: PaymentFormValues) => {
    try {
      setPaymentData(values);
      setShowPaymentConfirmation(true);
    } catch (error) {
      console.error("Error completing payment step:", error);
      toast({
        title: "Error",
        description: "Failed to process payment information. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handlePaymentConfirm = () => {
    try {
      // In a real app, process payment here
      console.log("Payment info:", paymentData);
      setShowPaymentConfirmation(false);
      goToNextStep();
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast({
        title: "Error",
        description: "Failed to confirm payment. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleRhythmAssessmentComplete = (responses: any) => {
    try {
      console.log("Rhythm assessment responses:", responses);
      
      // Store rhythm assessment with timestamp for comparison tracking
      const assessmentData = {
        responses,
        completedAt: new Date().toISOString(),
        assessmentVersion: "1.0"
      };
      
      // Store location data
      if (location) {
        localStorage.setItem("myrhythm_country", location.country);
        localStorage.setItem("myrhythm_state", location.state);
        localStorage.setItem("myrhythm_town", location.town);
      }
      
      // Store rhythm assessment responses with metadata
      localStorage.setItem("myrhythm_rhythm_assessment", JSON.stringify(assessmentData));
      
      // Initialize assessment history for 6-month comparisons
      const assessmentHistory = [assessmentData];
      localStorage.setItem("myrhythm_assessment_history", JSON.stringify(assessmentHistory));
      
      // Add 6-month reminder to calendar
      addSixMonthReminder();
      
      // Set login and registration status
      localStorage.setItem('myrhythm_logged_in', 'true');
      sessionStorage.setItem('justRegistered', 'true');
      
      // Show success toast
      toast({
        title: "Your rhythm has been found!",
        description: "Welcome to MyRhythm. Your personalized experience is ready. A 6-month check-in has been added to your calendar.",
        variant: "default",
      });
      
      // Navigate to welcome page
      navigate("/welcome");
    } catch (error) {
      console.error("Error completing rhythm assessment:", error);
      toast({
        title: "Error",
        description: "Failed to complete rhythm assessment. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Render current step content with error boundary
  const renderStepContent = () => {
    try {
      switch (currentStep) {
        case 1:
          return (
            <div>
              <PersonalInfoStep 
                onComplete={handlePersonalInfoComplete} 
                initialValues={personalInfo || undefined} 
              />
              {personalInfoCountdown && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Automatically proceeding in {personalInfoCountdown} seconds...
                </div>
              )}
            </div>
          );
        case 2:
          return (
            <div>
              <LocationStep 
                onComplete={handleLocationComplete} 
                initialValues={location || undefined} 
              />
              {locationCountdown && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Automatically proceeding in {locationCountdown} seconds...
                </div>
              )}
            </div>
          );
        case 3:
          return (
            <div>
              <PlanStep 
                onComplete={handlePlanSelected} 
                selectedPlan={selectedPlan} 
              />
              {planCountdown && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Automatically proceeding in {planCountdown} seconds...
                </div>
              )}
            </div>
          );
        case 4:
          return <PaymentStep onComplete={handlePaymentComplete} selectedPlan={selectedPlan} />;
        case 5:
          return <RhythmAssessmentStep onComplete={handleRhythmAssessmentComplete} />;
        default:
          console.error("Invalid step:", currentStep);
          return (
            <div className="text-center p-8">
              <p className="text-red-600">Invalid step. Please refresh and try again.</p>
              <button onClick={() => navigate("/onboarding")} className="mt-4 text-blue-600 underline">
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
  
  // Get current step information
  const currentStepInfo = STEPS.find(step => step.id === currentStep) || STEPS[0];

  return (
    <>
      <OnboardingLayout 
        currentStep={currentStep} 
        totalSteps={STEPS.length}
        onBack={goToPreviousStep}
        title={currentStepInfo.title}
        description={currentStepInfo.description}
      >
        {renderStepContent()}
      </OnboardingLayout>
      
      <PaymentConfirmationDialog
        open={showPaymentConfirmation}
        onConfirm={handlePaymentConfirm}
        onCancel={() => setShowPaymentConfirmation(false)}
        selectedPlan={selectedPlan}
      />
    </>
  );
};

export default Onboarding;
