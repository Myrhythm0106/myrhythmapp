
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, Star, Zap, Shield, ArrowRight, Sparkles, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostAssessmentPaymentProps {
  onSelectPaymentOption: (option: 'trial' | 'monthly' | 'annual' | 'skip-trial-monthly') => void;
  onBack: () => void;
}

export function PostAssessmentPayment({ onSelectPaymentOption, onBack }: PostAssessmentPaymentProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const monthlyPrice = 9.99;
  const annualPrice = 8.33; // $99.99 / 12
  const annualSavings = Math.round(((monthlyPrice - annualPrice) / monthlyPrice) * 100);

  const handleOptionSelect = (option: 'trial' | 'monthly' | 'annual' | 'skip-trial-monthly') => {
    setSelectedOption(option);
    // Small delay for visual feedback
    setTimeout(() => {
      onSelectPaymentOption(option);
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full border border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">Assessment Complete!</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">
          Unlock Your Complete Personalized Plan
        </h1>
        
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-amber-600">
            <Lock className="h-5 w-5" />
            <span className="text-sm font-medium">Premium Access Required</span>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your assessment is complete! Premium access unlocks your full personalized results, 
            action plans, and all the tools you need to build your optimal rhythm.
          </p>
        </div>
      </div>

      {/* Premium Benefits Highlight */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-3 text-center">
            🚀 What Premium Access Unlocks:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Complete assessment analysis & insights</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Personalized action plans & strategies</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Goal templates tailored to your focus area</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Progress tracking & celebration system</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Support circle activation & alerts</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Ongoing guidance & premium support</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
        <span className={cn("text-sm font-medium", !isAnnual ? "text-gray-900" : "text-gray-500")}>
          Monthly
        </span>
        <Switch
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
          className="data-[state=checked]:bg-green-600"
        />
        <span className={cn("text-sm font-medium", isAnnual ? "text-gray-900" : "text-gray-500")}>
          Annual
        </span>
        {isAnnual && (
          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
            Save {annualSavings}%
          </Badge>
        )}
      </div>

      {/* Payment Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Free Trial Option */}
        <Card className={cn(
          "border-2 cursor-pointer transition-all duration-200 hover:shadow-lg",
          selectedOption === 'trial' ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
        )}>
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl text-blue-900">Start Premium Trial</CardTitle>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-blue-600">Free</div>
              <div className="text-sm text-gray-600">7 days, then ${isAnnual ? annualPrice.toFixed(2) : monthlyPrice.toFixed(2)}/{isAnnual ? 'month' : 'month'}</div>
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
              onClick={() => handleOptionSelect('trial')}
              disabled={selectedOption === 'trial'}
            >
              {selectedOption === 'trial' ? 'Processing...' : 'Start Premium Trial'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Cancel anytime during trial • No commitment
            </p>
          </CardContent>
        </Card>

        {/* Pay Now Option */}
        <Card className={cn(
          "border-2 cursor-pointer transition-all duration-200 hover:shadow-lg relative",
          selectedOption === (isAnnual ? 'annual' : 'skip-trial-monthly') ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary"
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
              onClick={() => handleOptionSelect(isAnnual ? 'annual' : 'skip-trial-monthly')}
              disabled={selectedOption === (isAnnual ? 'annual' : 'skip-trial-monthly')}
            >
              {selectedOption === (isAnnual ? 'annual' : 'skip-trial-monthly') ? 'Processing...' : 
               `Get Premium ${isAnnual ? 'Annual' : 'Monthly'}`}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Cancel anytime • Full refund within 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Value Proposition */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-amber-900 mb-2">
            🎯 What happens after you subscribe?
          </h3>
          <p className="text-sm text-amber-800">
            You'll immediately unlock your complete personalized results, get your tailored action plan, 
            and your support circle will be notified to start supporting your journey! 
          </p>
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="text-center pt-4">
        <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-gray-800">
          ← Back to Results Preview
        </Button>
      </div>
    </div>
  );
}
