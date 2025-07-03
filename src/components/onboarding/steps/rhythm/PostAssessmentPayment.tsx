
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, Lock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentOptionCard } from "./payment/PaymentOptionCard";

interface PostAssessmentPaymentProps {
  onSelectPaymentOption: (option: 'trial' | 'monthly' | 'annual' | 'skip-trial-monthly') => void;
  onBack: () => void;
}

export function PostAssessmentPayment({ onSelectPaymentOption, onBack }: PostAssessmentPaymentProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isPremiumBenefitsOpen, setIsPremiumBenefitsOpen] = useState(false);

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

      {/* Premium Benefits Highlight - Collapsible */}
      <Collapsible open={isPremiumBenefitsOpen} onOpenChange={setIsPremiumBenefitsOpen}>
        <CollapsibleTrigger asChild>
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-blue-900">
                  🚀 What Premium Access Unlocks
                </h3>
                <ChevronDown 
                  className={`h-5 w-5 text-blue-700 transition-transform ${isPremiumBenefitsOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </CardContent>
          </Card>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 mt-2">
            <CardContent className="p-6 pt-0">
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
        </CollapsibleContent>
      </Collapsible>

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
        <PaymentOptionCard
          type="trial"
          isAnnual={isAnnual}
          monthlyPrice={monthlyPrice}
          annualPrice={annualPrice}
          annualSavings={annualSavings}
          selectedOption={selectedOption}
          onSelect={handleOptionSelect}
        />
        
        <PaymentOptionCard
          type="premium"
          isAnnual={isAnnual}
          monthlyPrice={monthlyPrice}
          annualPrice={annualPrice}
          annualSavings={annualSavings}
          selectedOption={selectedOption}
          onSelect={handleOptionSelect}
        />
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
