
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Zap, Shield, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentOptionCardProps {
  type: 'trial' | 'premium';
  isAnnual: boolean;
  monthlyPrice: number;
  annualPrice: number;
  annualSavings: number;
  selectedOption: string | null;
  onSelect: (option: 'trial' | 'monthly' | 'annual' | 'skip-trial-monthly') => void;
}

export function PaymentOptionCard({ 
  type, 
  isAnnual, 
  monthlyPrice, 
  annualPrice, 
  annualSavings, 
  selectedOption, 
  onSelect 
}: PaymentOptionCardProps) {
  if (type === 'trial') {
    const isSelected = selectedOption === 'trial';
    
    return (
      <Card className={cn(
        "border-2 cursor-pointer transition-all duration-200 hover:shadow-lg",
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
      )}>
        <CardHeader className="text-center pb-4">
          <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl text-blue-900">Start Premium Trial</CardTitle>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-blue-600">Free</div>
            <div className="text-sm text-gray-600">
              7 days, then ${isAnnual ? annualPrice.toFixed(2) : monthlyPrice.toFixed(2)}/{isAnnual ? 'month' : 'month'}
            </div>
            {isAnnual && (
              <div className="text-xs text-green-600 font-medium">
                Billed annually (${(annualPrice * 12).toFixed(0)}/year)
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-1">✨ Trial includes full premium access:</p>
            <ul className="space-y-1 text-xs text-blue-700">
              <li>• Your complete personalized results</li>
              <li>• All action plans & goal templates</li>
              <li>• Full app access for 7 days</li>
            </ul>
          </div>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => onSelect('trial')}
            disabled={isSelected}
          >
            {isSelected ? 'Processing...' : 'Start Premium Trial'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <p className="text-xs text-gray-500 text-center">
            Cancel anytime during trial • No commitment
          </p>
        </CardContent>
      </Card>
    );
  }

  // Premium card
  const currentOption = isAnnual ? 'annual' : 'skip-trial-monthly';
  const isSelected = selectedOption === currentOption;
  
  return (
    <Card className={cn(
      "border-2 cursor-pointer transition-all duration-200 hover:shadow-lg relative",
      isSelected ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary"
    )}>
      {isAnnual && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1">
            <Star className="h-3 w-3 mr-1" />
            Best Value
          </Badge>
        </div>
      )}
      <CardHeader className="text-center pb-4">
        <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-2">
          <Zap className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl text-primary">
          {isAnnual ? 'Premium Annual' : 'Premium Monthly'}
        </CardTitle>
        <div className="space-y-1">
          <div className="text-3xl font-bold text-primary">
            ${isAnnual ? annualPrice.toFixed(2) : monthlyPrice.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">
            per month{isAnnual ? ' (billed annually)' : ''}
          </div>
          {isAnnual && (
            <div className="text-xs text-green-600 font-medium">
              Save ${((monthlyPrice - annualPrice) * 12).toFixed(0)} per year!
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-primary/5 p-3 rounded-lg">
          <p className="text-xs text-primary font-medium mb-1">🚀 Immediate premium access includes:</p>
          <ul className="space-y-1 text-xs text-gray-600">
            <li>• Complete personalized assessment results</li>
            <li>• Tailored action plans & goal templates</li>
            <li>• Support circle activation</li>
            {isAnnual && (
              <li className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-yellow-500" />
                <span className="font-medium text-green-700">2 months free!</span>
              </li>
            )}
          </ul>
        </div>
        <Button 
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
          onClick={() => onSelect(currentOption)}
          disabled={isSelected}
        >
          {isSelected ? 'Processing...' : `Get Premium ${isAnnual ? 'Annual' : 'Monthly'}`}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
        <p className="text-xs text-gray-500 text-center">
          Cancel anytime • Full refund within 30 days
        </p>
      </CardContent>
    </Card>
  );
}
