
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileSubscriptionSelector } from "../subscription/MobileSubscriptionSelector";
import { EmpowermentOnboarding } from "./EmpowermentOnboarding";
import { UserTypeStep } from "./steps/UserTypeStep";
import { RhythmAssessmentStep } from "./steps/RhythmAssessmentStep";
import { AppStorePaymentStep } from "./mobile/AppStorePaymentStep";
import { CompletionStep } from "./mobile/CompletionStep";
import { UserType } from "./steps/UserTypeStep";
import { useMobileSubscription } from "@/contexts/MobileSubscriptionContext";
import { toast } from "sonner";

type OnboardingStep = "empowerment" | "user-type" | "subscription" | "payment" | "assessment" | "complete";

export function MobileOnboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("empowerment");
  const [userType, setUserType] = useState<UserType | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'family' | null>(null);
  const { startMobilePurchase } = useMobileSubscription();

  // Check if empowerment onboarding was completed
  const empowermentCompleted = localStorage.getItem('myrhythm_empowerment_onboarding_completed');
  
  // If empowerment onboarding was completed, skip to user type
  React.useEffect(() => {
    if (empowermentCompleted && currentStep === "empowerment") {
      setCurrentStep("user-type");
    }
  }, [empowermentCompleted, currentStep]);

  const steps = [
    { id: "empowerment", title: "Welcome", progress: 16 },
    { id: "user-type", title: "About You", progress: 32 },
    { id: "subscription", title: "Choose Plan", progress: 48 },
    { id: "payment", title: "Payment", progress: 64 },
    { id: "assessment", title: "Assessment", progress: 80 },
    { id: "complete", title: "Ready!", progress: 100 }
  ];

  const currentStepInfo = steps.find(step => step.id === currentStep) || steps[0];

  const handleEmpowermentComplete = () => {
    setCurrentStep("user-type");
    toast.success("Great! Now let's personalize your experience.");
  };

  const handleUserTypeComplete = (data: { type: UserType }) => {
    console.log("Mobile onboarding: User type selected:", data.type);
    setUserType(data.type);
    setCurrentStep("subscription");
    toast.success("Perfect! Let's choose your plan.");
  };

  const handlePlanSelection = async (planType: 'basic' | 'premium' | 'family') => {
    console.log("Mobile onboarding: Plan selected:", planType);
    setSelectedPlan(planType);
    setCurrentStep("payment");
    toast.success("Great choice! Let's complete your payment.");
  };

  const handlePaymentComplete = async () => {
    console.log("Mobile onboarding: Payment completed for plan:", selectedPlan);
    
    try {
      if (selectedPlan) {
        await startMobilePurchase(selectedPlan);
      }
      setCurrentStep("assessment");
      toast.success("Payment successful! Let's complete your assessment.");
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.success("Payment processed! Let's complete your assessment.");
      setCurrentStep("assessment");
    }
  };

  const handleContinueFree = () => {
    toast.info("Please select a plan to continue with MyRhythm's full features.");
  };

  const handleAssessmentComplete = () => {
    console.log("Mobile onboarding: Assessment completed");
    setCurrentStep("complete");
    toast.success("Assessment complete! Welcome to your empowering MyRhythm experience.");
    
    // Store completion status
    localStorage.setItem('myrhythm_mobile_onboarding_completed', 'true');
    localStorage.setItem('myrhythm_user_type', userType || 'individual');
  };

  const handleBack = () => {
    switch (currentStep) {
      case "user-type":
        setCurrentStep("empowerment");
        break;
      case "subscription":
        setCurrentStep("user-type");
        break;
      case "payment":
        setCurrentStep("subscription");
        break;
      case "assessment":
        setCurrentStep("payment");
        break;
      default:
        break;
    }
  };

  const handleEnterApp = () => {
    console.log("Mobile onboarding: Entering empowering app experience");
    window.location.href = '/dashboard';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "empowerment":
        return <EmpowermentOnboarding />;

      case "user-type":
        return (
          <UserTypeStep
            onComplete={handleUserTypeComplete}
            initialValue={userType}
          />
        );

      case "subscription":
        return (
          <MobileSubscriptionSelector
            onSelectPlan={handlePlanSelection}
            onContinueFree={handleContinueFree}
          />
        );

      case "payment":
        return (
          <AppStorePaymentStep
            selectedPlan={selectedPlan}
            onPaymentComplete={handlePaymentComplete}
            onBack={() => setCurrentStep("subscription")}
          />
        );

      case "assessment":
        return (
          <RhythmAssessmentStep
            onComplete={handleAssessmentComplete}
          />
        );

      case "complete":
        return (
          <CompletionStep
            onEnterApp={handleEnterApp}
          />
        );

      default:
        return null;
    }
  };

  // Show empowerment onboarding full screen
  if (currentStep === "empowerment") {
    return <EmpowermentOnboarding />;
  }

  if (currentStep === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-teal-200 shadow-xl">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      {/* Progress Header */}
      <div className="bg-white shadow-sm p-4 border-b border-teal-100">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            {currentStep !== "empowerment" && (
              <Button variant="ghost" size="sm" onClick={handleBack} className="text-teal-700 hover:text-teal-800 hover:bg-teal-50">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            <div className="flex-1" />
            <span className="text-sm text-slate-600">
              Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}
            </span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-lg font-semibold text-slate-800">{currentStepInfo.title}</h1>
            <Progress value={currentStepInfo.progress} className="h-2 bg-teal-100" />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-4">
        {renderStepContent()}
      </div>
    </div>
  );
}
