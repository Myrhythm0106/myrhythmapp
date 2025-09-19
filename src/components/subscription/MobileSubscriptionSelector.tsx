
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, Star, Crown, Users, Zap, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MobileSubscriptionSelectorProps {
  onSelectPlan: (planType: 'starter' | 'smart_pro' | 'family_smart') => void;
  onContinueFree: () => void;
}

export function MobileSubscriptionSelector({ onSelectPlan, onContinueFree }: MobileSubscriptionSelectorProps) {
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'smart_pro' | 'family_smart' | null>(null);
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      id: 'starter' as const,
      name: 'Starter',
      monthlyPrice: '£7.99',
      yearlyPrice: '£79.99',
      description: 'Perfect for getting started',
      icon: Star,
      color: 'text-teal-600',
      gradient: 'from-teal-500 to-emerald-600',
      features: [
        'Unlimited Memory Bridge recordings',
        'Full Next Step Summary',
        'Complete assessments',
        'Up to 3 support circle members',
        'Basic calendar integration'
      ]
    },
    {
      id: 'smart_pro' as const,
      name: 'SMART Pro',
      monthlyPrice: '£14.99',
      yearlyPrice: '£149.99',
      description: 'AI-powered scheduling & optimization',
      icon: Crown,
      color: 'text-teal-600',
      gradient: 'from-teal-600 to-emerald-700',
      badge: 'Most Popular',
      features: [
        'Everything in Starter',
        'SMART Scheduling Engine',
        'External calendar sync',
        'Schedule optimization',
        'Advanced analytics',
        'Up to 5 support circle members',
        'Priority support'
      ]
    },
    {
      id: 'family_smart' as const,
      name: 'Family SMART',
      monthlyPrice: '£24.99',
      yearlyPrice: '£249.99',
      description: 'Complete family coordination',
      icon: Users,
      color: 'text-teal-600',
      gradient: 'from-teal-700 to-emerald-800',
      features: [
        'Everything in SMART Pro',
        'Up to 6 family accounts',
        'Shared family calendar',
        'Family progress dashboard',
        'Care coordination tools',
        'Unlimited support circle',
        'Family insights & reports'
      ]
    }
  ];

  const handleSelectPlan = (planType: 'starter' | 'smart_pro' | 'family_smart') => {
    setSelectedPlan(planType);
    const planName = plans.find(p => p.id === planType)?.name;
    const billingPeriod = isYearly ? 'yearly' : 'monthly';
    toast.success(`${planName} (${billingPeriod}) selected!`);
    
    // Simulate App Store purchase flow
    setTimeout(() => {
      onSelectPlan(planType);
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 p-4">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Smartphone className="h-6 w-6 text-teal-600" />
          <h2 className="text-2xl font-bold text-slate-800">Choose Your Plan</h2>
        </div>
        <p className="text-slate-600">
          {isYearly ? 'Annual plans with instant access and savings' : 'Start your 7-day free trial via App Store'}
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200 shadow-sm">
          <span className={cn(
            "text-sm font-medium transition-colors",
            !isYearly ? "text-slate-900" : "text-slate-500"
          )}>
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-teal-600"
          />
          <span className={cn(
            "text-sm font-medium transition-colors",
            isYearly ? "text-slate-900" : "text-slate-500"
          )}>
            Annual
          </span>
          {isYearly && (
            <Badge className="bg-teal-600 text-white font-medium px-2 py-1 text-xs ml-2">
              Save up to £40/year
            </Badge>
          )}
        </div>
      </div>

        {plans.map((plan) => {
        const Icon = plan.icon;
        const isSelected = selectedPlan === plan.id;
        const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
        const period = isYearly ? '/year' : '/month';
        
        return (
          <Card 
            key={plan.id}
            className={`transition-all duration-200 border-2 ${
              isSelected 
                ? 'ring-2 ring-teal-500 shadow-lg border-teal-300' 
                : 'hover:shadow-md border-teal-200'
            } ${plan.id === 'smart_pro' ? 'bg-gradient-to-br from-teal-50 to-emerald-50' : 'bg-white'}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${plan.color}`} />
                  <CardTitle className="text-lg text-slate-800">{plan.name}</CardTitle>
                </div>
                {plan.badge && (
                  <Badge className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
                    {plan.badge}
                  </Badge>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-800">{currentPrice}</span>
                <span className="text-sm text-slate-600">{period}</span>
              </div>
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
                className={`w-full shadow-md ${
                  plan.id === 'smart_pro' 
                    ? `bg-gradient-to-r ${plan.gradient} hover:shadow-lg` 
                    : `bg-gradient-to-r ${plan.gradient}`
                } text-white`}
              >
                {selectedPlan === plan.id ? (
                  'Selected - Redirecting to App Store...'
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    {isYearly ? 'Subscribe Now' : 'Start 7-Day Free Trial'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        );
      })}

      <div className="text-center text-xs text-slate-500 space-y-1 pt-4 border-t border-teal-200">
        {isYearly ? (
          <>
            <p>• Annual plans - immediate access</p>
            <p>• Significant savings compared to monthly</p>
            <p>• 30-day money-back guarantee</p>
            <p>• Cancel anytime in App Store settings</p>
          </>
        ) : (
          <>
            <p>• 7-day free trial for all plans</p>
            <p>• Billed through App Store subscription</p>
            <p>• Cancel anytime in App Store settings</p>
            <p>• No charges during trial period</p>
          </>
        )}
      </div>
    </div>
  );
}
