
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
      description: "Essential features for getting started",
      price: "$7.99",
      trialDays: 7,
      features: [
        "Basic symptom tracking",
        "Limited calendar features", 
        "Community forum access",
        "Basic insights"
      ]
    },
    {
      id: "premium",
      name: "Premium Plan", 
      description: "Complete feature set for optimal recovery",
      price: "$9.99",
      popular: true,
      features: [
        "Advanced symptom tracking",
        "Full calendar management",
        "Complete resource library",
        "Personalized insights",
        "Priority support"
      ]
    },
    {
      id: "family",
      name: "Family Plan",
      description: "Comprehensive support for families & caregivers",
      price: "$19.99",
      features: [
        "All Premium features",
        "Multiple user accounts",
        "Caregiver resources", 
        "24/7 emergency support",
        "Dedicated case manager"
      ]
    }
  ];

  const handleSelectPlan = (plan: PlanType) => {
    setSelected(plan);
  };

  return (
    <div className="space-y-4">
      {/* Compact header with integrated info */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-xl font-semibold text-gray-900">Choose Your Plan</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-blue-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Choose the plan that best fits your needs. You can change your plan at any time after signing up.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground">Select the subscription that best supports your recovery journey</p>
      </div>

      {/* Compact horizontal plan cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200",
              "hover:shadow-md hover:scale-[1.02]",
              selected === plan.id 
                ? "border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg ring-1 ring-primary/20" 
                : "border-gray-200 bg-white hover:border-primary/30"
            )}
            onClick={() => handleSelectPlan(plan.id)}
          >
            {/* Popular badge */}
            {plan.popular && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-primary to-primary/80 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 shadow-sm">
                  <Star className="h-3 w-3" />
                  POPULAR
                </span>
              </div>
            )}
            
            {/* Selected indicator */}
            {selected === plan.id && (
              <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-1 shadow-md">
                <Check className="h-3 w-3" />
              </div>
            )}
            
            {/* Plan header - compact */}
            <div className="text-center mb-3 pt-2">
              <h4 className={cn(
                "font-semibold text-lg mb-1",
                selected === plan.id && "text-primary"
              )}>
                {plan.name}
              </h4>
              <p className="text-xs text-muted-foreground mb-2">{plan.description}</p>
              
              {/* Pricing - more compact */}
              <div className="space-y-1">
                <div className={cn(
                  "text-2xl font-bold",
                  selected === plan.id && "text-primary"
                )}>
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </div>
                {plan.trialDays && (
                  <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                    Free for {plan.trialDays} days
                  </div>
                )}
              </div>
            </div>
            
            {/* Compact features list */}
            <ul className="space-y-1.5 mb-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className={cn(
                    "h-3 w-3 flex-shrink-0 mt-0.5",
                    selected === plan.id ? "text-primary" : "text-green-500"
                  )} />
                  <span className="text-xs leading-relaxed text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            {/* Selection indicator */}
            {selected === plan.id ? (
              <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-3 py-2 rounded text-center font-medium text-xs">
                ✓ Selected Plan
              </div>
            ) : (
              <div className="border border-gray-200 text-gray-500 px-3 py-2 rounded text-center text-xs">
                Select Plan
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Compact continue button */}
      <div className="flex justify-center pt-3">
        <Button 
          onClick={() => onComplete(selected)} 
          className="px-6 py-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm"
        >
          Continue with {selected === 'basic' ? 'Basic' : selected === 'premium' ? 'Premium' : 'Family'} Plan
        </Button>
      </div>
    </div>
  );
};
