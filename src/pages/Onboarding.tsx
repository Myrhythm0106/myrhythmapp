
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTypeSelector, UserType } from "@/components/onboarding/UserTypeSelector";
import { toast } from "sonner";
import { Brain, ArrowRight, ArrowLeft } from "lucide-react";
import PersonalInfoForm, { PersonalInfoFormValues } from "@/components/onboarding/PersonalInfoForm";
import PaymentInfoForm, { PaymentInfoFormValues } from "@/components/onboarding/PaymentInfoForm";

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedPlan = queryParams.get("plan") || "basic";
  
  // Get the step from URL or default to 1 if not present
  const initialStep = parseInt(queryParams.get("step") || "1");
  const [step, setStep] = useState(initialStep);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [customTypeValue, setCustomTypeValue] = useState("");
  
  // Update URL when step changes
  useEffect(() => {
    const newParams = new URLSearchParams(location.search);
    newParams.set("step", step.toString());
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  }, [step, location.pathname, location.search, navigate]);

  useEffect(() => {
    // Auto-advance when user type is selected (with small delay for UX)
    if (userType && step === 2 && userType !== "custom") {
      const timer = setTimeout(() => {
        setStep(3);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [userType, step]);

  const handleContinue = () => {
    if (step === 2) {
      if (!userType) {
        toast.error("Please select a user type to continue");
        return;
      }
      
      if (userType === "custom" && !customTypeValue.trim()) {
        toast.error("Please describe your specific needs");
        return;
      }
      
      setStep(3);
    }
  };
  
  const handlePersonalInfoSubmit = (values: PersonalInfoFormValues) => {
    console.log("Personal info:", values);
    console.log("User type:", userType);
    if (userType === "custom") {
      console.log("Custom type:", customTypeValue);
    }
    completeOnboarding();
  };
  
  const handlePaymentInfoSubmit = (values: PaymentInfoFormValues) => {
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
    setStep(2);
  };
  
  const completeOnboarding = () => {
    // In a real app, we would save all this information to a database
    localStorage.setItem('myrhythm_logged_in', 'true');
    sessionStorage.setItem('justRegistered', 'true');
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-2xl animate-fade-in">
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
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  {step === 1 && "Complete your profile"}
                  {step === 2 && "Personalised Support to O.R.D.E.R your life daily"}
                  {step === 3 && "Set up your payment details"}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Just a few more details to personalize your experience"}
                  {step === 2 && "Select the option that best describes your situation"}
                  {step === 3 && `Set up payment for your ${selectedPlan} plan`}
                </CardDescription>
              </div>
              <div className="text-sm font-medium">
                Step {step} of 3
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <PersonalInfoForm 
                onSubmit={(values) => {
                  console.log("Personal info:", values);
                  setStep(2); // Move to next step after profile completion
                }}
                onBack={handleBack}
              />
            ) : step === 2 ? (
              <div className="space-y-6">
                <UserTypeSelector 
                  selectedType={userType} 
                  onChange={setUserType} 
                  customType={customTypeValue}
                  onCustomTypeChange={setCustomTypeValue}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleContinue} 
                    className="gap-2"
                    disabled={!userType || (userType === "custom" && !customTypeValue.trim())}
                  >
                    Finish <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <PaymentInfoForm 
                onSubmit={handlePaymentInfoSubmit}
                onBack={handleBack}
                selectedPlan={selectedPlan}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
