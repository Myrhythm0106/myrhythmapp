import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Crown, Users, Gift, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { plans } from '@/components/onboarding/steps/plan/plansData';
import { PlanType } from '@/components/onboarding/steps/plan/types';

const SubscribePage = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('userType') || 'brain-injury';
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const userTypeMessages: Record<string, string> = {
    'brain-injury': 'Perfect for Brain Injury Recovery',
    'caregiver': 'Perfect for Caregivers & Families',
    'cognitive-optimization': 'Perfect for Peak Performance',
    'wellness': 'Perfect for General Wellness',
    'medical-professional': 'Perfect for Healthcare Professionals'
  };

  const handleSelectPlan = async (planType: PlanType) => {
    setSelectedPlan(planType);
    setLoading(true);
    
    try {
      // Test mode - simulate successful payment
      localStorage.setItem('selectedPlan', JSON.stringify({
        plan: planType,
        interval: isYearly ? 'year' : 'month'
      }));
      
      toast.success('Payment processed! Welcome to MyRhythm!');
      
      // Navigate to welcome page with postCheckout flag
      navigate('/start?userType=' + userType);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };
  return <div className="public-page min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/mvp")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            {userTypeMessages[userType] || 'Choose Your MyRhythm Plan'}
          </h1>
          <p className="text-slate-600 text-lg mb-6 max-w-2xl mx-auto">
            Transform your daily rhythm with personalized support and AI-powered insights
          </p>
          
          {/* Founding Member Banner */}
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-400 rounded-2xl p-6 mb-8 max-w-2xl mx-auto shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Gift className="h-7 w-7 text-amber-600" />
              <span className="font-bold text-2xl text-amber-900">🎉 Founding Member Pricing</span>
            </div>
            <p className="text-lg font-semibold text-amber-800 mb-2">
              First 1,000 users lock in forever pricing!
            </p>
            <p className="text-amber-700">
              Save up to <strong>90% off</strong> regular prices • Lock in your rate for life
            </p>
          </div>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <button onClick={() => setIsYearly(false)} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", !isYearly ? "bg-teal-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900")}>
              Monthly
            </button>
            <button onClick={() => setIsYearly(true)} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2", isYearly ? "bg-teal-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900")}>
              Annual
              <Badge className="bg-emerald-100 text-emerald-800 text-xs">Save More</Badge>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map(plan => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            const currentPrice = isYearly 
              ? plan.annualPrice?.replace('/year', '')
              : plan.price?.replace('/month', '');
            const regularPrice = isYearly
              ? plan.regularAnnualPrice?.replace('/year', '')
              : plan.regularPrice?.replace('/month', '');
            const period = isYearly ? '/year' : '/month';
            
            // Calculate actual savings
            const currentNum = parseFloat(currentPrice?.replace('£', '') || '0');
            const regularNum = parseFloat(regularPrice?.replace('£', '') || '0');
            const savingsAmount = regularNum - currentNum;
            
            return (
              <Card 
                key={plan.id} 
                className={cn(
                  "border-2 transition-all duration-200 relative",
                  isSelected ? 'ring-2 ring-teal-500 shadow-lg border-teal-300' : 'hover:shadow-md border-slate-200',
                  plan.popular ? 'bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200' : 'bg-white'
                )}
              >
                {/* Founding Member Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-1.5 flex items-center gap-1.5 text-sm font-bold">
                    <Gift className="h-4 w-4" />
                    FOUNDING MEMBER
                  </Badge>
                </div>
                
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-3 py-1">
                      {plan.highlight}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4 pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="h-6 w-6 text-teal-600" />
                    <CardTitle className="text-2xl text-slate-800">{plan.name}</CardTitle>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-4">{plan.description}</p>
                  
                  {/* Pricing Display */}
                  <div className="space-y-3">
                    {/* Your Founding Member Price - BIG */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4">
                      <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
                        Your Founding Member Price
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-amber-900">{currentPrice}</span>
                        <span className="text-lg text-amber-700">{period}</span>
                      </div>
                      <p className="text-xs text-amber-600 font-medium mt-1">
                        🔒 Lock in forever • First 1,000 users only
                      </p>
                    </div>
                    
                    {/* Regular Price - Crossed Out */}
                    <div className="text-center py-2">
                      <p className="text-xs text-slate-500 mb-1">Regular Price (after 1,000 users)</p>
                      <p className="text-2xl font-semibold text-slate-400 line-through">{regularPrice}{period}</p>
                    </div>
                    
                    {/* Savings Badge - GREEN AND BIG */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-white">
                        ⚡ SAVE £{Math.round(isYearly ? savingsAmount : savingsAmount)}{isYearly ? '/YEAR' : '/MONTH'}! ⚡
                      </p>
                      <p className="text-sm text-emerald-50 mt-1">
                        {Math.round((savingsAmount / regularNum) * 100)}% OFF
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={loading}
                    className={cn(
                      "w-full shadow-md transition-all font-semibold text-base py-6",
                      "bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg hover:from-teal-700 hover:to-emerald-700"
                    )}
                  >
                    {loading && selectedPlan === plan.id ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Start 7-Day Free Trial</>
                    )}
                  </Button>
                  
                  <p className="text-xs text-center text-slate-500">
                    Cancel anytime • No hidden fees
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 space-y-2 pt-8 border-t border-slate-200">
          <p className="font-semibold text-slate-700 text-base">🎯 Risk-Free Trial</p>
          <p>✓ All plans include 7-day free trial</p>
          <p>✓ No credit card required to start</p>
          <p>✓ Cancel anytime, no questions asked</p>
          <p>✓ Founding member pricing locked in forever</p>
        </div>
      </div>
    </div>;
};
export default SubscribePage;