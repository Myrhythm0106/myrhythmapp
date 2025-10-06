import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowLeft, Sparkles, Shield, Users } from 'lucide-react';

interface CheckInData {
  energy: number;
  stress: number;
  focus: number;
  memoryConfidence: number;
  sleepQuality: number;
}

interface PlanSelectionPaywallProps {
  checkIn: CheckInData;
  onComplete: (selectedPackage: 'starter' | 'plus' | 'pro') => void;
  onBack?: () => void;
}

const packages = [
  {
    id: 'starter' as const,
    name: 'Starter',
    price: 'Free',
    description: 'Get started with essential tools',
    features: [
      'Daily check-ins',
      'Basic insights',
      'Limited recordings',
      'Community access',
    ],
    recommended: false,
  },
  {
    id: 'plus' as const,
    name: 'Plus',
    price: '$29',
    priceDetail: '/month',
    description: 'Unlock full cognitive wellness features',
    features: [
      'Unlimited recordings',
      'Advanced insights',
      'Smart scheduling',
      'Priority support',
      'Progress tracking',
      'Custom routines',
    ],
    recommended: true,
    trial: '7-Day Free Trial',
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: '$79',
    priceDetail: '/month',
    description: 'Complete wellness transformation',
    features: [
      'Everything in Plus',
      '1-on-1 coaching calls',
      'Personalized care plan',
      'Family account sharing',
      'Priority feature access',
      'Dedicated support team',
    ],
    recommended: false,
    trial: '7-Day Free Trial',
  },
];

export function PlanSelectionPaywall({ checkIn, onComplete, onBack }: PlanSelectionPaywallProps) {
  const [selectedPackage, setSelectedPackage] = useState<'starter' | 'plus' | 'pro'>('plus');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to results
        </Button>
      )}
      
      <div className="text-center space-y-3">
        <h2 className="text-display-md font-bold text-foreground">
          Choose Your Plan
        </h2>
        <p className="text-body-lg text-muted-foreground">
          Start your 7-day free trial • Cancel anytime
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="flex justify-center items-center gap-8 flex-wrap py-4">
        <div className="flex items-center gap-2 text-body text-muted-foreground">
          <Shield className="w-5 h-5 text-brain-health-600" />
          <span>No credit card required</span>
        </div>
        <div className="flex items-center gap-2 text-body text-muted-foreground">
          <Users className="w-5 h-5 text-brain-health-600" />
          <span>10,000+ active members</span>
        </div>
        <div className="flex items-center gap-2 text-body text-muted-foreground">
          <Sparkles className="w-5 h-5 text-brain-health-600" />
          <span>Evidence-based approach</span>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative transition-all cursor-pointer ${
              selectedPackage === pkg.id
                ? 'border-brain-health-600 border-2 shadow-md'
                : 'border-border shadow-sm hover:border-brain-health-300'
            } ${pkg.recommended ? 'border-brain-health-600 border-2' : ''}`}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            {pkg.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-brain-health-600 text-white px-4 py-1">
                  Recommended
                </Badge>
              </div>
            )}
            
            {pkg.trial && (
              <div className="absolute -top-3 right-4">
                <Badge className="bg-brain-health-100 text-brain-health-700 px-3 py-1">
                  {pkg.trial}
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-title mb-2">{pkg.name}</CardTitle>
              <div className="space-y-1">
                <div className="text-display-lg font-bold text-foreground">
                  {pkg.price}
                </div>
                {pkg.priceDetail && (
                  <div className="text-caption text-muted-foreground">
                    {pkg.priceDetail}
                  </div>
                )}
              </div>
              <p className="text-body text-muted-foreground mt-2">
                {pkg.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-body">
                    <Check className="w-5 h-5 text-brain-health-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <Button
          onClick={() => onComplete(selectedPackage)}
          size="lg"
          variant="premium"
          className="min-w-[300px]"
        >
          {selectedPackage === 'starter' 
            ? 'Start with Starter (Free)' 
            : `Start 7-Day Free Trial - ${packages.find(p => p.id === selectedPackage)?.name}`
          }
        </Button>
        
        <p className="text-caption text-muted-foreground">
          You can cancel anytime during your free trial
        </p>
      </div>
    </div>
  );
}