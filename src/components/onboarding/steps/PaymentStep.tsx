
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { PlanType } from "./PlanStep";
import { useSubscription, SubscriptionTier } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";

export type PaymentFormValues = {
  paymentIntentId?: string;
};

interface PaymentStepProps {
  onComplete: (values: PaymentFormValues) => void;
  selectedPlan: PlanType;
}

export const PaymentStep = ({ onComplete, selectedPlan }: PaymentStepProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const { createCheckoutSession } = useSubscription();
  
  const planInfo = {
    basic: { name: "MyRhythm Align", price: "£5.99/month", trial: "7 Day Free Trial" },
    premium: { name: "MyRhythm Flow", price: "£9.99/month", trial: "7 Day Free Trial" },
    family: { name: "MyRhythm Thrive", price: "£19.99/month", trial: "7 Day Free Trial" }
  };

  // Convert PlanType to SubscriptionTier
  const mapPlanToTier = (plan: PlanType): SubscriptionTier => {
    switch (plan) {
      case 'basic':
        return 'basic';
      case 'premium':
        return 'premium';
      case 'family':
        return 'family';
      default:
        return 'premium';
    }
  };

  const handleStartTrial = async () => {
    console.log("PaymentStep: Start trial button clicked");
    
    if (isProcessing) {
      console.log("PaymentStep: Already processing, ignoring click");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      console.log("PaymentStep: Starting trial with Stripe checkout for plan:", selectedPlan);
      
      const subscriptionTier = mapPlanToTier(selectedPlan);
      console.log("PaymentStep: Mapped tier:", subscriptionTier);
      
      const checkoutUrl = await createCheckoutSession(subscriptionTier);
      console.log("PaymentStep: Checkout URL received:", checkoutUrl);
      
      if (!checkoutUrl) {
        throw new Error("No checkout URL received from Stripe");
      }
      
      // Show success state briefly before redirect
      setShowSuccess(true);
      toast.success("Redirecting to secure payment...");
      
      // Small delay to show success state, then redirect
      setTimeout(() => {
        window.location.href = checkoutUrl;
      }, 1500);
      
    } catch (error) {
      console.error("PaymentStep: Error creating checkout session:", error);
      setIsProcessing(false);
      setShowSuccess(false);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      toast.error(`Unable to start trial: ${errorMessage}`);
      
      // Show fallback options after error
      setTimeout(() => {
        setShowFallback(true);
      }, 2000);
    }
  };

  const handleSkipTrial = () => {
    console.log("PaymentStep: Skip trial selected");
    toast.info("Continuing without trial - you can upgrade anytime");
    
    setTimeout(() => {
      onComplete({ paymentIntentId: 'skipped' });
    }, 500);
  };

  const handleContinueAnyway = () => {
    console.log("PaymentStep: Continue anyway selected");
    toast.info("Continuing to assessment - you can set up payment later");
    
    setTimeout(() => {
      onComplete({ paymentIntentId: 'continue_anyway' });
    }, 500);
  };

  if (showSuccess) {
    return (
      <div className="text-center space-y-6 py-12">
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-green-800">Setting Up Your Trial!</h2>
          <p className="text-green-700">
            Redirecting you to secure payment setup...
          </p>
          <p className="text-sm text-muted-foreground">
            You won't be charged until your trial ends.
          </p>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="text-center space-y-6 py-12">
        <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-blue-800">Setting Up Your Trial...</h2>
          <p className="text-blue-700">
            Creating your secure payment session.
          </p>
          <p className="text-sm text-muted-foreground">
            This should only take a moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-red-800">Payment Setup Error</p>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Plan Summary */}
      <div className="bg-muted p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{planInfo[selectedPlan].name}</h3>
            <p className="text-lg font-bold text-primary">{planInfo[selectedPlan].price}</p>
          </div>
          <CreditCard className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-800">{planInfo[selectedPlan].trial}</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Start immediately with full access. Your payment method will be charged after 7 days.
          </p>
        </div>
      </div>

      {/* Features Included */}
      <div className="space-y-3">
        <h4 className="font-semibold">What's included in your trial:</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Complete MyRhythm Framework access
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Personalized LEAP assessment & insights
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Memory enhancement tools & exercises
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Calendar & goal management system
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Brain games & cognitive training
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Progress tracking & momentum building
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <Button 
          onClick={handleStartTrial}
          disabled={isProcessing}
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Setting Up Trial...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Start Your 7-Day Free Trial
            </>
          )}
        </Button>
        
        {/* Fallback Options */}
        {(showFallback || error) && (
          <>
            <Button 
              onClick={handleContinueAnyway}
              disabled={isProcessing}
              variant="outline"
              className="w-full"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Continue to Assessment (Set up payment later)
            </Button>
            
            <Button 
              onClick={handleSkipTrial}
              disabled={isProcessing}
              variant="ghost"
              className="w-full"
            >
              Skip Trial - Continue with Basic Access
            </Button>
          </>
        )}
        
        <p className="text-xs text-center text-muted-foreground mt-3">
          By continuing, you agree to our Terms of Service and Privacy Policy.
          <br />
          Cancel anytime during your trial - no charges apply.
        </p>
      </div>
    </div>
  );
};
