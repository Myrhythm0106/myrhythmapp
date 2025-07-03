
import React from "react";
import { Check, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Plan, PlanType } from "./types";

interface CompactPlanCardProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: (planId: PlanType) => void;
}

export function CompactPlanCard({ plan, isSelected, onSelect }: CompactPlanCardProps) {
  const IconComponent = plan.icon;
  
  return (
    <div
      className={cn(
        "relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 bg-white",
        "hover:shadow-lg hover:scale-[1.02] hover:border-primary/40",
        isSelected 
          ? "border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg ring-2 ring-primary/20 scale-[1.02]" 
          : "border-gray-200"
      )}
      onClick={() => onSelect(plan.id)}
    >
      {/* Popular Badge - positioned in top-right corner */}
      {plan.popular && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white text-xs px-2 py-1 flex items-center gap-1 shadow-lg">
            <Star className="h-3 w-3" />
            {plan.highlight}
          </Badge>
        </div>
      )}
      
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 shadow-lg z-20">
          <Check className="h-3 w-3" />
        </div>
      )}
      
      {/* Header Section - icon and title only */}
      <div className="flex items-start gap-2 mb-3">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
          isSelected ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
        )}>
          <IconComponent className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "font-semibold text-base leading-tight",
            isSelected && "text-primary"
          )}>
            {plan.name}
          </h4>
          <p className="text-xs text-gray-500 leading-tight">{plan.description}</p>
        </div>
      </div>

      {/* Pricing Section - always below header */}
      <div className="flex justify-between items-center mb-3">
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
      
      {/* Compact Features */}
      <div className="space-y-1.5">
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
      
      {/* Selected state indicator */}
      {isSelected && (
        <div className="mt-3 text-center">
          <div className="text-xs font-medium text-primary">
            ✓ Plan Selected - Proceeding...
          </div>
        </div>
      )}
    </div>
  );
}
