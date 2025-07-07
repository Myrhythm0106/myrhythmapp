
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, Lock, Timer, Zap, Crown, Star, CreditCard, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostAssessmentPaymentProps {
  onSelectPaymentOption: (option: 'trial' | 'monthly' | 'annual' | 'skip-trial-monthly') => void;
  onBack: () => void;
}

export function PostAssessmentPayment({ onSelectPaymentOption, onBack }: PostAssessmentPaymentProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // UK pricing in GBP
  const monthlyPrice = 9.99;
  const annualPrice = 7.99; // £95.88 / 12 = £7.99 per month
  const annualTotal = 95.88;
  const annualSavings = Math.round(((monthlyPrice * 12 - annualTotal) / (monthlyPrice * 12)) * 100);

  const handleOptionSelect = (option: 'trial' | 'monthly' | 'annual' | 'skip-trial-monthly') => {
    console.log("User selected payment option:", option);
    setSelectedOption(option);
    
    // Show immediate processing state
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

      {/* Important Notice about Card Details */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="h-6 w-6" />
            <h3 className="font-bold text-xl">💳 Card Details Required for All Options</h3>
          </div>
          <div className="space-y-2">
            <p className="text-lg">Even for the free trial, we need your payment details to:</p>
            <ul className="list-disc list-inside space-y-1 text-sm opacity-90 ml-4">
              <li>Automatically continue your service after the trial period</li>
              <li>Provide uninterrupted access to your personalized results</li>
              <li>Ensure seamless transition to your chosen plan</li>
            </ul>
            <div className="flex items-center gap-2 mt-3 p-3 bg-white/20 rounded-lg">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Your payment details are secured by Stripe - we never store your card information</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Benefits Highlight */}
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
        {/* Trial Option - Most Prominent */}
        <Card className="border-2 border-blue-500 bg-blue-50 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl text-blue-900">🎯 7-Day Free Trial (Most Popular)</CardTitle>
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
            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-sm text-blue-800 font-medium mb-2">✨ What happens next:</p>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Enter your card details securely via Stripe</li>
                <li>• Get immediate access to all premium features</li>
                <li>• £0 charge for 7 days - full access to everything</li>
                <li>• Automatic billing starts after trial ends</li>
                <li>• Cancel anytime during trial - no charges</li>
              </ul>
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4"
              onClick={() => handleOptionSelect('trial')}
              disabled={selectedOption === 'trial'}
            >
              {selectedOption === 'trial' ? 'Redirecting to Payment...' : '🚀 Start 7-Day Free Trial'}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Card details required • Cancel anytime • Full premium access
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
                  <li>• Charged immediately via Stripe</li>
                </ul>
              </div>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => handleOptionSelect('skip-trial-monthly')}
                disabled={selectedOption === 'skip-trial-monthly'}
              >
                {selectedOption === 'skip-trial-monthly' ? 'Redirecting...' : 'Get Monthly Plan'}
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
                  <li>• One-time payment of £{annualTotal}</li>
                </ul>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold"
                onClick={() => handleOptionSelect('annual')}
                disabled={selectedOption === 'annual'}
              >
                {selectedOption === 'annual' ? 'Redirecting...' : `Pay £${annualTotal} Now (Annual)`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Security Notice */}
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-800">🔒 Secure Payment Process</h3>
          </div>
          <p className="text-sm text-gray-600">
            All payments are processed securely through Stripe. Your card details are never stored on our servers. 
            You'll be redirected to Stripe's secure payment page to complete your purchase.
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
