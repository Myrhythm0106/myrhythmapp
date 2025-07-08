
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Crown, Users, Zap } from "lucide-react";
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
      color: 'text-blue-600',
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
      color: 'text-purple-600',
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
      color: 'text-green-600',
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
        <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
        <p className="text-muted-foreground">
          Start your 7-day free trial. Cancel anytime.
        </p>
      </div>

      {plans.map((plan) => {
        const Icon = plan.icon;
        const isSelected = selectedPlan === plan.id;
        
        return (
          <Card 
            key={plan.id}
            className={`transition-all duration-200 ${
              isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
            } ${plan.id === 'premium' ? 'border-purple-200 bg-purple-50/50' : ''}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${plan.color}`} />
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </div>
                {plan.badge && (
                  <Badge className="bg-purple-100 text-purple-700">
                    {plan.badge}
                  </Badge>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => handleSelectPlan(plan.id)}
                disabled={selectedPlan === plan.id}
                className={`w-full ${
                  plan.id === 'premium' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : ''
                }`}
              >
                {selectedPlan === plan.id ? (
                  'Selected'
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

      <Card className="bg-gray-50 border-dashed">
        <CardContent className="p-4 text-center">
          <h3 className="font-semibold mb-2">Continue with Basic Features</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Access limited features without subscription
          </p>
          <Button variant="outline" onClick={onContinueFree} className="w-full">
            Continue Free
          </Button>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground">
        <p>• 7-day free trial for all plans</p>
        <p>• Cancel anytime through App Store</p>
        <p>• No charges during trial period</p>
      </div>
    </div>
  );
}
