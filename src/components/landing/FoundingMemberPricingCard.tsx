import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Crown, Users, Shield, ArrowRight, Clock } from 'lucide-react';

interface FoundingMemberPricingCardProps {
  onGetStarted: () => void;
}

export function FoundingMemberPricingCard({ onGetStarted }: FoundingMemberPricingCardProps) {
  const plans = [
    {
      id: 'starter',
      name: 'MyStarter',
      icon: Shield,
      price: '£7',
      originalPrice: '£39',
      period: '/month',
      description: 'Perfect start to build your rhythm with support circle',
      badge: 'INTRODUCTORY PRICE',
      popular: false,
      features: [
        '✨ 3 Free Support Circle Members',
        'Your LEAP Assessment & Results',
        'Personal Rhythm Discovery',
        'Basic Calendar & Goals',
        'Memory Enhancement Tools',
        'Brain Games & Exercises',
        'Daily Progress Tracking',
        'Community Access'
      ]
    },
    {
      id: 'stretch',
      name: 'MyStretch',
      icon: Crown,
      price: '£13',
      originalPrice: '£79',
      period: '/month',
      description: 'Enhanced experience with advanced momentum building',
      badge: 'MOST POPULAR',
      popular: true,
      features: [
        '✨ 3 Free Support Circle Members',
        'Everything in MyStarter',
        'Advanced LEAP Analytics',
        'Personalized Momentum Insights',
        'Priority Customer Support',
        'Advanced Calendar Management',
        'Goal Achievement Coaching',
        'Premium Brain Training',
        'Detailed Progress Reports',
        'Export & Share Features'
      ]
    },
    {
      id: 'leap',
      name: 'MyLeap',
      icon: Users,
      price: '£20',
      originalPrice: '£199',
      period: '/month',
      description: 'Complete family wellness journey with unlimited support',
      badge: 'PREMIUM',
      popular: false,
      features: [
        '✨ 3 Free Support Circle Members',
        'Everything in MyStretch',
        'Up to 6 Family Members',
        'Shared Family Calendar',
        'Caregiver Dashboard Access',
        'Family Progress Tracking',
        'Collaborative Goal Setting',
        'Family Support Resources',
        'Dedicated Family Coach',
        'Emergency Contact System',
        'Unlimited Support Circle Growth'
      ]
    }
  ];

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-memory-emerald-100 text-memory-emerald-800 border-memory-emerald-200">
            🚀 Founding Member Pricing - Limited Time
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-brain-health-900 mb-4">
            Lock in Introductory Pricing
          </h2>
          <p className="text-lg text-brain-health-600 max-w-2xl mx-auto mb-6">
            First 1,000 users get special founding member rates. After that, prices increase to regular pricing.
          </p>
          
          {/* Urgency Banner */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-memory-emerald-50 to-clarity-teal-50 border border-memory-emerald-200 rounded-lg px-6 py-3 text-sm font-medium text-memory-emerald-800">
            <Clock className="h-4 w-4" />
            <span>127/1,000 founding spots taken</span>
            <Badge variant="secondary" className="bg-memory-emerald-500 text-white">
              873 remaining
            </Badge>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-memory-emerald-300 shadow-lg scale-105 bg-gradient-to-b from-white to-memory-emerald-50/30' 
                  : 'border-gray-200 hover:border-memory-emerald-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-memory-emerald-500 hover:bg-memory-emerald-600 text-white px-3 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <plan.icon className={`h-8 w-8 ${plan.popular ? 'text-memory-emerald-600' : 'text-brain-health-600'}`} />
                </div>
                
                <CardTitle className="text-xl font-bold text-brain-health-900">
                  {plan.name}
                </CardTitle>
                
                <p className="text-sm text-brain-health-600 mt-2">
                  {plan.description}
                </p>

                {/* Pricing */}
                <div className="mt-6">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold text-brain-health-900">
                      {plan.price}
                    </span>
                    <span className="text-brain-health-600">
                      {plan.period}
                    </span>
                  </div>
                  
                  {/* Original Price Strikethrough */}
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-sm text-gray-500 line-through">
                      Regular: {plan.originalPrice}/month
                    </span>
                    <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                      Save {Math.round((1 - parseInt(plan.price.slice(1)) / parseInt(plan.originalPrice.slice(1))) * 100)}%
                    </Badge>
                  </div>
                </div>

                {!plan.popular && (
                  <Badge variant="outline" className="mt-3 text-xs border-memory-emerald-200 text-memory-emerald-700">
                    {plan.badge}
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="pt-0">
                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-memory-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-brain-health-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  onClick={onGetStarted}
                  size="lg"
                  className={`w-full font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-memory-emerald-600 hover:bg-memory-emerald-700 shadow-lg hover:shadow-xl'
                      : 'bg-brain-health-600 hover:bg-brain-health-700'
                  }`}
                >
                  Start 7-Day Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {/* Trial Info */}
                <p className="text-xs text-center text-brain-health-500 mt-3">
                  No credit card required • Cancel anytime
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Notice */}
        <div className="text-center mt-12 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800 font-medium">
            🔥 <strong>Price Lock Guarantee:</strong> Founding members keep their introductory pricing for 6 months, even as we add new features and regular prices increase.
          </p>
        </div>
      </div>
    </div>
  );
}