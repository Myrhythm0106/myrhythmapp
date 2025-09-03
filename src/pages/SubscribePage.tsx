import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Crown, Users, Gift, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { basePricing, getPricingWithDiscount, isFoundingMemberActive } from '@/config/pricing';
import { trackSubscriptionAnalytics } from '@/utils/analytics';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
const SubscribePage = () => {
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'smart_pro' | 'family_smart' | null>(null);
  const [isYearly, setIsYearly] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const analytics = trackSubscriptionAnalytics();
  const isFoundingActive = isFoundingMemberActive();
  const plans = [{
    id: 'starter' as const,
    name: 'MyStarter',
    description: '✨ 3 Free Support Circle Members included',
    icon: Star,
    color: 'text-teal-600',
    gradient: 'from-teal-500 to-emerald-600',
    features: ['✨ 3 Free Support Circle Members', 'Unlimited Memory Bridge recordings', 'Full ACT reports with calendar scheduling', 'Complete cognitive assessments', 'Progress tracking & insights']
  }, {
    id: 'smart_pro' as const,
    name: 'MyStretch',
    description: 'Enhanced experience with connected care',
    icon: Crown,
    color: 'text-teal-600',
    gradient: 'from-teal-600 to-emerald-700',
    badge: 'Most Popular',
    popular: true,
    features: ['✨ 3 Free Support Circle Members', 'Everything in MyStarter', 'SMART Scheduling Engine', 'External calendar sync (Google, Apple, Outlook)', 'Schedule optimization & conflict detection', 'Advanced progress analytics', 'Priority support']
  }, {
    id: 'family_smart' as const,
    name: 'MyLeap',
    description: 'Complete family coordination with unlimited support',
    icon: Users,
    color: 'text-teal-600',
    gradient: 'from-teal-700 to-emerald-800',
    features: ['✨ 3 Free Support Circle Members', 'Everything in MyStretch', 'Up to 6 family member accounts', 'Shared family calendar & coordination', 'Family progress dashboard', 'Care coordination tools', 'Unlimited Support Circle Growth', 'Family insights & reports']
  }];
  const handleSelectPlan = async (planType: 'starter' | 'smart_pro' | 'family_smart') => {
    setSelectedPlan(planType);
    setLoading(true);
    try {
      const pricing = getPricingWithDiscount(basePricing.find(p => p.id === planType)!, isYearly);

      // Track checkout started
      analytics.checkoutStarted(planType, isYearly ? 'yearly' : 'monthly', pricing.hasDiscount, pricing.discountPercent);
      if (pricing.hasDiscount) {
        analytics.discountApplied(planType, isYearly ? 'yearly' : 'monthly', pricing.discountPercent, 'founding_member');
      }

      // Check if Stripe is enabled, if not simulate success page
      const stripeEnabled = import.meta.env.VITE_STRIPE_ENABLED === 'true';
      if (!stripeEnabled) {
        // Test mode - simulate successful payment and go to success page
        localStorage.setItem('selectedPlan', JSON.stringify({
          plan: planType,
          interval: isYearly ? 'year' : 'month',
          pricing
        }));
        toast.success('Payment processed! Welcome to MyRhythm!');

        // Navigate to success page with simulated session
        navigate('/subscribe/success?session_id=test_session&fm=' + (pricing.hasDiscount ? '1' : '0'));
        return;
      }
      const {
        data,
        error
      } = await supabase.functions.invoke('create-checkout', {
        body: {
          plan: planType,
          interval: isYearly ? 'year' : 'month'
        }
      });
      if (error) throw error;
      if (data?.url) {
        // Open Stripe checkout in same tab
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);

      // Fallback to test mode if Stripe fails
      localStorage.setItem('selectedPlan', JSON.stringify({
        plan: planType,
        interval: isYearly ? 'year' : 'month',
        pricing: getPricingWithDiscount(basePricing.find(p => p.id === planType)!, isYearly)
      }));
      toast.success('Payment processed! Welcome to MyRhythm!');

      // Navigate to success page with simulated session
      const pricing = getPricingWithDiscount(basePricing.find(p => p.id === planType)!, isYearly);
      navigate('/subscribe/success?session_id=test_session&fm=' + (pricing.hasDiscount ? '1' : '0'));
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };
  const calculateSavings = (monthly: number, yearly: number) => {
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - yearly;
    return Math.round(savings); // Round to nearest whole number
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
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Choose MyRhythm Plan
          </h1>
          <p className="text-slate-600 text-lg mb-4 max-w-2xl mx-auto">
            Transform promises into scheduled reality with AI-powered commitment fulfillment
          </p>
          <p 
            className="text-sm text-teal-600 font-medium mb-6 cursor-pointer hover:text-teal-700 hover:underline transition-colors"
            onClick={() => {
              localStorage.setItem('trial_started', 'true');
              navigate('/mvp/assessment-flow?trial=1&flow=subscribe-page');
            }}
          >
            Try before you subscribe - 7-day free trial on all plans ✨
          </p>
          
          {/* Founding Member Banner */}
          {isFoundingActive && <div className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-amber-600" />
                <span className="font-semibold text-amber-800">Founding Member Special</span>
              </div>
              <p className="text-sm text-amber-700">
                20% off all plans - Limited time offer for early supporters!
              </p>
            </div>}
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <button onClick={() => setIsYearly(false)} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", !isYearly ? "bg-teal-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900")}>
              Monthly
            </button>
            <button onClick={() => setIsYearly(true)} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2", isYearly ? "bg-teal-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900")}>
              Annual
              <Badge className="bg-teal-100 text-teal-800 text-xs">Save up to £60</Badge>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map(plan => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;
          const basePlan = basePricing.find(p => p.id === plan.id)!;
          const pricing = getPricingWithDiscount(basePlan, isYearly);
          const period = isYearly ? '/year' : '/month';
          const savings = isYearly ? calculateSavings(basePlan.monthlyPrice, basePlan.yearlyPrice) : 0;
          return <Card key={plan.id} className={cn("border-2 transition-all duration-200 relative", isSelected ? 'ring-2 ring-teal-500 shadow-lg border-teal-300' : 'hover:shadow-md border-slate-200', plan.popular ? 'bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200' : 'bg-white')}>
                {/* Founding Member Badge */}
                {pricing.hasDiscount && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 flex items-center gap-1">
                      <Gift className="h-3 w-3" />
                      {pricing.badge}
                    </Badge>
                  </div>}
                
                {/* Popular Badge (only if not founding member) */}
                {plan.badge && !pricing.hasDiscount && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-3 py-1">
                      {plan.badge}
                    </Badge>
                  </div>}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`h-5 w-5 ${plan.color}`} />
                    <CardTitle className="text-xl text-slate-800">{plan.name}</CardTitle>
                  </div>
                  
                  <div className="flex items-baseline gap-1">
                    {pricing.hasDiscount ? <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg text-slate-500 line-through">£{pricing.originalPrice}</span>
                          <span className="text-3xl font-bold text-amber-600">£{pricing.discountedPrice}</span>
                          <span className="text-sm text-slate-600">{period}</span>
                        </div>
                        <p className="text-xs text-amber-600 font-medium">Save {pricing.discountPercent}% with Founding Member</p>
                      </div> : <>
                        <span className="text-3xl font-bold text-slate-800">£{pricing.originalPrice}</span>
                        <span className="text-sm text-slate-600">{period}</span>
                      </>}
                  </div>
                  
                   {isYearly && savings > 0 && !pricing.hasDiscount && <p className="text-xs text-teal-600 font-medium">Save £{Math.round(savings)}/year</p>}
                  
                  <p className="text-sm text-slate-600">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-teal-600 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </li>)}
                  </ul>
                  
                  <Button onClick={() => handleSelectPlan(plan.id)} disabled={loading} className={cn("w-full shadow-md transition-all", `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-lg`)}>
                    {loading && selectedPlan === plan.id ? <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Opening Checkout...
                      </> : <>
                        Start {isYearly ? 'Annual' : 'Monthly'} Plan
                      </>}
                  </Button>
                </CardContent>
              </Card>;
        })}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 space-y-1 pt-8 border-t border-slate-200">
          <p>• All plans include 7-day free trial</p>
          <p>• Cancel anytime, no hidden fees</p>
          
          <p>• Secure payment processing via Stripe</p>
        </div>
      </div>
    </div>;
};
export default SubscribePage;