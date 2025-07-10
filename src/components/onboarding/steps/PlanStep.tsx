
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlanHeader } from "./plan/PlanHeader";
import { EnhancedPlanCard } from "./plan/EnhancedPlanCard";
import { plans } from "./plan/plansData";
import { PlanType, PlanStepProps } from "./plan/types";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export type { PlanType };

export const PlanStep = ({ onComplete, selectedPlan = "premium" }: PlanStepProps) => {
  const [selected, setSelected] = useState<PlanType>(selectedPlan);
  const [isAnnual, setIsAnnual] = useState(true); // Default to annual for savings
  const isMobile = useIsMobile();

  const handlePlanSelect = (planId: PlanType) => {
    setSelected(planId);
  };

  // Auto-complete when a plan is selected
  useEffect(() => {
    if (selected) {
      onComplete(selected, isAnnual ? 'annual' : 'monthly');
    }
  }, [selected, isAnnual, onComplete]);

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
            onCheckedChange={setIsAnnual}
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
            Click Next below to proceed to your assessment preparation
          </p>
        </div>
      )}

      {/* Trial/Payment Information - Billing Period Specific */}
      <div className="max-w-4xl mx-auto">
        {!isAnnual ? (
          // Monthly Plans - Show Trial Information
          <div className="text-center bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm">
            <h3 className="font-semibold text-blue-900 mb-3 text-lg">
              🎯 7-Day Free Trial Available
            </h3>
            <p className="text-sm text-blue-800 leading-relaxed max-w-3xl mx-auto">
              <strong>Monthly plans include a 7-day free trial</strong> with full access. 
              Your payment method will be charged after the trial period ends. Cancel anytime during the trial.
            </p>
          </div>
        ) : (
          // Annual Plans - Show Immediate Access Information
          <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 shadow-sm">
            <h3 className="font-semibold text-green-900 mb-3 text-lg">
              🚀 Annual Plans - Immediate Access & Savings
            </h3>
            <p className="text-sm text-green-800 leading-relaxed max-w-3xl mx-auto">
              <strong>Annual plans start immediately</strong> with full access and significant savings. 
              30-day money-back guarantee included for peace of mind.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
