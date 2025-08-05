
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlanHeader } from "./plan/PlanHeader";
import { EnhancedPlanCard } from "./plan/EnhancedPlanCard";
import { plans } from "./plan/plansData";
import { PlanType, PlanStepProps } from "./plan/types";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PaymentDetailsForm } from "@/components/payment/PaymentDetailsForm";
import { LifeEmpowermentGuide } from "../LifeEmpowermentGuide";
import { useSubscription } from "@/contexts/SubscriptionContext";

export type { PlanType };

export const PlanStep = ({ onComplete, selectedPlan = "premium" }: PlanStepProps) => {
  const [selected, setSelected] = useState<PlanType | null>(null);
  const [isAnnual, setIsAnnual] = useState(true); // Default to annual for savings
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const isMobile = useIsMobile();
  const { updateSubscription } = useSubscription();

  const handlePlanSelect = (planId: PlanType) => {
    console.log("PlanStep: Plan selected:", planId);
    setSelected(planId);
    
    // For free assessment preview, skip payment entirely
    if (planId === 'preview' as any) {
      console.log("PlanStep: Free assessment selected, skipping payment");
      onComplete(planId, 'monthly'); // Use 'monthly' as default billing period
      return;
    }
    
    setShowPaymentForm(true);
  };

  const handleBillingChange = (annual: boolean) => {
    setIsAnnual(annual);
  };

  const handlePaymentComplete = (paymentDetails: any) => {
    console.log("PlanStep: Payment completed for plan:", selected);
    
    // Update subscription status based on selected plan
    if (selected) {
      const subscriptionTier = selected === 'basic' ? 'premium' : selected === 'premium' ? 'premium' : 'family';
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4">
      <PlanHeader />

      {/* Billing Toggle - Centered and Prominent */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm">
          <span className={cn(
            "text-sm font-medium transition-colors",
            !isAnnual ? "text-gray-900" : "text-gray-500"
          )}>
            Monthly
          </span>
          <Switch
            checked={isAnnual}
            onCheckedChange={handleBillingChange}
            className="data-[state=checked]:bg-green-600"
          />
          <span className={cn(
            "text-sm font-medium transition-colors",
            isAnnual ? "text-gray-900" : "text-gray-500"
          )}>
            Annual
          </span>
          {isAnnual && (
            <Badge className="bg-green-600 text-white font-medium px-2 py-1 text-xs ml-2">
              Save up to £47.98/year
            </Badge>
          )}
        </div>
      </div>

      {/* Experience First Option */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-blue-900">
            🌟 Try Before You Subscribe
          </h3>
          <p className="text-blue-700 max-w-2xl mx-auto">
            <strong>Assessment First, Payment Later:</strong> Complete your personalized MYRHYTHM assessment and see preview results before choosing a subscription plan.
          </p>
          <button 
            onClick={() => handlePlanSelect('preview' as PlanType)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Start Free Assessment Preview
          </button>
        </div>
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
