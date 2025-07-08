
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Crown, Users, Zap, Smartphone } from "lucide-react";
import { toast } from "sonner";

interface MobileSubscriptionSelectorProps {
  onSelectPlan: (planType: 'basic' | 'premium' | 'family') => void;
  onContinueFree: () => void;
}

export function MobileSubscriptionSelector({ onSelectPlan, onContinueFree }: MobileSubscriptionSelectorProps) {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'family' | null>(null);

  const plans = [
    {
      id: 'basic' as const,
      name: 'MyRhythm Align',
      price: '£5.99',
      period: '/month',
      description: 'Perfect for getting started',
      icon: Star,
      color: 'text-emerald-600',
      gradient: 'from-emerald-500 to-teal-600',
      features: [
        'Basic rhythm assessment',
        'Daily action planning',
        'Progress tracking',
        'Community support'
      ]
    },
    {
      id: 'premium' as const,
      name: 'MyRhythm Flow',
      price: '£9.99',
      period: '/month',
      description: 'Most popular choice',
      icon: Crown,
      color: 'text-emerald-600',
      gradient: 'from-emerald-600 to-teal-700',
      badge: 'Popular',
      features: [
        'Everything in Align',
        'Advanced insights',
        'Personal coaching tips',
        'Goal achievement tools',
        'Calendar integration',
        'Mood & energy tracking'
      ]
    },
    {
      id: 'family' as const,
      name: 'MyRhythm Thrive',
      price: '£19.99',
      period: '/month',
      description: 'Perfect for families',
      icon: Users,
      color: 'text-emerald-600',
      gradient: 'from-emerald-700 to-teal-800',
      features: [
        'Everything in Flow',
        'Up to 6 family members',
        'Shared family calendar',
        'Family progress dashboard',
        'Parental insights',
        'Priority support'
      ]
    }
  ];

  const handleSelectPlan = (planType: 'basic' | 'premium' | 'family') => {
    setSelectedPlan(planType);
    toast.success(`${plans.find(p => p.id === planType)?.name} selected!`);
    
    // Simulate App Store purchase flow
    setTimeout(() => {
      onSelectPlan(planType);
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 p-4">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Smartphone className="h-6 w-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-slate-800">Choose Your Plan</h2>
        </div>
        <p className="text-slate-600">
          Start your 7-day free trial via App Store. Cancel anytime.
        </p>
      </div>

      {plans.map((plan) => {
        const Icon = plan.icon;
        const isSelected = selectedPlan === plan.id;
        
        return (
          <Card 
            key={plan.id}
            className={`transition-all duration-200 border-2 ${
              isSelected 
                ? 'ring-2 ring-emerald-500 shadow-lg border-emerald-300' 
                : 'hover:shadow-md border-emerald-200'
            } ${plan.id === 'premium' ? 'bg-gradient-to-br from-emerald-50 to-teal-50' : 'bg-white'}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${plan.color}`} />
                  <CardTitle className="text-lg text-slate-800">{plan.name}</CardTitle>
                </div>
                {plan.badge && (
                  <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                    {plan.badge}
                  </Badge>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-800">{plan.price}</span>
                <span className="text-sm text-slate-600">{plan.period}</span>
              </div>
              <p className="text-sm text-slate-600">{plan.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => handleSelectPlan(plan.id)}
                disabled={selectedPlan === plan.id}
                className={`w-full shadow-md ${
                  plan.id === 'premium' 
                    ? `bg-gradient-to-r ${plan.gradient} hover:shadow-lg` 
                    : `bg-gradient-to-r ${plan.gradient}`
                } text-white`}
              >
                {selectedPlan === plan.id ? (
                  'Selected - Redirecting to App Store...'
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Start 7-Day Free Trial
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        );
      })}

      <div className="text-center text-xs text-slate-500 space-y-1 pt-4 border-t border-emerald-200">
        <p>• 7-day free trial for all plans</p>
        <p>• Billed through App Store subscription</p>
        <p>• Cancel anytime in App Store settings</p>
        <p>• No charges during trial period</p>
      </div>
    </div>
  );
}
