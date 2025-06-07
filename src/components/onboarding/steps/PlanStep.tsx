
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Star, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      {/* Info section */}
      <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-5 w-5 text-blue-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Choose the plan that best fits your needs. You can change your plan at any time after signing up.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div>
          <h3 className="font-medium text-blue-900">Choose Your Plan</h3>
          <p className="text-sm text-blue-700">Select the subscription plan that best supports your recovery journey.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg",
              selected === plan.id 
                ? "border-primary bg-primary/5 shadow-xl ring-2 ring-primary/20 transform scale-105" 
                : "border-gray-200 hover:border-primary/30"
            )}
            onClick={() => handleSelectPlan(plan.id)}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <Star className="h-3 w-3" />
                POPULAR
              </span>
            )}
            
            {selected === plan.id && (
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                <Check className="h-4 w-4" />
              </div>
            )}
            
            <div className="text-center mb-4">
              <h3 className={cn(
                "font-bold text-xl mb-2",
                selected === plan.id && "text-primary"
              )}>
                {plan.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
              
              <div className={cn(
                "text-3xl font-bold mb-1",
                selected === plan.id && "text-primary"
              )}>
                {plan.price}
                <span className="text-base font-normal text-muted-foreground">/month</span>
              </div>
              {plan.trialDays && (
                <div className="text-sm text-green-600 font-medium">Free for {plan.trialDays} days</div>
              )}
            </div>
            
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className={cn(
                    "h-4 w-4 flex-shrink-0 mt-0.5",
                    selected === plan.id ? "text-primary" : "text-green-500"
                  )} />
                  <span className="text-sm leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
            
            {selected === plan.id && (
              <div className="bg-primary text-primary-foreground px-4 py-3 rounded-lg text-center font-medium text-sm">
                ✓ Selected Plan
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-center pt-4">
        <Button 
          onClick={() => onComplete(selected)} 
          size="lg"
          className="px-8 py-3 bg-primary hover:bg-primary/90"
        >
          Continue with {selected === 'basic' ? 'Basic' : selected === 'premium' ? 'Premium' : 'Family'} Plan
        </Button>
      </div>
    </div>
  );
};
