
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Star, Info, Zap, Shield, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

export type PlanType = "basic" | "premium" | "family";

interface Plan {
  id: PlanType;
  name: string;
  description: string;
  price: string;
  trialDays?: number;
  features: string[];
  popular?: boolean;
  icon: React.ElementType;
  highlight?: string;
}

interface PlanStepProps {
  onComplete: (plan: PlanType) => void;
  selectedPlan?: PlanType;
}

export const PlanStep = ({ onComplete, selectedPlan = "basic" }: PlanStepProps) => {
  const [selected, setSelected] = React.useState<PlanType>(selectedPlan);
  const isMobile = useIsMobile();

  const plans: Plan[] = [
    {
      id: "basic",
      name: "Basic",
      description: "Essential features",
      price: "$7.99",
      trialDays: 7,
      icon: Shield,
      features: [
        "Basic symptom tracking",
        "Limited calendar features", 
        "Community forum access",
        "Basic insights"
      ]
    },
    {
      id: "premium",
      name: "Premium", 
      description: "Complete feature set",
      price: "$9.99",
      popular: true,
      icon: Zap,
      highlight: "Most Popular",
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
      name: "Family",
      description: "For families & caregivers",
      price: "$19.99",
      icon: Users,
      features: [
        "All Premium features",
        "Multiple user accounts",
        "Caregiver resources", 
        "24/7 emergency support",
        "Dedicated case manager"
      ]
    }
  ];

  const CompactPlanCard = ({ plan }: { plan: Plan }) => {
    const IconComponent = plan.icon;
    const isSelected = selected === plan.id;
    
    return (
      <div
        className={cn(
          "relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 bg-white",
          "hover:shadow-lg hover:scale-[1.02] hover:border-primary/40",
          isSelected 
            ? "border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg ring-2 ring-primary/20" 
            : "border-gray-200"
        )}
        onClick={() => setSelected(plan.id)}
      >
        {/* Popular Badge */}
        {plan.popular && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white text-xs px-2 py-1 flex items-center gap-1">
              <Star className="h-3 w-3" />
              {plan.highlight}
            </Badge>
          </div>
        )}
        
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-1 shadow-lg z-10">
            <Check className="h-3 w-3" />
          </div>
        )}
        
        {/* Header Section */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              isSelected ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
            )}>
              <IconComponent className="h-4 w-4" />
            </div>
            <div>
              <h4 className={cn(
                "font-semibold text-base leading-tight",
                isSelected && "text-primary"
              )}>
                {plan.name}
              </h4>
              <p className="text-xs text-gray-500 leading-tight">{plan.description}</p>
            </div>
          </div>
          
          {/* Pricing */}
          <div className="text-right">
            <div className={cn(
              "text-xl font-bold leading-tight",
              isSelected && "text-primary"
            )}>
              {plan.price}
              <span className="text-xs font-normal text-gray-500">/mo</span>
            </div>
            {plan.trialDays && (
              <div className="text-xs text-green-600 font-medium">
                {plan.trialDays}d free
              </div>
            )}
          </div>
        </div>
        
        {/* Compact Features */}
        <div className="space-y-1.5 mb-3">
          {plan.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className={cn(
                "h-3 w-3 flex-shrink-0",
                isSelected ? "text-primary" : "text-green-500"
              )} />
              <span className="text-xs text-gray-700 leading-relaxed">{feature}</span>
            </div>
          ))}
          {plan.features.length > 3 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs text-gray-500 cursor-help hover:text-gray-700">
                    +{plan.features.length - 3} more features...
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="space-y-1">
                    {plan.features.slice(3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Check className="h-3 w-3 text-green-500" />
                        <span className="text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {/* Selection Button */}
        <Button
          size="sm"
          variant={isSelected ? "default" : "outline"}
          className={cn(
            "w-full h-8 text-xs font-medium",
            isSelected && "bg-primary hover:bg-primary/90"
          )}
          onClick={(e) => {
            e.stopPropagation();
            setSelected(plan.id);
          }}
        >
          {isSelected ? "Selected" : "Select Plan"}
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Compact Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-2xl font-bold text-gray-900">Choose Your Plan</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-blue-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">You can change your plan anytime after signing up. All plans include core recovery features.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto">
          Select the subscription that best supports your recovery journey
        </p>
      </div>

      {/* Plans Grid - Responsive Layout */}
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-1" : "grid-cols-3 lg:gap-6"
      )}>
        {plans.map((plan) => (
          <CompactPlanCard key={plan.id} plan={plan} />
        ))}
      </div>
      
      {/* Quick Summary & Continue */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Selected:</span>
            <Badge variant="outline" className="capitalize">
              {selected} Plan - {plans.find(p => p.id === selected)?.price}/month
            </Badge>
          </div>
          <Button 
            onClick={() => onComplete(selected)} 
            className="px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
          >
            Continue
          </Button>
        </div>
        <p className="text-xs text-gray-500 text-center">
          • Cancel anytime • 30-day money-back guarantee • Secure payment processing
        </p>
      </div>
    </div>
  );
};
