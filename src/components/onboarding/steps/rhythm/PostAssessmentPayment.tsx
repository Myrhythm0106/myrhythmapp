
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, Lock, Timer, Zap, Crown, Star, CreditCard, Shield, ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostAssessmentPaymentProps {
  onSelectPaymentOption: (option: 'trial' | 'monthly' | 'annual' | 'skip-trial-monthly' | 'skip') => void;
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

  const handleOptionSelect = (option: 'trial' | 'monthly' | 'annual' | 'skip-trial-monthly' | 'skip') => {
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
          Choose Your Access Level
        </h1>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your assessment is complete! Choose how you'd like to access your personalized results and MyRhythm tools.
        </p>
      </div>

      {/* Skip Option - Most Prominent for Testing */}
      <Card className="border-2 border-blue-500 bg-blue-50 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <ArrowRight className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl text-blue-900">🚀 Continue to Results (Recommended for Testing)</CardTitle>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-blue-600">Free Access</div>
            <div className="text-sm text-gray-600">
              Continue to your assessment results immediately
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">✨ What you get:</p>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• Full access to your assessment results</li>
              <li>• Basic MyRhythm tools and features</li>
              <li>• Upgrade to premium anytime later</li>
              <li>• No payment required now</li>
            </ul>
          </div>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4"
            onClick={() => handleOptionSelect('skip')}
            disabled={selectedOption === 'skip'}
          >
            {selectedOption === 'skip' ? 'Continuing...' : '🎯 Continue to Results'}
          </Button>
        </CardContent>
      </Card>

      {/* Premium Trial Option */}
      <Card className="border-2 border-purple-300 bg-purple-50">
        <CardHeader className="text-center pb-4">
          <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
            <Star className="h-6 w-6 text-purple-600" />
          </div>
          <CardTitle className="text-xl text-purple-900">⭐ 7-Day Premium Trial</CardTitle>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-purple-600">£0</div>
            <div className="text-sm text-gray-600">
              Then £{isAnnual ? annualPrice.toFixed(2) : monthlyPrice.toFixed(2)}/month
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-purple-100 p-4 rounded-lg">
            <p className="text-sm text-purple-800 font-medium mb-2">🌟 Premium includes:</p>
            <ul className="space-y-1 text-sm text-purple-700">
              <li>• Advanced assessment insights</li>
              <li>• Personalized action plans</li>
              <li>• Progress tracking tools</li>
              <li>• Premium support</li>
            </ul>
          </div>
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => handleOptionSelect('trial')}
            disabled={selectedOption === 'trial'}
          >
            {selectedOption === 'trial' ? 'Setting up...' : '🚀 Start Premium Trial'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Payment setup required • Cancel anytime during trial
          </p>
        </CardContent>
      </Card>

      {/* Notice about payment setup */}
      <Card className="bg-amber-50 border border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-800 mb-1">Payment Setup Note</p>
              <p className="text-sm text-amber-700">
                If you encounter any payment issues, you can always use the "Continue to Results" option above to access your assessment immediately and set up premium features later.
              </p>
            </div>
          </div>
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
