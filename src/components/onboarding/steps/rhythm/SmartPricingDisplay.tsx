
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Users, Star, X, CheckCircle, Zap } from "lucide-react";
import { UserType } from "@/types/user";
import { cn } from "@/lib/utils";

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
      gradient: 'from-neural-purple-500 via-neural-indigo-500 to-neural-blue-500',
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
      gradient: 'from-neural-purple-600 via-neural-indigo-600 to-neural-blue-600',
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
      gradient: 'from-brain-health-500 via-clarity-teal-500 to-memory-emerald-500',
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
                  className={cn(
                    "relative overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm bg-white/95",
                    plan.popular 
                      ? "border-2 border-neural-indigo-300 shadow-xl shadow-neural-indigo-500/20" 
                      : "border border-neural-indigo-200 hover:border-neural-indigo-300 hover:shadow-lg"
                  )}
                >
                  {/* Accent splash */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-memory-emerald-500 rounded-full" />
                  
                  {/* Background gradient */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-5",
                    plan.gradient
                  )} />
                  
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-neural-purple-600 to-neural-indigo-600 text-white px-3 py-1 shadow-lg">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-3 relative z-10">
                    {/* Icon */}
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br mb-4 mx-auto",
                      plan.gradient
                    )}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
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
                  
                  <CardContent className="space-y-4 relative z-10">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-5 w-5 text-memory-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={onSubscribe}
                      className={cn(
                        "w-full bg-gradient-to-r text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105",
                        plan.gradient
                      )}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Start 7-Day Free Trial
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-warm-200">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-memory-emerald-500" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-memory-emerald-500" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-memory-emerald-500" />
                <span>Secure payment</span>
              </div>
            </div>
            <p className="text-center text-xs text-gray-600 mt-4">
              <strong>3 Free Support Circle Members</strong> included • All plans include your complete {getUserTypeDisplay()} assessment
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
