import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Brain, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { OnboardingSteps } from "@/components/onboarding/OnboardingSteps";
import { PersonalInfoFormValues } from "@/components/onboarding/PersonalInfoForm";
import { UserType } from "@/components/onboarding/UserTypeSelector";

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Get the step from URL or default to 1 if not present
  const initialStep = parseInt(queryParams.get("step") || "1");
  const [step, setStep] = useState(initialStep);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [customTypeValue, setCustomTypeValue] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("basic");
  
  // Store form values to prevent losing them between steps
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoFormValues | null>(null);
  
  // Update URL when step changes BUT prevent the update from triggering a state change
  useEffect(() => {
    // Compare if the current URL step matches our state
    const currentUrlStep = parseInt(queryParams.get("step") || "1");
    
    // Only update URL if step has actually changed to prevent loops
    if (currentUrlStep !== step) {
      const newParams = new URLSearchParams(location.search);
      newParams.set("step", step.toString());
      // Use replace to avoid adding to history stack
      navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
    }
  }, [step, navigate, location.pathname, queryParams]);

  // Auto-advance when user type is selected (with small delay for UX)
  useEffect(() => {
    if (userType && step === 4 && userType !== "custom") {
      const timer = setTimeout(() => {
        handleFinishOnboarding();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [userType, step]);

  const handlePersonalInfoSubmit = (values: PersonalInfoFormValues) => {
    console.log("Personal info:", values);
    // Store in localStorage for login functionality
    localStorage.setItem("myrhythm_name", values.name);
    localStorage.setItem("myrhythm_email", values.email);
    localStorage.setItem("myrhythm_password", values.password);
    
    // Store the form values in state to prevent losing them
    setPersonalInfo(values);
    
    // Move to plan selection step - ensure this happens synchronously
    setStep(2);
    
    // Add a small timeout to ensure the step change is processed
    setTimeout(() => {
      const currentStep = parseInt(queryParams.get("step") || "1");
      if (currentStep !== 2) {
        navigate(`/onboarding?step=2`, { replace: true });
      }
    }, 50);
  };
  
  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    
    // We'll keep this auto-advance but with a longer delay to make it more visible
    const timer = setTimeout(() => {
      handlePlanContinue();
    }, 1000); // Increased delay for better UX
    return () => clearTimeout(timer);
  };
  
  const handlePlanContinue = () => {
    // Move to payment details step
    setStep(3);
    
    // Ensure URL matches the current step
    navigate(`/onboarding?step=3`, { replace: true });
  };

  const handlePaymentSubmit = (values: any) => {
    console.log("Payment info:", values);
    
    // Move to user type selection
    setStep(4);
    
    // Ensure URL matches the current step
    navigate(`/onboarding?step=4`, { replace: true });
  };
  
  const handleFinishOnboarding = () => {
    console.log("User type:", userType);
    if (userType === "custom") {
      console.log("Custom type:", customTypeValue);
    }
    
    // Set login and registration status
    localStorage.setItem('myrhythm_logged_in', 'true');
    sessionStorage.setItem('justRegistered', 'true');
    
    toast({
      title: "Success!",
      description: "Account created successfully!",
      variant: "default",
    });
    
    // Redirect to welcome page instead of dashboard
    navigate("/welcome");
  };

  const handleBack = () => {
    if (step === 1) {
      // Go back to landing page
      navigate("/");
    } else {
      // Update step state
      const newStep = step - 1;
      setStep(newStep);
      
      // Also update URL to ensure consistency
      navigate(`/onboarding?step=${newStep}`, { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Brain className="h-10 w-10 text-beacon-600" />
            <h1 className="text-3xl font-bold">MyRhythm</h1>
          </div>
          
          <div className="w-[76px]"></div> {/* Empty div for balance */}
        </div>
        
        <Card className="border-2">
          <OnboardingHeader step={step} />
          <OnboardingSteps 
            step={step}
            personalInfo={personalInfo}
            selectedPlan={selectedPlan}
            userType={userType}
            customTypeValue={customTypeValue}
            onPersonalInfoSubmit={handlePersonalInfoSubmit}
            onPlanSelect={handlePlanSelect}
            onPlanContinue={handlePlanContinue}
            onPaymentSubmit={handlePaymentSubmit}
            onUserTypeChange={setUserType}
            onCustomTypeChange={setCustomTypeValue}
            onFinish={handleFinishOnboarding}
            onBack={handleBack}
          />
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
