
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, Lock, ChevronDown, Star, Crown, Timer, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentOptionCard } from "./payment/PaymentOptionCard";

interface PostAssessmentPaymentProps {
  onSelectPaymentOption: (option: 'trial' | 'monthly' | 'annual' | 'skip-trial-monthly') => void;
  onBack: () => void;
}

export function PostAssessmentPayment({ onSelectPaymentOption, onBack }: PostAssessmentPaymentProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isPremiumBenefitsOpen, setIsPremiumBenefitsOpen] = useState(true); // Default to open

  // UK pricing in GBP
  const monthlyPrice = 9.99;
  const annualPrice = 7.99; // £95.88 / 12 = £7.99 per month
  const annualTotal = 95.88;
  const annualSavings = Math.round(((monthlyPrice * 12 - annualTotal) / (monthlyPrice * 12)) * 100);

  const handleOptionSelect = (option: 'trial' | 'monthly' | 'annual' | 'skip-trial-monthly') => {
    console.log("Processing payment option:", option);
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
          Choose Your Premium Plan
        </h1>
        
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-amber-600">
            <Crown className="h-5 w-5" />
            <span className="text-sm font-medium">Premium Access Required for Full Results</span>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your assessment is complete! Choose your plan to unlock your complete personalized results, 
            action plans, and all the tools you need to build your optimal rhythm.
          </p>
        </div>
      </div>

      {/* Limited Time Offer Banner */}
      <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Timer className="h-6 w-6 animate-pulse" />
              <div>
                <p className="font-bold text-lg">⚡ LIMITED TIME OFFER ⚡</p>
                <p className="text-sm opacity-90">Get 20% OFF Premium - Complete assessment today!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">Save £23.98/year</p>
              <p className="text-xs opacity-75">With annual plan</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Benefits Highlight - Always Open */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-4 text-center">
            🚀 What Premium Access Unlocks
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
      <div className="flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
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
          <Badge className="bg-green-600 text-white font-medium px-2 py-1 text-xs ml-2">
            Save {annualSavings}% (£{(monthlyPrice * 12 - annualTotal).toFixed(2)}/year)
          </Badge>
        )}
      </div>

      {/* Payment Options */}
      <div className="space-y-6">
        {/* Trial Option */}
        <Card className="border-2 border-blue-500 bg-blue-50 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl text-blue-900">7-Day Free Trial</CardTitle>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-blue-600">£0</div>
              <div className="text-sm text-gray-600">
                Then £{isAnnual ? annualPrice.toFixed(2) : monthlyPrice.toFixed(2)}/month
              </div>
              {isAnnual && (
                <div className="text-xs text-green-600 font-medium">
                  Billed annually (£{annualTotal}/year)
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <p className="text-xs text-blue-800 font-medium mb-1">✨ Trial includes full premium access:</p>
              <ul className="space-y-1 text-xs text-blue-700">
                <li>• Your complete personalized results</li>
                <li>• All action plans & goal templates</li>
                <li>• Full app access for 7 days</li>
                <li>• Cancel anytime during trial</li>
              </ul>
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-3"
              onClick={() => handleOptionSelect('trial')}
              disabled={selectedOption === 'trial'}
            >
              {selectedOption === 'trial' ? 'Processing...' : 'Start 7-Day Free Trial'}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              No payment required • Cancel anytime • Full access
            </p>
          </CardContent>
        </Card>

        {/* Direct Payment Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Plan */}
          <Card className="border-2 border-gray-200 hover:border-purple-300 transition-colors">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl text-purple-900">Monthly Plan</CardTitle>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-purple-600">£{monthlyPrice}</div>
                <div className="text-sm text-gray-600">per month</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-xs text-purple-800 font-medium mb-1">🚀 Immediate premium access:</p>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>• Complete personalized assessment results</li>
                  <li>• Tailored action plans & goal templates</li>
                  <li>• Support circle activation</li>
                  <li>• Cancel anytime</li>
                </ul>
              </div>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => handleOptionSelect('skip-trial-monthly')}
                disabled={selectedOption === 'skip-trial-monthly'}
              >
                {selectedOption === 'skip-trial-monthly' ? 'Processing...' : 'Get Monthly Plan'}
              </Button>
            </CardContent>
          </Card>

          {/* Annual Plan */}
          <Card className="border-2 border-green-500 bg-green-50 shadow-lg relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1">
                <Star className="h-3 w-3 mr-1" />
                Best Value - Save {annualSavings}%
              </Badge>
            </div>
            <CardHeader className="text-center pb-4 pt-6">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Crown className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl text-green-900">Annual Plan</CardTitle>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-green-600">£{annualPrice}</div>
                <div className="text-sm text-gray-600">per month (billed annually)</div>
                <div className="text-xs text-green-600 font-medium">
                  Save £{(monthlyPrice * 12 - annualTotal).toFixed(2)} per year!
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <p className="text-xs text-green-800 font-medium mb-1">🎯 Everything in Monthly plus:</p>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>• 2 months completely FREE</li>
                  <li>• Priority customer support</li>
                  <li>• Advanced progress analytics</li>
                  <li>• 30-day money-back guarantee</li>
                </ul>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold"
                onClick={() => handleOptionSelect('annual')}
                disabled={selectedOption === 'annual'}
              >
                {selectedOption === 'annual' ? 'Processing...' : `Get Annual Plan - £${annualTotal}/year`}
              </Button>
            </CardContent>
          </Card>
        </div>
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
