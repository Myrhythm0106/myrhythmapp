import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlanStep } from '@/components/onboarding/steps/PlanStep';
import { MVPProgressTracker } from './MVPProgressTracker';
import { 
  Crown, 
  Shield, 
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

interface MVPPaymentFlowProps {
  onPaymentComplete: () => void;
  onBack?: () => void;
}

export function MVPPaymentFlow({ onPaymentComplete, onBack }: MVPPaymentFlowProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlanComplete = (planData: any) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15">
      <MVPProgressTracker currentStep="payment" />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white border-0 px-4 py-2 mb-4">
            <Crown className="h-4 w-4 mr-2" />
            Start Your 7-Day Trial
          </Badge>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent mb-4">
            Choose Your Cognitive Empowerment Plan
          </h1>
          
          <p className="text-xl text-brain-health-700 max-w-2xl mx-auto">
            Start your journey with a 7-day free trial. No charges until your trial ends.
          </p>
        </div>

        {/* Trial Benefits */}
        <Card className="bg-gradient-to-r from-memory-emerald-50 to-brain-health-50 border-memory-emerald-200 mb-8">
          <CardContent className="p-6">
            <div className="text-center">
              <Clock className="h-8 w-8 text-memory-emerald-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-memory-emerald-700 mb-3">
                Your 7-Day Free Trial Includes:
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-memory-emerald-600" />
                  <span className="text-memory-emerald-700">Complete cognitive assessment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-memory-emerald-600" />
                  <span className="text-memory-emerald-700">All 4 core features</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-memory-emerald-600" />
                  <span className="text-memory-emerald-700">Personalized guidance</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Protection Notice */}
        <Card className="bg-gradient-to-r from-clarity-teal-50 to-brain-health-50 border-clarity-teal-200 mb-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-5 w-5 text-clarity-teal-600" />
              <div className="text-center">
                <div className="font-semibold text-clarity-teal-700">Secure Payment Processing</div>
                <div className="text-sm text-clarity-teal-600">
                  Enter your payment details to start your trial. Cancel anytime during the trial period.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Selection */}
        <div className="relative">
          {isProcessing && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-brain-health-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-brain-health-700 font-medium">Setting up your trial...</p>
              </div>
            </div>
          )}
          
          <PlanStep 
            onComplete={handlePlanComplete}
            selectedPlan={null}
          />
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-8 text-sm text-brain-health-600">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>7-Day Free Trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}