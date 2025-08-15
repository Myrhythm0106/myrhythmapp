import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Crown, Users, Zap, Calendar, Brain, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StrategicPricingCardProps {
  onSelectPlan: (planType: 'starter' | 'smart_pro' | 'family_smart') => void;
  onContinueFree: () => void;
  showFreeOption?: boolean;
}

export function StrategicPricingCard({ onSelectPlan, onContinueFree, showFreeOption = true }: StrategicPricingCardProps) {
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'smart_pro' | 'family_smart' | null>(null);
  const [isYearly, setIsYearly] = useState(true); // Default to yearly for better value

  const freeFeatures = [
    '3 Memory Bridge recordings per month',
    'Basic ACT reports',
    'Brief assessment',
    '1 support circle member',
    'Basic calendar'
  ];

  const plans = [
    {
      id: 'starter' as const,
      name: 'MyStarter',
      monthlyPrice: 7.00,
      yearlyPrice: 70.00,
      description: '✨ 3 Free Support Circle Members included',
      icon: Star,
      color: 'text-teal-600',
      gradient: 'from-teal-500 to-emerald-600',
      features: [
        '✨ 3 Free Support Circle Members',
        'Unlimited Memory Bridge recordings',
        'Full ACT reports with calendar scheduling',
        'Complete cognitive assessments',
        'Progress tracking & insights'
      ]
    },
    {
      id: 'smart_pro' as const,
      name: 'MyStretch',
      monthlyPrice: 7.00,
      yearlyPrice: 70.00,
      description: 'Enhanced experience with connected care',
      icon: Brain,
      color: 'text-teal-600',
      gradient: 'from-teal-600 to-emerald-700',
      badge: 'Most Popular',
      popular: true,
      features: [
        '✨ 3 Free Support Circle Members',
        'Everything in MyStarter',
        'SMART Scheduling Engine',
        'External calendar sync (Google, Apple, Outlook)',
        'Schedule optimization & conflict detection',
        'Advanced progress analytics',
        'Priority support'
      ]
    },
    {
      id: 'family_smart' as const,
      name: 'MyLeap',
      monthlyPrice: 7.00,
      yearlyPrice: 70.00,
      description: 'Complete family coordination with unlimited support',
      icon: Users,
      color: 'text-teal-600',
      gradient: 'from-teal-700 to-emerald-800',
      features: [
        '✨ 3 Free Support Circle Members',
        'Everything in MyStretch',
        'Up to 6 family member accounts',
        'Shared family calendar & coordination',
        'Family progress dashboard',
        'Care coordination tools',
        'Unlimited Support Circle Growth',
        'Family insights & reports'
      ]
    }
  ];

  const handleSelectPlan = (planType: 'starter' | 'smart_pro' | 'family_smart') => {
    setSelectedPlan(planType);
    const planName = plans.find(p => p.id === planType)?.name;
    const billingPeriod = isYearly ? 'yearly' : 'monthly';
    toast.success(`${planName} (${billingPeriod}) selected!`);
    
    setTimeout(() => {
      onSelectPlan(planType);
    }, 500);
  };

  const calculateSavings = (monthly: number, yearly: number) => {
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - yearly;
    return Math.round(savings);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Strategic Pricing Plans
        </h2>
        <p className="text-slate-600 text-lg mb-6">
          Transform promises into scheduled reality with AI-powered commitment fulfillment
        </p>
        
        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-4 p-2 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200 shadow-sm">
          <button
            onClick={() => setIsYearly(false)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              !isYearly ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
              isYearly ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            Annual
            <Badge className="bg-teal-600 text-white text-xs">Save up to £30</Badge>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Free Tier Card */}
        {showFreeOption && (
          <Card className="border-2 border-slate-200 relative">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-slate-600" />
                <CardTitle className="text-xl text-slate-800">Free</CardTitle>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-800">£0</span>
                <span className="text-sm text-slate-600">/month</span>
              </div>
              <p className="text-sm text-slate-600">Taste and see the value</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={onContinueFree}
                variant="outline"
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Continue Free
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Paid Plans */}
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;
          const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
          const period = isYearly ? '/year' : '/month';
          const savings = isYearly ? calculateSavings(plan.monthlyPrice, plan.yearlyPrice) : 0;
          
          return (
            <Card 
              key={plan.id}
              className={cn(
                "border-2 transition-all duration-200 relative",
                isSelected 
                  ? 'ring-2 ring-teal-500 shadow-lg border-teal-300' 
                  : 'hover:shadow-md border-teal-200',
                plan.popular ? 'bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-300' : 'bg-white'
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-3 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-5 w-5 ${plan.color}`} />
                  <CardTitle className="text-xl text-slate-800">{plan.name}</CardTitle>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-800">£{currentPrice}</span>
                  <span className="text-sm text-slate-600">{period}</span>
                </div>
                {isYearly && savings > 0 && (
                  <p className="text-xs text-teal-600 font-medium">Save £{savings}/year</p>
                )}
                <p className="text-sm text-slate-600">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-teal-600 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={selectedPlan === plan.id}
                  className={cn(
                    "w-full shadow-md transition-all",
                    plan.popular 
                      ? `bg-gradient-to-r ${plan.gradient} hover:shadow-lg text-white` 
                      : `bg-gradient-to-r ${plan.gradient} text-white`
                  )}
                >
                  {selectedPlan === plan.id ? (
                    'Selected - Processing...'
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Start {isYearly ? 'Annual' : 'Monthly'} Plan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-sm text-slate-500 space-y-1 pt-8 border-t border-slate-200 mt-8">
        <p>• All plans include 7-day free trial</p>
        <p>• Cancel anytime, no hidden fees</p>
        <p>• 30-day money-back guarantee</p>
        <p>• Secure payment processing via Stripe</p>
      </div>
    </div>
  );
}