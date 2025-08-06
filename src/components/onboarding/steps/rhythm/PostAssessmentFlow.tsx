import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssessmentResult, createPreviewResult } from "@/utils/rhythmAnalysis";
import { TeaserInsightsGrid } from "./preview/TeaserInsightsGrid";
import { PaymentCallToAction } from "./preview/PaymentCallToAction";
import { UserType } from "@/types/user";
import { Lock, Crown, Sparkles, CheckCircle, Star } from "lucide-react";

interface PostAssessmentFlowProps {
  assessmentResult: AssessmentResult;
  onComplete: () => void;
  userType?: UserType | null;
  onPaymentRequired: () => void;
}

export function PostAssessmentFlow({ 
  assessmentResult, 
  onComplete, 
  userType,
  onPaymentRequired 
}: PostAssessmentFlowProps) {
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<'trial' | 'monthly' | 'annual' | 'skip' | null>(null);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Ensure we have a properly formatted result
  const result = assessmentResult.planType ? assessmentResult : createPreviewResult(assessmentResult);
  
  // Check if this is a free assessment (limited results)
  const isFreeAssessment = !result.planType || result.planType === 'preview';

  const handlePaymentSelect = async (option: 'trial' | 'monthly' | 'annual' | 'skip') => {
    setSelectedPaymentOption(option);

    if (option === 'skip') {
      // Show limited results and continue
      onComplete();
      return;
    }

    // For paid options, show email verification first
    setShowEmailVerification(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !isValidEmail(email)) return;

    setIsVerifying(true);
    
    // Simulate email verification process
    setTimeout(() => {
      setIsVerifying(false);
      // Redirect to payment processing
      onPaymentRequired();
    }, 2000);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && 
           !isDisposableEmail(email);
  };

  const isDisposableEmail = (email: string) => {
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 
      'mailinator.com', 'temp-mail.org'
    ];
    const domain = email.split('@')[1]?.toLowerCase();
    return disposableDomains.includes(domain);
  };

  if (showEmailVerification) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-2 border-teal-300 bg-gradient-to-br from-teal-50 to-emerald-50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-teal-900">
              Verify Your Email to Continue
            </CardTitle>
            <p className="text-teal-700">
              We'll send your complete results and start your {selectedPaymentOption} plan
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-teal-800 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-teal-200 rounded-lg focus:border-teal-500 focus:outline-none"
                  required
                />
                {email && !isValidEmail(email) && (
                  <p className="text-red-600 text-sm mt-1">
                    Please enter a valid email address (temporary emails not allowed)
                  </p>
                )}
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                disabled={!isValidEmail(email) || isVerifying}
              >
                {isVerifying ? 'Verifying...' : `Start ${selectedPaymentOption} Plan`}
                <Crown className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Results Header */}
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2">
          <CheckCircle className="h-4 w-4 mr-2" />
          Assessment Complete
        </Badge>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
          Your Personalized Results
        </h1>
        {isFreeAssessment ? (
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We've analyzed your responses and prepared your cognitive wellness insights. 
            Upgrade to unlock your complete personalized journey.
          </p>
        ) : (
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Congratulations! Here's your complete personalized cognitive wellness plan.
          </p>
        )}
      </div>

      {/* Free Preview: Basic Insight */}
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Star className="h-6 w-6 text-emerald-600" />
            Your Primary Strength: {result.primaryStrength}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-emerald-700 text-lg mb-4">
            {result.basicInsight}
          </p>
          <div className="bg-emerald-100 p-4 rounded-lg">
            <p className="text-emerald-800 font-medium mb-2">Quick Win for Today:</p>
            <p className="text-emerald-700">
              {result.quickWin}
            </p>
          </div>
        </CardContent>
      </Card>

      {isFreeAssessment ? (
        <>
          {/* Premium Features Preview */}
          <TeaserInsightsGrid assessmentResult={result} />
          
          {/* Payment Call to Action */}
          <div data-payment-section>
            <PaymentCallToAction onPaymentSelect={handlePaymentSelect} />
          </div>
        </>
      ) : (
        <>
          {/* Full Results - Complete Insights Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.detailedInsights?.map((insight, index) => (
              <Card key={index} className="border-2 border-teal-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-teal-800">{insight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-3">{insight.description}</p>
                  <div className="bg-teal-50 p-3 rounded-lg">
                    <p className="text-teal-800 font-medium text-sm">{insight.actionItem}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Complete Action Plan */}
          <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-300">
            <CardHeader>
              <CardTitle className="text-2xl text-teal-900">Your 8-Week Action Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {result.actionPlan?.map((week, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-teal-200">
                    <h4 className="font-semibold text-teal-800 mb-2">Week {index + 1}: {week.focus}</h4>
                    <ul className="space-y-1 text-sm text-slate-600">
                      {week.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Continue to Dashboard */}
          <div className="text-center">
            <Button 
              onClick={onComplete}
              size="lg"
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 px-8 py-4"
            >
              Continue to Your Dashboard
              <CheckCircle className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
