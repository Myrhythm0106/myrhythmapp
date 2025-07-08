
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Smartphone } from "lucide-react";
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
    setUserType(data.type);
    setCurrentStep("subscription");
    toast.success("Great! Let's choose your plan.");
  };

  const handlePlanSelection = async (planType: 'basic' | 'premium' | 'family') => {
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
    setCurrentStep("assessment");
    toast.info("Starting with free features. You can upgrade anytime!");
  };

  const handleAssessmentComplete = () => {
    setCurrentStep("complete");
    toast.success("Assessment complete! Welcome to your personalized MyRhythm experience.");
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
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Smartphone className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Welcome to MyRhythm!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your personalized journey starts now. We've created a custom plan based on your assessment.
            </p>
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              className="mt-6"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Enter Your Dashboard
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
