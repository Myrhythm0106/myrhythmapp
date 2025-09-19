import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Crown, Users, Zap, Calendar, Brain, TrendingUp, Gift } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { basePricing, getPricingWithDiscount, isFoundingMemberActive } from "@/config/pricing";
import { trackSubscriptionAnalytics } from "@/utils/analytics";

interface StrategicPricingCardProps {
  onSelectPlan: (planType: 'reconnect' | 'thrive' | 'family') => void;
  onContinueFree: () => void;
  showFreeOption?: boolean;
}

export function StrategicPricingCard({ onSelectPlan, onContinueFree, showFreeOption = true }: StrategicPricingCardProps) {
  const [selectedPlan, setSelectedPlan] = useState<'reconnect' | 'thrive' | 'family' | null>(null);
  const [isYearly, setIsYearly] = useState(true); // Default to yearly for better value

  const freeFeatures = [
    '3 Memory Bridge recordings per month',
    'Basic Next Step Summary',
    'Brief assessment',
    '1 support circle member',
    'Basic calendar'
  ];

  const plans = [
    {
      id: 'reconnect' as const,
      name: 'MyReconnect',
      description: 'Unlimited recordings with support circle',
      icon: Star,
      color: 'text-teal-600',
      gradient: 'from-teal-500 to-emerald-600',
      features: [
        'Unlimited conversation recordings',
        'Advanced Next Step Summary & scheduling',
        'Full calendar integration',
        'Up to 3 support circle members',
        'Basic progress reports'
      ]
    },
    {
      id: 'thrive' as const,
      name: 'MyThrive',
      description: 'Enhanced experience with medical integration',
      icon: Brain,
      color: 'text-teal-600',
      gradient: 'from-teal-600 to-emerald-700',
      badge: 'Most Popular',
      popular: true,
      features: [
        'Everything in MyReconnect',
        'Medical-grade progress reports',
        'Healthcare team integration',
        'Up to 5 support circle members',
        'Priority support',
        'Advanced analytics'
      ]
    },
    {
      id: 'family' as const,
      name: 'MyFamily',
      description: 'Complete family coordination with unlimited support',
      icon: Users,
      color: 'text-teal-600',
      gradient: 'from-teal-700 to-emerald-800',
      features: [
        'Everything in MyThrive',
        'Family sharing & coordination',
        'Unlimited support circle members',
        'Multi-user dashboard',
        'Family progress tracking',
        'Caregiver peace-of-mind features'
      ]
    }
  ];

  const analytics = trackSubscriptionAnalytics();
  const isFoundingActive = isFoundingMemberActive();

  useEffect(() => {
    // Track plan view analytics
    plans.forEach(plan => {
      const pricing = getPricingWithDiscount(basePricing.find(p => p.id === plan.id)!, isYearly);
      analytics.planViewed(plan.id, isYearly ? 'yearly' : 'monthly', pricing.hasDiscount);
    });
  }, [isYearly]);

  const handleSelectPlan = (planType: 'reconnect' | 'thrive' | 'family') => {
    setSelectedPlan(planType);
    const planName = plans.find(p => p.id === planType)?.name;
    const billingPeriod = isYearly ? 'yearly' : 'monthly';
    const pricing = getPricingWithDiscount(basePricing.find(p => p.id === planType)!, isYearly);
    
    // Track analytics
    analytics.planSelected(planType, isYearly ? 'yearly' : 'monthly', pricing.hasDiscount);
    
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
          const basePlan = basePricing.find(p => p.id === plan.id)!;
          const pricing = getPricingWithDiscount(basePlan, isYearly);
          const period = isYearly ? '/year' : '/month';
          const savings = isYearly ? calculateSavings(basePlan.monthlyPrice, basePlan.yearlyPrice) : 0;
          
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
              {/* Founding Member Badge */}
              {pricing.hasDiscount && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 flex items-center gap-1">
                    <Gift className="h-3 w-3" />
                    {pricing.badge}
                  </Badge>
                </div>
              )}
              
              {/* Popular Badge (only if not founding member) */}
              {plan.badge && !pricing.hasDiscount && (
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
                  {pricing.hasDiscount ? (
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg text-slate-500 line-through">£{pricing.originalPrice}</span>
                        <span className="text-3xl font-bold text-amber-600">£{pricing.discountedPrice}</span>
                        <span className="text-sm text-slate-600">{period}</span>
                      </div>
                      <p className="text-xs text-amber-600 font-medium">Save {pricing.discountPercent}% with Founding Member</p>
                    </div>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-slate-800">£{pricing.originalPrice}</span>
                      <span className="text-sm text-slate-600">{period}</span>
                    </>
                  )}
                </div>
                {isYearly && savings > 0 && !pricing.hasDiscount && (
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