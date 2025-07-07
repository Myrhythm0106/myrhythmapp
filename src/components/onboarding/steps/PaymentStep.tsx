
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, Loader2, AlertCircle, ArrowRight, Sparkles, Shield, Clock, Star } from "lucide-react";
import { PlanType } from "./PlanStep";
import { useSubscription, SubscriptionTier } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";

export type PaymentFormValues = {
  paymentIntentId?: string;
};

interface PaymentStepProps {
  onComplete: (values: PaymentFormValues) => void;
  selectedPlan: PlanType;
  billingPeriod?: 'monthly' | 'annual';
}

export const PaymentStep = ({ onComplete, selectedPlan, billingPeriod = 'monthly' }: PaymentStepProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const { createCheckoutSession } = useSubscription();
  
  const planInfo = {
    basic: { 
      name: "MyRhythm Align",
      monthlyPrice: "£5.99/month",
      annualPrice: "£57.50/year",
      savings: "Save £14.38",
      trial: "7 Day Free Trial"
    },
    premium: { 
      name: "MyRhythm Flow",
      monthlyPrice: "£9.99/month", 
      annualPrice: "£95.90/year",
      savings: "Save £23.98",
      trial: "7 Day Free Trial"
    },
    family: { 
      name: "MyRhythm Thrive",
      monthlyPrice: "£19.99/month",
      annualPrice: "£191.90/year", 
      savings: "Save £47.98",
      trial: "7 Day Free Trial"
    }
  };

  const currentPlan = planInfo[selectedPlan];
  const displayPrice = billingPeriod === 'annual' ? currentPlan.annualPrice : currentPlan.monthlyPrice;
  const isAnnual = billingPeriod === 'annual';

  // Convert PlanType to SubscriptionTier
  const mapPlanToTier = (plan: PlanType): SubscriptionTier => {
    switch (plan) {
      case 'basic': return 'basic';
      case 'premium': return 'premium';
      case 'family': return 'family';
      default: return 'premium';
    }
  };

  const handleStartPayment = async () => {
    console.log("PaymentStep: Start payment button clicked");
    
    if (isProcessing) {
      console.log("PaymentStep: Already processing, ignoring click");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      console.log("PaymentStep: Starting payment with Stripe checkout", { 
        plan: selectedPlan, 
        billingPeriod 
      });
      
      const subscriptionTier = mapPlanToTier(selectedPlan);
      console.log("PaymentStep: Mapped tier:", subscriptionTier);
      
      // Enhanced checkout session creation with billing period
      const checkoutUrl = await createCheckoutSession(subscriptionTier, billingPeriod);
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
      
      // Enhanced error messaging based on error type
      if (errorMessage.includes('STRIPE_SECRET_KEY')) {
        toast.error("Payment system configuration needed. Please contact support.");
      } else if (errorMessage.includes('authentication')) {
        toast.error("Please log in to continue with payment setup.");
      } else {
        toast.error(`Unable to start payment: ${errorMessage}`);
      }
      
      // Show fallback options after error
      setTimeout(() => {
        setShowFallback(true);
      }, 2000);
    }
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
          <h2 className="text-2xl font-bold text-green-800">
            {isAnnual ? 'Processing Your Payment!' : 'Setting Up Your Free Trial!'}
          </h2>
          <p className="text-green-700">
            Redirecting you to secure Stripe payment setup...
          </p>
          {!isAnnual && (
            <p className="text-sm text-muted-foreground">
              You won't be charged until your trial ends.
            </p>
          )}
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
          <h2 className="text-2xl font-bold text-blue-800">
            {isAnnual ? 'Processing Payment...' : 'Setting Up Your Trial...'}
          </h2>
          <p className="text-blue-700">
            Creating your secure Stripe payment session.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secured by Stripe</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Enhanced Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="font-semibold text-red-800">Payment Setup Issue</p>
                <p className="text-sm text-red-700">{error}</p>
                {error.includes('STRIPE_SECRET_KEY') && (
                  <div className="mt-3 p-3 bg-red-100 rounded-lg">
                    <p className="text-xs text-red-800">
                      <strong>Configuration needed:</strong> The payment system requires setup. 
                      Please contact support or try the continue option below.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Plan Summary */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">{currentPlan.name}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{displayPrice?.split('/')[0]}</span>
                <span className="text-sm text-muted-foreground">
                  {isAnnual ? 'per year' : 'per month'}
                </span>
              </div>
              {isAnnual && (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">{currentPlan.savings}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    Best Value
                  </Badge>
                </div>
              )}
            </div>
            <div className="text-right">
              <CreditCard className="h-8 w-8 text-muted-foreground mb-2" />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Stripe Secured</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isAnnual ? (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-800">{currentPlan.trial}</span>
              </div>
              <p className="text-sm text-blue-700">
                Start immediately with full access. Your payment method will be charged after 7 days.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">Immediate Full Access</span>
              </div>
              <p className="text-sm text-green-700">
                Payment processed immediately. 30-day money-back guarantee included.
              </p>
            </div>
          )}

          {/* Payment Flow Explanation */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">🔒 Secure Payment Process</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• You'll be redirected to Stripe's secure payment page</p>
              <p>• Enter your payment details safely on Stripe's platform</p>
              <p>• Return to MyRhythm to complete your setup</p>
              <p>• Your payment information is never stored on our servers</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Included */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What's included:</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
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
              Progress tracking & momentum building
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <Button 
          onClick={handleStartPayment}
          disabled={isProcessing}
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {isAnnual ? 'Processing Payment...' : 'Setting Up Trial...'}
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              {isAnnual ? `Pay ${displayPrice} Now` : `Start Your 7-Day Free Trial`}
            </>
          )}
        </Button>
        
        {/* Enhanced Fallback Options */}
        {(showFallback || error) && (
          <div className="space-y-2">
            <Button 
              onClick={handleContinueAnyway}
              disabled={isProcessing}
              variant="outline"
              className="w-full border-2 hover:bg-gray-50"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Continue to Assessment (Set up payment later)
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              You can complete payment setup after your assessment
            </p>
          </div>
        )}
        
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            {isAnnual ? '🛡️ 30-day money-back guarantee' : '🔄 Cancel anytime during trial - no charges apply'}
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-3">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-1">
              <CreditCard className="h-3 w-3" />
              <span>Stripe Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
