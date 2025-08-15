
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Users, Star, X, CheckCircle, Zap } from "lucide-react";
import { UserType } from "@/types/user";

interface SmartPricingDisplayProps {
  userType?: UserType | null;
  onClose: () => void;
  onSubscribe: () => void;
}

export function SmartPricingDisplay({ userType, onClose, onSubscribe }: SmartPricingDisplayProps) {
  const getUserTypeDisplay = () => {
    switch (userType) {
      case 'brain-injury': return 'Brain Injury Recovery';
      case 'caregiver': return 'Caregiver Support';
      case 'cognitive-optimization': return 'Cognitive Optimization';
      case 'wellness': return 'General Wellness';
      default: return 'Personal Development';
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'MyStarter',
      price: '£7.00',
      period: '/month',
      description: 'Perfect start with support circle',
      icon: Star,
      gradient: 'from-teal-500 to-emerald-600',
      features: [
        '✨ 3 Free Support Circle Members',
        'Complete assessment results',
        'Daily action planning',
        'Progress tracking',
        'Community support'
      ]
    },
    {
      id: 'stretch',
      name: 'MyStretch',
      price: '£7.00',
      period: '/month',
      description: 'Enhanced experience with connected care',
      icon: Crown,
      gradient: 'from-teal-600 to-emerald-700',
      badge: 'Recommended',
      popular: true,
      features: [
        '✨ 3 Free Support Circle Members',
        'Everything in MyStarter',
        'Personalized action plans',
        'Advanced progress insights',
        'Goal achievement tools',
        'Priority support',
        `Specialized ${getUserTypeDisplay()} guidance`
      ]
    },
    {
      id: 'leap',
      name: 'MyLeap',
      price: '£7.00',
      period: '/month',
      description: 'Complete family experience with unlimited support',
      icon: Users,
      gradient: 'from-teal-700 to-emerald-800',
      features: [
        '✨ 3 Free Support Circle Members',
        'Everything in MyStretch',
        'Up to 6 family members',
        'Shared family insights',
        'Caregiver coordination',
        'Family progress dashboard',
        'Unlimited Support Circle Growth'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl">Choose Your {getUserTypeDisplay()} Plan</CardTitle>
            <p className="text-slate-600">
              Get the complete assessment results and personalized guidance you need
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => {
              const Icon = plan.icon;
              
              return (
                <Card 
                  key={plan.id}
                  className={`relative border-2 transition-all duration-200 ${
                    plan.popular 
                      ? 'ring-2 ring-teal-500 shadow-lg border-teal-300 scale-105' 
                      : 'hover:shadow-md border-teal-200'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-3 py-1">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-3">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Icon className="h-6 w-6 text-teal-600" />
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold text-slate-800">{plan.price}</span>
                        <span className="text-sm text-slate-600">{plan.period}</span>
                      </div>
                      <p className="text-sm text-slate-600">{plan.description}</p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={onSubscribe}
                      className={`w-full shadow-md bg-gradient-to-r ${plan.gradient} text-white hover:shadow-lg`}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Start 7-Day Free Trial
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center text-xs text-slate-500 space-y-1 pt-4 border-t border-teal-200">
            <p>• 7-day free trial for all plans • Cancel anytime • No charges during trial</p>
            <p>• <strong>3 Free Support Circle Members</strong> included in every plan</p>
            <p>• All plans include your complete {getUserTypeDisplay()} assessment results</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
