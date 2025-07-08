
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Smartphone, CheckCircle } from "lucide-react";
import { MobileSubscriptionSelector } from "../subscription/MobileSubscriptionSelector";
import { UserTypeStep } from "./steps/UserTypeStep";
import { RhythmAssessmentStep } from "./steps/RhythmAssessmentStep";
import { UserType } from "./steps/UserTypeStep";
import { useMobileSubscription } from "@/contexts/MobileSubscriptionContext";
import { toast } from "sonner";

type OnboardingStep = "user-type" | "subscription" | "assessment" | "complete";

export function MobileOnboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("user-type");
  const [userType, setUserType] = useState<UserType | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'family' | null>(null);
  const { startMobilePurchase } = useMobileSubscription();

  const steps = [
    { id: "user-type", title: "About You", progress: 33 },
    { id: "subscription", title: "Choose Plan", progress: 66 },
    { id: "assessment", title: "Assessment", progress: 100 }
  ];

  const currentStepInfo = steps.find(step => step.id === currentStep) || steps[0];

  const handleUserTypeComplete = (data: { type: UserType }) => {
    console.log("Mobile onboarding: User type selected:", data.type);
    setUserType(data.type);
    setCurrentStep("subscription");
    toast.success("Great! Let's choose your plan.");
  };

  const handlePlanSelection = async (planType: 'basic' | 'premium' | 'family') => {
    console.log("Mobile onboarding: Plan selected:", planType);
    setSelectedPlan(planType);
    
    try {
      await startMobilePurchase(planType);
      setCurrentStep("assessment");
      toast.success("Welcome to MyRhythm! Let's start your assessment.");
    } catch (error) {
      console.error("Plan selection error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleContinueFree = () => {
    console.log("Mobile onboarding: Continuing with free plan");
    setCurrentStep("assessment");
    toast.info("Starting with free features. You can upgrade anytime!");
  };

  const handleAssessmentComplete = () => {
    console.log("Mobile onboarding: Assessment completed");
    setCurrentStep("complete");
    toast.success("Assessment complete! Welcome to your personalized MyRhythm experience.");
    
    // Store completion status
    localStorage.setItem('myrhythm_mobile_onboarding_completed', 'true');
    localStorage.setItem('myrhythm_user_type', userType || 'individual');
  };

  const handleBack = () => {
    switch (currentStep) {
      case "subscription":
        setCurrentStep("user-type");
        break;
      case "assessment":
        setCurrentStep("subscription");
        break;
      default:
        break;
    }
  };

  const handleEnterApp = () => {
    console.log("Mobile onboarding: Entering main app");
    window.location.href = '/dashboard';
  };

  const renderStepContent = () => {
    switch (currentStep) {
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

      case "assessment":
        return (
          <RhythmAssessmentStep
            onComplete={handleAssessmentComplete}
          />
        );

      case "complete":
        return (
          <div className="text-center py-8 space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Welcome to MyRhythm!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your personalized cognitive wellness journey starts now. We've created a custom plan based on your assessment.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-blue-900">What's Next?</h3>
              <ul className="text-sm text-blue-800 space-y-1 text-left max-w-xs mx-auto">
                <li>• Explore your personalized dashboard</li>
                <li>• Set up your daily routines</li>
                <li>• Start your cognitive training</li>
                <li>• Connect with the community</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleEnterApp}
              className="mt-6 w-full max-w-xs"
              size="lg"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Enter MyRhythm
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  if (currentStep === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Progress Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            {currentStep !== "user-type" && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            <div className="flex-1" />
            <span className="text-sm text-muted-foreground">
              Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}
            </span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-lg font-semibold">{currentStepInfo.title}</h1>
            <Progress value={currentStepInfo.progress} className="h-2" />
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
