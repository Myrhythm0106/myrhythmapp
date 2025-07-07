
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Plan, PlanType } from "./types";

interface EnhancedPlanCardProps {
  plan: Plan;
  isSelected: boolean;
  isAnnual: boolean;
  onSelect: (planId: PlanType) => void;
}

export function EnhancedPlanCard({ plan, isSelected, isAnnual, onSelect }: EnhancedPlanCardProps) {
  const Icon = plan.icon;
  const currentPrice = isAnnual ? plan.annualPrice : plan.price;
  const savings = isAnnual ? plan.monthlySavings : null;

  return (
    <Card className={cn(
      "relative border-2 transition-all duration-200 hover:shadow-lg cursor-pointer",
      isSelected ? "border-primary bg-primary/5 shadow-lg" : "border-gray-200 hover:border-primary/50",
      plan.popular && "ring-2 ring-primary/20"
    )}
    onClick={() => onSelect(plan.id)}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-white px-4 py-1 font-medium">
            <Crown className="h-3 w-3 mr-1" />
            {plan.highlight}
          </Badge>
        </div>
      )}

      {/* Annual Savings Badge */}
      {isAnnual && savings && (
        <div className="absolute -top-3 -right-3">
          <Badge className="bg-green-600 text-white px-3 py-1 font-medium shadow-lg">
            <Sparkles className="h-3 w-3 mr-1" />
            {savings}
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-primary">
            {currentPrice?.split('/')[0]}
          </div>
          <div className="text-sm text-gray-500">
            {isAnnual ? 'per year' : 'per month'}
          </div>
          {isAnnual && (
            <div className="text-xs text-green-600 font-medium">
              Equivalent to {(parseFloat(currentPrice?.replace(/[£,]/g, '') || '0') / 12).toFixed(2)} per month
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Features List */}
        <ul className="space-y-2">
          {plan.features.slice(0, 7).map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
          {plan.features.length > 7 && (
            <li className="text-xs text-gray-500 italic">
              + {plan.features.length - 7} more features...
            </li>
          )}
        </ul>

        {/* Trial Information */}
        {!isAnnual && plan.trialDays && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 font-medium">
              🎯 {plan.trialDays}-day free trial included
            </p>
          </div>
        )}

        {/* Select Button */}
        <Button 
          className={cn(
            "w-full font-medium transition-all",
            isSelected 
              ? "bg-primary hover:bg-primary/90" 
              : "bg-gray-900 hover:bg-gray-800"
          )}
          disabled={isSelected}
        >
          {isSelected ? 'Selected' : `Choose ${plan.name}`}
        </Button>

        {/* Additional Info */}
        <p className="text-xs text-center text-gray-500">
          {isAnnual ? '30-day money-back guarantee' : 'Cancel anytime during trial'}
        </p>
      </CardContent>
    </Card>
  );
}
