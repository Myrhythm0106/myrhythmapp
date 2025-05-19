
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { PersonalInfoStep, PersonalInfoFormValues } from "@/components/onboarding/steps/PersonalInfoStep";
import { PlanStep, PlanType } from "@/components/onboarding/steps/PlanStep";
import { PaymentStep, PaymentFormValues } from "@/components/onboarding/steps/PaymentStep";
import { UserTypeStep, UserType } from "@/components/onboarding/steps/UserTypeStep";
import { LocationStep } from "@/components/onboarding/steps/LocationStep";

// Onboarding step definitions
const STEPS = [
  {
    id: 1,
    title: "Where are you located?",
    description: "Tell us where you're from so we can personalize your experience"
  },
  {
    id: 2,
    title: "Complete your profile",
    description: "Just a few more details to personalize your experience"
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
    title: "How will you use MyRhythm?",
    description: "Select the option that best describes your situation"
  }
];

type LocationFormValues = {
  country: string;
  city: string;
  state: string;
};

const Onboarding = () => {
  const navigate = useNavigate();
  
  // Core state
  const [currentStep, setCurrentStep] = useState(1);
  const [location, setLocation] = useState<LocationFormValues | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoFormValues | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("basic");
  
  // Handle step navigation with browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      } else {
        navigate("/");
      }
    };
    
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentStep, navigate]);
  
  // Update browser history when moving forward (without adding duplicate entries)
  useEffect(() => {
    if (currentStep > 1) {
      window.history.pushState({ step: currentStep }, "", `/onboarding?step=${currentStep}`);
    }
  }, [currentStep]);
  
  // Handle step transitions
  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };
  
  const goToPreviousStep = () => {
    if (currentStep === 1) {
      navigate("/");
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
      // Update browser URL
      window.history.pushState(null, "", `/onboarding?step=${currentStep - 1}`);
    }
  };
  
  // Step handlers
  const handleLocationComplete = (values: LocationFormValues) => {
    // Store location information
    setLocation(values);
    goToNextStep();
  };
  
  const handlePersonalInfoComplete = (values: PersonalInfoFormValues) => {
    // Store user information
    localStorage.setItem("myrhythm_name", values.name);
    localStorage.setItem("myrhythm_email", values.email);
    localStorage.setItem("myrhythm_password", values.password);
    setPersonalInfo(values);
    goToNextStep();
  };
  
  const handlePlanSelected = (plan: PlanType) => {
    setSelectedPlan(plan);
    goToNextStep();
  };
  
  const handlePaymentComplete = (values: PaymentFormValues) => {
    // In a real app, process payment here
    console.log("Payment info:", values);
    goToNextStep();
  };
  
  const handleUserTypeSelected = (data: { type: UserType; customValue?: string }) => {
    console.log("User type:", data);
    
    // Store location data
    if (location) {
      localStorage.setItem("myrhythm_country", location.country);
      localStorage.setItem("myrhythm_city", location.city);
      localStorage.setItem("myrhythm_state", location.state);
    }
    
    // Store user type
    localStorage.setItem("myrhythm_user_type", data.type);
    if (data.customValue) {
      localStorage.setItem("myrhythm_custom_type", data.customValue);
    }
    
    // Set login and registration status
    localStorage.setItem('myrhythm_logged_in', 'true');
    sessionStorage.setItem('justRegistered', 'true');
    
    // Show success toast
    toast({
      title: "Account created!",
      description: "Welcome to MyRhythm. Your account has been set up successfully.",
      variant: "default",
    });
    
    // Navigate to welcome page
    navigate("/welcome");
  };
  
  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <LocationStep onComplete={handleLocationComplete} initialValues={location || undefined} />;
      case 2:
        return <PersonalInfoStep onComplete={handlePersonalInfoComplete} initialValues={personalInfo || undefined} />;
      case 3:
        return <PlanStep onComplete={handlePlanSelected} selectedPlan={selectedPlan} />;
      case 4:
        return <PaymentStep onComplete={handlePaymentComplete} selectedPlan={selectedPlan} />;
      case 5:
        return <UserTypeStep onComplete={handleUserTypeSelected} />;
      default:
        return null;
    }
  };
  
  // Get current step information
  const currentStepInfo = STEPS.find(step => step.id === currentStep) || STEPS[0];

  return (
    <OnboardingLayout 
      currentStep={currentStep} 
      totalSteps={STEPS.length}
      onBack={goToPreviousStep}
      title={currentStepInfo.title}
      description={currentStepInfo.description}
    >
      {renderStepContent()}
    </OnboardingLayout>
  );
};

export default Onboarding;
