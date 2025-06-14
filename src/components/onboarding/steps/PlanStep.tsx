
import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlanHeader } from "./plan/PlanHeader";
import { CompactPlanCard } from "./plan/CompactPlanCard";
import { PlanSummary } from "./plan/PlanSummary";
import { plans } from "./plan/plansData";
import { PlanType, PlanStepProps } from "./plan/types";

export type { PlanType };

export const PlanStep = ({ onComplete, selectedPlan = "basic" }: PlanStepProps) => {
  const [selected, setSelected] = React.useState<PlanType>(selectedPlan);
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <PlanHeader />

      {/* Plans Grid - Responsive Layout */}
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-1" : "grid-cols-3 lg:gap-6"
      )}>
        {plans.map((plan) => (
          <CompactPlanCard 
            key={plan.id} 
            plan={plan} 
            isSelected={selected === plan.id}
            onSelect={setSelected}
          />
        ))}
      </div>
      
      <PlanSummary 
        selectedPlan={selected}
        plans={plans}
        onComplete={onComplete}
      />
    </div>
  );
};
