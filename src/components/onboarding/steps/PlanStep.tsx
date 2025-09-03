
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { CheckCircle, Heart, Shield, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PlanHeader } from "./plan/PlanHeader";
import { EnhancedPlanCard } from "./plan/EnhancedPlanCard";
import { plans } from "./plan/plansData";
import { PlanType, PlanStepProps } from "./plan/types";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PaymentDetailsForm } from "@/components/payment/PaymentDetailsForm";
import { LifeEmpowermentGuide } from "../LifeEmpowermentGuide";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { SmartPricingDisplay } from "../steps/rhythm/SmartPricingDisplay";

export type { PlanType };

export const PlanStep = ({ onComplete, selectedPlan = "premium" }: PlanStepProps) => {
  const [showSmartPricing, setShowSmartPricing] = useState(true);
  const [selected, setSelected] = useState<PlanType | null>(null);
  const [isAnnual, setIsAnnual] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const isMobile = useIsMobile();
  const { updateSubscription } = useSubscription();

  const handlePlanSelect = (planId: PlanType) => {
    console.log("PlanStep: Plan selected:", planId);
    setSelected(planId);
    
    // If 'preview' was selected, skip payment and go directly to assessment
    if (planId === 'preview') {
      onComplete(planId, 'monthly');
      return;
    }
    
    setShowPaymentForm(true);
  };

  const handleSmartPricingTryBefore = () => {
    toast.success("Welcome to your 7-day free trial! Explore all MyRhythm features.");
    onComplete('basic', 'monthly');
  };

  const handleSmartPricingSubscribe = () => {
    handlePlanSelect('premium');
  };

  const handleSmartPricingClose = () => {
    setShowSmartPricing(false);
  };

  const handleBillingChange = (annual: boolean) => {
    setIsAnnual(annual);
  };

  const handlePaymentComplete = (paymentDetails: any) => {
    console.log("PlanStep: Payment completed for plan:", selected);
    
    // Update subscription status based on selected plan
    if (selected) {
      const subscriptionTier = selected === 'basic' ? 'starter' : selected === 'premium' ? 'smart_pro' : 'family_smart';
      console.log("PlanStep: Updating subscription to tier:", subscriptionTier);
      updateSubscription(subscriptionTier);
    }
    
    // Payment completed successfully - now show the Life Empowerment Guide
    setShowLifeGuide(true);
  };

  const [showLifeGuide, setShowLifeGuide] = useState(false);

  const handleLifeGuideComplete = () => {
    setShowLifeGuide(false);
    onComplete(selected!, isAnnual ? 'annual' : 'monthly');
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setSelected(null);
  };

  // Show Life Empowerment Guide after payment
  if (showLifeGuide) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4">
        <LifeEmpowermentGuide onComplete={handleLifeGuideComplete} />
      </div>
    );
  }

  // Show payment form if a plan is selected
  if (showPaymentForm && selected) {
    const selectedPlanData = plans.find(p => p.id === selected);
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4">
        <PaymentDetailsForm
          selectedPlan={{
            name: selectedPlanData?.name || '',
            price: isAnnual ? selectedPlanData?.annualPrice || selectedPlanData?.price || '' : selectedPlanData?.price || '',
            trialDays: !isAnnual && selected === 'basic' ? 7 : undefined
          }}
          onSubmit={handlePaymentComplete}
          onCancel={handlePaymentCancel}
        />
      </div>
    );
  }

  // Show SmartPricingDisplay first
  if (showSmartPricing) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4">
        <SmartPricingDisplay
          userType="brain-injury"
          onClose={handleSmartPricingClose}
          onSubscribe={handleSmartPricingSubscribe}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-brain-health-900">
          🌟 Try Before You Subscribe
        </h2>
        <p className="text-brain-health-700 max-w-2xl mx-auto">
          Experience MyRhythm with a <strong>7-day free trial</strong> - no payment required to start.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-r from-brain-health-50 to-memory-emerald-50 border-2 border-brain-health-200 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              onClick={handleSmartPricingTryBefore}>
          <CardContent className="p-8 space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brain-health-900 mb-2">
                Experience MyRhythm Risk-Free
              </h3>
              <p className="text-brain-health-700">
                Start with a 7-day free trial and see how MyRhythm can transform your daily rhythm.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <CheckCircle className="h-8 w-8 mx-auto text-memory-emerald-500" />
                <p className="font-semibold text-brain-health-800">Full Access</p>
                <p className="text-sm text-brain-health-600">All premium features included</p>
              </div>
              <div className="space-y-2">
                <Heart className="h-8 w-8 mx-auto text-clarity-teal-500" />
                <p className="font-semibold text-brain-health-800">No Commitment</p>
                <p className="text-sm text-brain-health-600">Cancel anytime during trial</p>
              </div>
              <div className="space-y-2">
                <Shield className="h-8 w-8 mx-auto text-sunrise-amber-500" />
                <p className="font-semibold text-brain-health-800">No Card Required</p>
                <p className="text-sm text-brain-health-600">Start immediately, pay later</p>
              </div>
            </div>

            <div className="text-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 hover:opacity-90 text-white px-8 py-6 text-lg font-semibold w-full"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start 7-Day Free Trial
              </Button>
              <p className="text-sm text-brain-health-600 mt-2">
                ✨ No payment required • Full access • Cancel anytime
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Grid - Equal Height Cards with Perfect Alignment */}
      <div className={cn(
        "grid gap-6",
        isMobile ? "grid-cols-1" : "grid-cols-3 lg:gap-8"
      )}>
        {plans.map((plan) => (
          <EnhancedPlanCard 
            key={plan.id} 
            plan={plan} 
            isSelected={selected === plan.id}
            isAnnual={isAnnual}
            onSelect={handlePlanSelect}
          />
        ))}
      </div>

      {/* Selection Confirmation */}
      {selected && (
        <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
          <h3 className="text-xl font-bold text-primary mb-2">
            ✨ Perfect Choice!
          </h3>
          <p className="text-primary/80 mb-3">
            You've selected the <strong>{plans.find(p => p.id === selected)?.name}</strong> plan 
            ({isAnnual ? 'Annual' : 'Monthly'} billing)
          </p>
          <p className="text-sm text-muted-foreground">
            Click Continue below to proceed to your assessment preparation
          </p>
        </div>
      )}

      {/* Trial/Payment Information - Billing Period Specific */}
      <div className="max-w-4xl mx-auto">
        {!isAnnual ? (
          // Monthly Plans - Show Trial Information
          <div className="text-center bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm">
            <h3 className="font-semibold text-blue-900 mb-3 text-lg">
              🎯 How It Works: Assessment → Preview → Subscribe
            </h3>
            <p className="text-sm text-blue-800 leading-relaxed max-w-3xl mx-auto">
              <strong>1. Complete Assessment (Free)</strong> → <strong>2. See Preview Results</strong> → <strong>3. Subscribe for Full Access</strong><br/>
              Monthly plans include a 7-day free trial. Cancel anytime during the trial.
            </p>
          </div>
        ) : (
          // Annual Plans - Show Immediate Access Information
          <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 shadow-sm">
            <h3 className="font-semibold text-green-900 mb-3 text-lg">
              🚀 How It Works: Assessment → Preview → Subscribe & Save
            </h3>
            <p className="text-sm text-green-800 leading-relaxed max-w-3xl mx-auto">
              <strong>1. Complete Assessment (Free)</strong> → <strong>2. See Preview Results</strong> → <strong>3. Subscribe Annually & Save</strong><br/>
              Immediate full access with significant savings. 30-day money-back guarantee.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
