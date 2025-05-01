
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { toast } from "sonner";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { UserTypeStep } from "@/components/onboarding/UserTypeStep";
import { PersonalInfoForm, PersonalInfoValues } from "@/components/onboarding/PersonalInfoForm";
import { PaymentForm, PaymentFormValues } from "@/components/onboarding/PaymentForm";
import { UserType } from "@/components/onboarding/UserTypeSelector";

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedPlan = queryParams.get("plan") || "basic";
  
  // Get the step from URL or default to 1 if not present
  const initialStep = parseInt(queryParams.get("step") || "1");
  const [step, setStep] = useState(initialStep);
  const [userType, setUserType] = useState<UserType | null>(null);
  
  // Update URL when step changes
  useEffect(() => {
    const newParams = new URLSearchParams(location.search);
    newParams.set("step", step.toString());
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  }, [step, location.pathname, location.search, navigate]);

  const handleContinue = () => {
    if (!userType) {
      toast.error("Please select a user type to continue");
      return;
    }
    setStep(2);
  };
  
  const handlePersonalInfoSubmit = (values: PersonalInfoValues) => {
    console.log("Personal info:", values);
    completeOnboarding();
  };
  
  const handlePaymentInfoSubmit = (values: PaymentFormValues) => {
    console.log("Payment info:", values);
    
    // In a real implementation, you would send this info to a payment processor
    // Here we're just simulating a successful payment
    
    // For the basic plan, show that it's a 7-day free trial
    if (selectedPlan === "basic") {
      toast.success("Your 7-day free trial has started. Your card will be charged $7.99 after the trial period.");
    } else {
      toast.success("Payment processed successfully!");
    }
    
    // After successful payment, go to user type selection
    setStep(1);
  };
  
  const completeOnboarding = () => {
    // In a real app, we would save all this information to a database
    toast.success("Account created successfully!");
    navigate("/dashboard");
  };

  const handleBack = () => {
    if (step === 1) {
      // Go back to landing page
      navigate("/");
    } else {
      setStep(step - 1);
    }
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <UserTypeStep 
            selectedType={userType}
            onChange={setUserType}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <PersonalInfoForm
            onSubmit={handlePersonalInfoSubmit}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <PaymentForm
            selectedPlan={selectedPlan}
            onSubmit={handlePaymentInfoSubmit}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  const getStepHeader = () => {
    switch (step) {
      case 1:
        return {
          title: "Personalize Support for Your Brain Health Journey",
          description: "Select the option that best describes your situation"
        };
      case 2:
        return {
          title: "Complete your profile",
          description: "Just a few more details to personalize your experience"
        };
      case 3:
        return {
          title: "Set up your payment details",
          description: `Set up payment for your ${selectedPlan} plan`
        };
      default:
        return {
          title: "",
          description: ""
        };
    }
  };

  const headerInfo = getStepHeader();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <Brain className="h-10 w-10 text-beacon-600" />
            <h1 className="text-3xl font-bold">MyRhythm</h1>
          </div>
        </div>
        
        <Card className="border-2">
          <CardHeader>
            <StepHeader 
              step={step} 
              title={headerInfo.title}
              description={headerInfo.description}
            />
          </CardHeader>
          <CardContent>
            {getStepContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
