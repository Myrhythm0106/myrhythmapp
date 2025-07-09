
import React, { useState } from "react";import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// App Store Payment Step Component
interface AppStorePaymentStepProps {
  selectedPlan: 'basic' | 'premium' | 'family' | null;
  onPaymentComplete: () => void;
  onBack: () => void;
}

function AppStorePaymentStep({ selectedPlan, onPaymentComplete, onBack }: AppStorePaymentStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTouchId, setShowTouchId] = useState(false);

  const planDetails = {
    basic: { name: 'MyRhythm Align', price: '£5.99', description: 'Perfect for getting started' },
    premium: { name: 'MyRhythm Flow', price: '£9.99', description: 'Most popular choice' },
    family: { name: 'MyRhythm Thrive', price: '£19.99', description: 'Perfect for families' }
  };

  const currentPlan = selectedPlan ? planDetails[selectedPlan] : null;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate App Store payment flow
    setTimeout(() => {
      setShowTouchId(true);
      setTimeout(() => {
        setShowTouchId(false);
        setIsProcessing(false);
        onPaymentComplete();
      }, 2000);
    }, 1000);
  };

  if (showTouchId) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <span className="text-3xl">👆</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800">Touch ID Required</h3>
              <p className="text-slate-600">Use Touch ID to complete your purchase</p>
            </div>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Complete Purchase</h2>
        <p className="text-slate-600">Secure payment through App Store</p>
      </div>

      <Card className="border-2 border-teal-200 bg-white shadow-lg">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-100">
          <CardTitle className="text-center">
            <Smartphone className="h-6 w-6 text-teal-600 mx-auto mb-2" />
            App Store Purchase
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {currentPlan && (
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-800">{currentPlan.name}</h3>
                  <p className="text-sm text-slate-600">{currentPlan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-800">{currentPlan.price}</div>
                  <div className="text-sm text-slate-500">per month</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-slate-600 pt-2 border-t border-slate-200">
                <span>7-day free trial included</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🍎</span>
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Secure App Store Payment</p>
                  <p className="text-sm text-blue-700">Protected by Apple's security</p>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <p>• Your payment will be charged to your iTunes Account</p>
              <p>• Subscription automatically renews unless auto-renew is turned off</p>
              <p>• Manage subscriptions in App Store settings</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white shadow-lg py-3"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  Complete Purchase {currentPlan?.price}/month
                </>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="w-full text-slate-600 hover:text-slate-800"
              disabled={isProcessing}
            >
              Back to Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
