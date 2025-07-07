
import React, { useState } from "react";
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
    // Automatically complete the plan selection after a brief delay for visual feedback
    setTimeout(() => {
      onComplete(planId, isAnnual ? 'annual' : 'monthly');
    }, 300);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PlanHeader />

      {/* Billing Toggle - Prominently Featured */}
      <div className="flex items-center justify-center gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <span className={cn("text-base font-medium", !isAnnual ? "text-gray-900" : "text-gray-500")}>
          Monthly
        </span>
        <Switch
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
          className="data-[state=checked]:bg-green-600"
        />
        <span className={cn("text-base font-medium", isAnnual ? "text-gray-900" : "text-gray-500")}>
          Annual
        </span>
        {isAnnual && (
          <Badge className="bg-green-600 text-white font-medium px-3 py-1">
            Save up to £47.98/year
          </Badge>
        )}
      </div>

      {/* Plans Grid - Responsive Layout */}
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

      {/* Free Trial Information */}
      <div className="text-center bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">
          🎯 {isAnnual ? 'Annual Plans' : '7-Day Free Trial Available'}
        </h3>
        <p className="text-sm text-blue-800 max-w-3xl mx-auto">
          {isAnnual ? (
            <>
              <strong>Annual plans start immediately</strong> with full access and significant savings. 
              30-day money-back guarantee included for peace of mind.
            </>
          ) : (
            <>
              <strong>Monthly plans include a 7-day free trial</strong> with full access. 
              Your payment method will be charged after the trial period ends. Cancel anytime during the trial.
            </>
          )}
        </p>
      </div>
    </div>
  );
};
