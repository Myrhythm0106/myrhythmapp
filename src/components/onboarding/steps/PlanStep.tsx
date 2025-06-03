
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
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
              "relative border-2 rounded-lg p-5 cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
              selected === plan.id 
                ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20 transform scale-105" 
                : "border-border"
            )}
            onClick={() => handleSelectPlan(plan.id)}
          >
            {plan.popular && (
              <span className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <Star className="h-3 w-3" />
                POPULAR
              </span>
            )}
            
            {selected === plan.id && (
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            )}
            
            <h3 className={cn(
              "font-semibold text-lg",
              selected === plan.id && "text-primary"
            )}>
              {plan.name}
            </h3>
            <p className="text-muted-foreground text-sm">{plan.description}</p>
            
            <div className="mt-4">
              <div className={cn(
                "text-2xl font-bold",
                selected === plan.id && "text-primary"
              )}>
                {plan.price}
                <span className="text-base font-normal text-muted-foreground">/month</span>
              </div>
              {plan.trialDays && (
                <div className="text-sm text-muted-foreground">Free for {plan.trialDays} days</div>
              )}
            </div>
            
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className={cn(
                    "h-4 w-4 flex-shrink-0",
                    selected === plan.id ? "text-primary" : "text-green-500"
                  )} />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            {selected === plan.id && (
              <div className="mt-4 bg-primary text-primary-foreground px-3 py-2 rounded-md text-center font-medium text-sm">
                ✓ Selected Plan
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button onClick={() => onComplete(selected)} className="gap-2 bg-primary hover:bg-primary/90">
          Continue with {selected === 'basic' ? 'Basic' : selected === 'premium' ? 'Premium' : 'Family'} Plan
        </Button>
      </div>
    </div>
  );
};
