
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type PlanType = "basic" | "premium" | "family";

interface Plan {
  id: PlanType;
  name: string;
  description: string;
  price: string;
  trialDays?: number;
  features: string[];
  popular?: boolean;
}

interface PlanStepProps {
  onComplete: (plan: PlanType) => void;
  selectedPlan?: PlanType;
}

export const PlanStep = ({ onComplete, selectedPlan = "basic" }: PlanStepProps) => {
  const [selected, setSelected] = React.useState<PlanType>(selectedPlan);

  const plans: Plan[] = [
    {
      id: "basic",
      name: "Basic Plan",
      description: "Essential features",
      price: "$7.99",
      trialDays: 7,
      features: [
        "Basic symptom tracking",
        "Limited calendar features",
        "Community forum access"
      ]
    },
    {
      id: "premium",
      name: "Premium Plan",
      description: "Enhanced features",
      price: "$9.99",
      popular: true,
      features: [
        "Advanced symptom tracking",
        "Full calendar management",
        "Complete resource library",
        "Personalized insights"
      ]
    },
    {
      id: "family",
      name: "Family Plan",
      description: "Support for caregivers",
      price: "$19.99",
      features: [
        "All Premium features",
        "Multiple user accounts",
        "Caregiver resources",
        "24/7 emergency support"
      ]
    }
  ];

  const handleSelectPlan = (plan: PlanType) => {
    setSelected(plan);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative border-2 rounded-lg p-5 cursor-pointer transition-all hover:border-primary/50",
              selected === plan.id ? "border-primary shadow-sm" : "border-border"
            )}
            onClick={() => handleSelectPlan(plan.id)}
          >
            {plan.popular && (
              <span className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                POPULAR
              </span>
            )}
            
            <h3 className="font-semibold text-lg">{plan.name}</h3>
            <p className="text-muted-foreground text-sm">{plan.description}</p>
            
            <div className="mt-4">
              <div className="text-2xl font-bold">{plan.price}<span className="text-base font-normal text-muted-foreground">/month</span></div>
              {plan.trialDays && (
                <div className="text-sm text-muted-foreground">Free for {plan.trialDays} days</div>
              )}
            </div>
            
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            {selected === plan.id && (
              <div className="mt-4 text-primary font-medium">Selected</div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button onClick={() => onComplete(selected)} className="gap-2">
          Continue with {selected === 'basic' ? 'Basic' : selected === 'premium' ? 'Premium' : 'Family'} Plan
        </Button>
      </div>
    </div>
  );
};
