
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
  const regularPrice = isAnnual ? plan.regularAnnualPrice : plan.regularPrice;
  const savings = isAnnual ? plan.monthlySavings : plan.foundingSavings;

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer h-full flex flex-col backdrop-blur-sm bg-white/95",
      "hover:scale-[1.02]",
      isSelected 
        ? "ring-2 ring-neural-indigo-500 shadow-2xl border-neural-indigo-500/50" 
        : "border border-neural-indigo-200 hover:border-neural-indigo-300"
    )}
    onClick={() => onSelect(plan.id)}
    >
      {/* Accent splash */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-memory-emerald-500 rounded-full z-10" />
      
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-neural-purple-500/5 via-neural-indigo-500/5 to-neural-blue-500/5 opacity-50" />
      
      {/* Founding Member Badge - Always visible */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
        <Badge className="bg-gradient-to-r from-burnt-orange-600 to-burnt-orange-700 text-white px-3 py-1 font-medium shadow-lg">
          <Crown className="h-3 w-3 mr-1" />
          Founding Member
        </Badge>
      </div>

      {/* Popular Badge - Secondary position */}
      {plan.popular && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-gradient-to-r from-neural-purple-600 to-neural-indigo-600 text-white px-2 py-1 text-xs font-medium shadow-md">
            {plan.highlight}
          </Badge>
        </div>
      )}

      {/* Savings Badge */}
      {savings && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-green-600 text-white px-2 py-1 font-medium shadow-lg text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            {savings}
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4 flex-shrink-0 relative z-10">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-neural-purple-500/10 via-neural-indigo-500/10 to-neural-blue-500/10 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <Icon className={cn(
            "h-8 w-8 transition-colors duration-300",
            isSelected ? "text-neural-indigo-600" : "text-neural-indigo-500"
          )} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{plan.name}</h3>
          <div className="min-h-[3rem] flex items-center justify-center">
            <p className="text-sm text-gray-600 leading-relaxed text-center px-2">
              {plan.description}
            </p>
          </div>
        </div>
        
        <div className="space-y-3 pt-4">
          {/* Founding Member Price */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-3">
            <div className="text-xs text-amber-900 font-semibold mb-1 text-center">
              Your Founding Member Price
            </div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-bold text-amber-600">
                {currentPrice?.split('/')[0]}
              </span>
              <span className="text-sm text-amber-700 font-medium">
                /{isAnnual ? 'year' : 'month'}
              </span>
            </div>
            {isAnnual && (
              <div className="text-xs text-amber-700 font-medium text-center mt-1">
                Only £{(parseFloat(currentPrice?.replace(/[£,]/g, '') || '0') / 12).toFixed(2)}/month
              </div>
            )}
          </div>

          {/* Regular Price Comparison */}
          {regularPrice && (
            <div className="text-center space-y-1">
              <div className="text-xs text-gray-500">
                Regular Price (after 1,000 users)
              </div>
              <div className="text-lg font-semibold text-gray-400">
                {regularPrice?.split('/')[0]}/{isAnnual ? 'year' : 'month'}
              </div>
              <div className="text-xs font-bold text-green-600">
                🎉 Lock in this rate forever as a Founding Member!
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-grow flex flex-col relative z-10">
        {/* Features List - Consistent Height */}
        <div className="flex-grow">
          <ul className="space-y-2">
            {plan.features.slice(0, 7).map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className={cn(
                  "h-4 w-4 mt-0.5 flex-shrink-0 transition-colors duration-200",
                  isSelected ? "text-memory-emerald-500" : "text-memory-emerald-500"
                )} />
                <span className="text-gray-700 leading-relaxed">{feature}</span>
              </li>
            ))}
            {plan.features.length > 7 && (
              <li className="text-xs text-gray-500 italic">
                + {plan.features.length - 7} more features...
              </li>
            )}
          </ul>
        </div>

        {/* Trial Information - Only for Monthly Plans */}
        {!isAnnual && plan.trialDays && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex-shrink-0">
            <p className="text-xs text-blue-800 font-medium text-center">
              🎯 {plan.trialDays}-day free trial included
            </p>
          </div>
        )}

        {/* Immediate Access for Annual Plans */}
        {isAnnual && (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200 flex-shrink-0">
            <p className="text-xs text-green-800 font-medium text-center">
              🚀 Immediate full access
            </p>
          </div>
        )}

        {/* Select Button - Always at Bottom */}
        <div className="space-y-3 flex-shrink-0">
          <Button 
            className={cn(
              "w-full font-semibold transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105",
              isSelected 
                ? "bg-gradient-to-r from-neural-purple-600 via-neural-indigo-600 to-neural-blue-600 hover:from-neural-purple-700 hover:via-neural-indigo-700 hover:to-neural-blue-700 text-white" 
                : "bg-gradient-to-r from-neural-purple-500 via-neural-indigo-500 to-neural-blue-500 hover:from-neural-purple-600 hover:via-neural-indigo-600 hover:to-neural-blue-600 text-white"
            )}
            disabled={isSelected}
          >
            {isSelected ? 'Selected' : `Choose ${plan.name}`}
          </Button>

          {/* Additional Info */}
          <p className="text-xs text-center text-gray-500">
            {isAnnual ? '30-day money-back guarantee' : 'Cancel anytime during trial'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
