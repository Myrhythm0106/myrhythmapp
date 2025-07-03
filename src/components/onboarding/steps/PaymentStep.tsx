
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { PlanType } from "./PlanStep";
import { useSubscription, SubscriptionTier } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";

export type PaymentFormValues = {
  // No longer need form values as we're using Stripe Checkout
  paymentIntentId?: string;
};

interface PaymentStepProps {
  onComplete: (values: PaymentFormValues) => void;
  selectedPlan: PlanType;
}

export const PaymentStep = ({ onComplete, selectedPlan }: PaymentStepProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { createCheckoutSession } = useSubscription();
  
  const planInfo = {
    basic: { name: "Basic Plan", price: "$7.99/month", trial: "7 Day Free Trial" },
    premium: { name: "Premium Plan", price: "$9.99/month", trial: "7 Day Free Trial" },
    family: { name: "Family Plan", price: "$19.99/month", trial: "7 Day Free Trial" }
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
    
    try {
      console.log("PaymentStep: Starting trial with Stripe checkout for plan:", selectedPlan);
      
      // Convert PlanType to SubscriptionTier and create Stripe checkout session
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
      toast.error(`Unable to start trial: ${errorMessage}`);
    }
  };

  const handleSkipForNow = () => {
    console.log("PaymentStep: Skip trial selected");
    toast.info("Continuing without trial - you can upgrade anytime in settings");
    
    // Call onComplete to proceed to next step
    setTimeout(() => {
      onComplete({ paymentIntentId: 'skipped' });
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
            Start immediately with full access. Your payment method will be charged ${planInfo[selectedPlan].price.replace('$', '').replace('/month', '')} after 7 days.
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-blue-800">Secure Payment Processing</p>
            <p className="text-blue-700">
              Your payment information is processed securely by Stripe. We never store your payment details on our servers.
            </p>
          </div>
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
        
        <Button 
          onClick={handleSkipForNow}
          disabled={isProcessing}
          variant="outline"
          className="w-full"
        >
          Skip Trial - Continue with Basic Access
        </Button>
        
        <p className="text-xs text-center text-muted-foreground mt-3">
          By continuing, you agree to our Terms of Service and Privacy Policy.
          <br />
          Cancel anytime during your trial - no charges apply.
        </p>
      </div>
    </div>
  );
};
