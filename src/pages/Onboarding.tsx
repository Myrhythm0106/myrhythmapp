
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
  
  // Update URL when step changes - this is important for browser navigation
  useEffect(() => {
    const newParams = new URLSearchParams(location.search);
    newParams.set("step", step.toString());
    // Replace to avoid adding to history stack
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  }, [step, navigate, location]);

  // Auto-advance when user type is selected (without delay for faster experience)
  useEffect(() => {
    if (userType && step === 4 && userType !== "custom") {
      handleFinishOnboarding();
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
    
    // Force immediate step change - using functional update to ensure we're working with the latest state
    setStep(2); // Direct assignment for clarity
  };
  
  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    
    // Immediate advancement - no delay
    handlePlanContinue();
  };
  
  const handlePlanContinue = () => {
    // Immediate advancement to payment step
    setStep(3); // Direct assignment for clarity
  };

  const handlePaymentSubmit = (values: any) => {
    console.log("Payment info:", values);
    
    // Immediate advancement to user type selection
    setStep(4); // Direct assignment for clarity
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
    
    // Redirect to welcome page
    navigate("/welcome");
  };

  const handleBack = () => {
    if (step === 1) {
      // Go back to landing page
      navigate("/");
    } else {
      // Direct step change
      setStep(step - 1);
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
