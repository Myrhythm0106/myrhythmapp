import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Smartphone, CheckCircle } from "lucide-react";
import { MobileSubscriptionSelector } from "../subscription/MobileSubscriptionSelector";
import { EmpowermentOnboarding } from "./EmpowermentOnboarding";
import { UserTypeStep } from "./steps/UserTypeStep";
import { RhythmAssessmentStep } from "./steps/RhythmAssessmentStep";
import { UserType } from "./steps/UserTypeStep";
import { useMobileSubscription } from "@/contexts/MobileSubscriptionContext";
import { toast } from "sonner";

type OnboardingStep = "empowerment" | "user-type" | "subscription" | "assessment" | "complete";

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
    { id: "empowerment", title: "Welcome", progress: 20 },
    { id: "user-type", title: "About You", progress: 40 },
    { id: "subscription", title: "Choose Plan", progress: 60 },
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
    
    try {
      await startMobilePurchase(planType);
      setCurrentStep("assessment");
      toast.success("Welcome to MyRhythm! Let's complete your assessment.");
    } catch (error) {
      console.error("Plan selection error:", error);
      toast.success("Plan selected! Let's complete your assessment.");
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
      case "assessment":
        setCurrentStep("subscription");
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

      case "assessment":
        return (
          <RhythmAssessmentStep
            onComplete={handleAssessmentComplete}
          />
        );

      case "complete":
        return (
          <div className="text-center py-8 space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">You're All Set! 🎉</h2>
              <p className="text-slate-600 max-w-md mx-auto">
                Your empowering journey begins now. We've personalized everything just for you.
              </p>
            </div>

            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-teal-900">Your Empowerment Hub Awaits:</h3>
              <ul className="text-sm text-teal-800 space-y-1 text-left max-w-xs mx-auto">
                <li>🎯 Set your daily "Today I Will..." focus</li>
                <li>🦸‍♀️ Connect with your support heroes</li>
                <li>🏆 Celebrate every win, big or small</li>
                <li>🗻 Track your independence journey</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleEnterApp}
              className="mt-6 w-full max-w-xs bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white shadow-lg"
              size="lg"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Start My Journey! 🚀
            </Button>
          </div>
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
