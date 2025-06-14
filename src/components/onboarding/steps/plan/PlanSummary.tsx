
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plan, PlanType } from "./types";

interface PlanSummaryProps {
  selectedPlan: PlanType;
  plans: Plan[];
  onComplete: (plan: PlanType) => void;
}

export function PlanSummary({ selectedPlan, plans, onComplete }: PlanSummaryProps) {
  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Selected:</span>
          <Badge variant="outline" className="capitalize">
            {selectedPlan} Plan - {selectedPlanData?.price}/month
          </Badge>
        </div>
        <Button 
          onClick={() => onComplete(selectedPlan)} 
          className="px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
        >
          Continue
        </Button>
      </div>
      <p className="text-xs text-gray-500 text-center">
        • Cancel anytime • 30-day money-back guarantee • Secure payment processing
      </p>
    </div>
  );
}
