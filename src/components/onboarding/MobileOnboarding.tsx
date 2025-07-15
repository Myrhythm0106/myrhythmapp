import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UserType } from "@/types/user";
import { Check, ArrowRight, ArrowLeft, Smartphone, Bell, Calendar, Users } from "lucide-react";

type OnboardingStep = "user-type" | "subscription" | "payment" | "assessment";

interface MobileOnboardingProps {
  userType?: UserType | null;
  hasPaidPremium?: boolean;
}

export function MobileOnboarding({ userType, hasPaidPremium = false }: MobileOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("user-type");
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([]);

  const steps: { id: OnboardingStep; title: string; description: string }[] = [
    { id: "user-type", title: "User Type", description: "Your journey type" },
    { id: "subscription", title: "Subscription", description: "Your plan details" },
    { id: "payment", title: "Payment", description: "Subscription setup" },
    { id: "assessment", title: "Assessment", description: "Personalization complete" }
  ];

  useEffect(() => {
    // Simulate step completion based on props
    const completed: OnboardingStep[] = [];
    if (userType) completed.push("user-type");
    if (hasPaidPremium) {
      completed.push("subscription", "payment");
    }
    setCompletedSteps(completed);
    
    // Set current step based on completion
    if (completed.length === 0) {
      setCurrentStep("user-type");
    } else if (completed.length < 3) {
      setCurrentStep("subscription");
    } else {
      setCurrentStep("assessment");
    }
  }, [userType, hasPaidPremium]);

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const isStepCompleted = (stepId: OnboardingStep) => completedSteps.includes(stepId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to MyRhythm</h1>
          <p className="text-gray-600">Let's set up your mobile experience</p>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Setup Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Overview */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${isStepCompleted(step.id) 
                      ? 'bg-green-500 text-white' 
                      : step.id === currentStep 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                    }`}>
                    {isStepCompleted(step.id) ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${step.id === currentStep ? 'text-blue-600' : 'text-gray-900'}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-blue-500" />
              Mobile Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentStep === "user-type" && (
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">User Type Selected</h3>
                <p className="text-gray-600">
                  Great! You've chosen: <span className="font-medium text-blue-600">{userType || "Not selected"}</span>
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Your mobile app will be personalized for your {userType || "selected"} journey.
                  </p>
                </div>
              </div>
            )}

            {currentStep === "subscription" && (
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Subscription Status</h3>
                <p className="text-gray-600">
                  {hasPaidPremium ? "Premium subscription active" : "Setting up your subscription"}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>Premium Features</span>
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>Mobile Sync</span>
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === "payment" && (
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Payment Setup</h3>
                <p className="text-gray-600">Configuring your mobile payment preferences</p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ Payment method verified
                    <br />
                    ✓ App Store subscription active
                  </p>
                </div>
              </div>
            )}

            {currentStep === "assessment" && (
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Ready to Launch!</h3>
                <p className="text-gray-600">Your personalized mobile experience is ready</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Bell className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Smart Reminders</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Daily Planning</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Users className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Support Circle</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <Smartphone className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Mobile Sync</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg">
                  <p className="font-medium">🎉 Your MyRhythm mobile app is ready!</p>
                  <p className="text-sm opacity-90 mt-1">
                    Download from the App Store to get started
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentStepIndex === steps.length - 1}
            className="flex items-center gap-2 flex-1"
          >
            {currentStepIndex === steps.length - 1 ? "Complete" : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Download CTA */}
        {currentStep === "assessment" && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-blue-900 mb-2">Ready for Mobile?</h3>
              <p className="text-sm text-blue-700 mb-4">
                Download MyRhythm from the App Store to sync your progress and access mobile features.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Open App Store
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
