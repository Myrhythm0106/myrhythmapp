import React, { useState } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { 
  Sparkles, Check, Crown, Zap, Brain, Users, 
  Calendar, Mic, Gamepad2, TrendingUp, Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LaunchFeatureStore() {
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);

  const currentPlan = {
    name: 'Free',
    features: ['3 Brain Games/day', '2 Memory Bridge recordings/week', 'Basic Support Circle'],
  };

  const individualFeatures = [
    { 
      id: 'memory-premium', 
      name: 'Memory Bridge Premium', 
      description: 'Unlimited recordings + AI insights',
      price: '£3/mo',
      icon: Mic,
      color: 'from-emerald-400 to-emerald-600'
    },
    { 
      id: 'brain-games-unlimited', 
      name: 'Unlimited Brain Games', 
      description: 'All games, unlimited plays',
      price: '£2/mo',
      icon: Gamepad2,
      color: 'from-purple-400 to-purple-600'
    },
    { 
      id: 'smart-scheduling', 
      name: 'Smart Scheduling', 
      description: 'AI-powered calendar optimization',
      price: '£2/mo',
      icon: Calendar,
      color: 'from-blue-400 to-blue-600'
    },
    { 
      id: 'analytics-pro', 
      name: 'Analytics Pro', 
      description: 'Deep insights into your patterns',
      price: '£2/mo',
      icon: TrendingUp,
      color: 'from-amber-400 to-amber-600'
    },
  ];

  const bundles = [
    {
      id: 'premium',
      name: 'Premium',
      description: 'Everything you need',
      price: '£10/mo',
      savings: 'Save 50%',
      features: [
        'All individual features included',
        'Priority support',
        'Early access to new features',
        'Unlimited Support Circle members',
      ],
      popular: true,
    },
    {
      id: 'family',
      name: 'Family',
      description: 'For the whole care team',
      price: '£15/mo',
      savings: 'Best for families',
      features: [
        'Everything in Premium',
        'Up to 5 user accounts',
        'Shared calendar view',
        'Team messaging',
      ],
      popular: false,
    },
  ];

  const comingSoon = [
    { name: 'Voice Commands', description: 'Control MyRhythm with your voice' },
    { name: 'Apple Health Sync', description: 'Connect your health data' },
    { name: 'Custom Themes', description: 'Personalize your experience' },
  ];

  return (
    <LaunchLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Feature Store</h1>
        <p className="text-gray-600">Unlock more of MyRhythm</p>
      </div>

      {/* Current Plan */}
      <LaunchCard variant="glass" className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Your Plan: {currentPlan.name}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentPlan.features.map((feature, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {feature}
            </span>
          ))}
        </div>
      </LaunchCard>

      {/* Bundles */}
      <h2 className="font-semibold text-gray-900 mb-3">Upgrade Plans</h2>
      <div className="space-y-3 mb-6">
        {bundles.map((bundle) => (
          <LaunchCard 
            key={bundle.id}
            variant={bundle.popular ? 'featured' : 'default'}
            className={cn(
              "relative overflow-hidden",
              selectedBundle === bundle.id && "ring-2 ring-brand-emerald-500"
            )}
            onClick={() => setSelectedBundle(bundle.id)}
          >
            {bundle.popular && (
              <div className="absolute top-0 right-0 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-bl-xl">
                POPULAR
              </div>
            )}
            
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                bundle.popular ? "bg-amber-100" : "bg-gray-100"
              )}>
                <Crown className={cn(
                  "h-6 w-6",
                  bundle.popular ? "text-amber-600" : "text-gray-600"
                )} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{bundle.name}</h3>
                  <span className="text-xs bg-brand-emerald-100 text-brand-emerald-700 px-2 py-0.5 rounded-full">
                    {bundle.savings}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{bundle.description}</p>
                
                <div className="space-y-1 mb-3">
                  {bundle.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-brand-emerald-500" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-gray-900">{bundle.price}</p>
                  <LaunchButton variant={bundle.popular ? 'primary' : 'secondary'} className="h-10">
                    Upgrade
                  </LaunchButton>
                </div>
              </div>
            </div>
          </LaunchCard>
        ))}
      </div>

      {/* Individual Features */}
      <h2 className="font-semibold text-gray-900 mb-3">Individual Features</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {individualFeatures.map((feature) => (
          <LaunchCard key={feature.id} className="p-4">
            <div className={cn(
              "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3",
              feature.color
            )}>
              <feature.icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{feature.name}</h3>
            <p className="text-xs text-gray-500 mb-3">{feature.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900">{feature.price}</span>
              <button className="text-xs text-brand-emerald-600 font-medium">Add</button>
            </div>
          </LaunchCard>
        ))}
      </div>

      {/* Coming Soon */}
      <h2 className="font-semibold text-gray-900 mb-3">Coming Soon</h2>
      <div className="space-y-2 mb-24">
        {comingSoon.map((feature, i) => (
          <div 
            key={i}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200"
          >
            <Lock className="h-4 w-4 text-gray-400" />
            <div>
              <p className="font-medium text-gray-600 text-sm">{feature.name}</p>
              <p className="text-xs text-gray-400">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </LaunchLayout>
  );
}
