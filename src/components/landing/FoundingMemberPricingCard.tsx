import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './premium/ScrollReveal';

interface FoundingMemberPricingCardProps {
  onGetStarted: () => void;
}

export function FoundingMemberPricingCard({ onGetStarted }: FoundingMemberPricingCardProps) {
  const plans = [
    {
      id: 'starter',
      name: 'MyStarter',
      price: '£7',
      originalPrice: '£39',
      period: '/month',
      features: [
        '3 Free Support Circle Members',
        'Your LEAP Assessment & Results',
        'Personal Rhythm Discovery',
        'Memory Enhancement Tools',
        'Brain Games & Exercises',
        'Daily Progress Tracking'
      ]
    },
    {
      id: 'stretch',
      name: 'MyStretch',
      price: '£13',
      originalPrice: '£79',
      period: '/month',
      popular: true,
      features: [
        '3 Free Support Circle Members',
        'Everything in MyStarter',
        'Advanced LEAP Analytics',
        'Personalized Momentum Insights',
        'Priority Customer Support',
        'Advanced Calendar Management'
      ]
    },
    {
      id: 'leap',
      name: 'MyLeap',
      price: '£20',
      originalPrice: '£199',
      period: '/month',
      features: [
        '3 Free Support Circle Members',
        'Everything in MyStretch',
        'Up to 6 Family Members',
        'Shared Family Calendar',
        'Caregiver Dashboard Access',
        'Dedicated Family Coach'
      ]
    }
  ];

  return (
    <div className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-20">
            <h2 className="text-display-md font-display tracking-tight text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 font-light">
              First 1,000 members get founding rates. 873 spots remaining.
            </p>
          </div>
        </ScrollReveal>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <ScrollReveal key={plan.id} delay={index * 100}>
              <Card 
                className={`relative bg-white border transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-brand-emerald-600 shadow-lg' 
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-10">
                  <CardTitle className="text-2xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>

                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-600">
                        {plan.period}
                      </span>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="line-through">Regular: {plan.originalPrice}/month</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 px-8 pb-8">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="h-5 w-5 text-brand-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={onGetStarted}
                    size="lg"
                    className="w-full bg-brand-emerald-600 hover:bg-brand-emerald-700 text-white font-semibold"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    No credit card required
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
