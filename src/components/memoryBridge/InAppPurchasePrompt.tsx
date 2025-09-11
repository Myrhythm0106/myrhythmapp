import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Zap, 
  Users, 
  Calendar,
  Shield,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface InAppPurchasePromptProps {
  trigger: 'post-value' | 'feature-gate' | 'usage-limit';
  context?: string;
  onUpgrade?: () => void;
  onDismiss?: () => void;
}

export function InAppPurchasePrompt({ 
  trigger, 
  context, 
  onUpgrade, 
  onDismiss 
}: InAppPurchasePromptProps) {
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'plus' | 'pro'>('plus');

  const plans = {
    starter: {
      name: 'Starter',
      price: '$9.99',
      period: '/month',
      popular: false,
      features: [
        '50 recordings per month',
        'Basic ACT extraction',
        'Calendar integration',
        'Mobile app access',
        'Email support'
      ],
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    plus: {
      name: 'Plus',
      price: '$19.99',
      period: '/month',
      popular: true,
      features: [
        'Unlimited recordings',
        'Advanced AI extraction',
        'Support circle (5 members)',
        'Calendar sync + scheduling',
        'Analytics dashboard',
        'Priority support',
        'Export capabilities'
      ],
      color: 'text-memory-emerald-600',
      bg: 'bg-memory-emerald-50',
      border: 'border-memory-emerald-200'
    },
    pro: {
      name: 'Pro',
      price: '$39.99',
      period: '/month',
      popular: false,
      features: [
        'Everything in Plus',
        'Unlimited support circle',
        'Advanced analytics',
        'API access',
        'Custom integrations',
        'Dedicated support',
        'Team collaboration'
      ],
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200'
    }
  };

  const getTriggerMessage = () => {
    switch (trigger) {
      case 'post-value':
        return {
          title: "🎉 Amazing! You've experienced the power of Memory Bridge",
          subtitle: "Ready to unlock unlimited potential and build stronger accountability?"
        };
      case 'feature-gate':
        return {
          title: "Unlock More with Memory Bridge Plus",
          subtitle: `${context || 'This feature'} requires a subscription to help you stay accountable`
        };
      case 'usage-limit':
        return {
          title: "You're making great progress!",
          subtitle: "Upgrade to continue capturing unlimited commitments and actions"
        };
      default:
        return {
          title: "Upgrade to Memory Bridge Plus",
          subtitle: "Unlock the full power of AI-driven accountability"
        };
    }
  };

  const { title, subtitle } = getTriggerMessage();

  const handleStartTrial = () => {
    toast.success('7-day free trial started! No card required.');
    onUpgrade?.();
  };

  const handleUpgrade = () => {
    toast.success(`Upgrading to ${plans[selectedPlan].name} plan...`);
    onUpgrade?.();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{title}</CardTitle>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>
            {onDismiss && (
              <Button variant="ghost" size="sm" onClick={onDismiss}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Free Trial CTA */}
          <Card className="border-2 border-memory-emerald-200 bg-gradient-to-r from-memory-emerald-50 to-brain-health-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <Sparkles className="h-8 w-8 mx-auto mb-3 text-memory-emerald-600" />
                <h3 className="text-xl font-semibold text-memory-emerald-900 mb-2">
                  Start Your Free Trial
                </h3>
                <p className="text-memory-emerald-700 mb-4">
                  7 days of Memory Bridge Plus - No card required!
                </p>
                <Button 
                  onClick={handleStartTrial}
                  size="lg"
                  className="bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Plan Selection */}
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(plans).map(([key, plan]) => (
              <Card 
                key={key}
                className={`cursor-pointer transition-all ${
                  selectedPlan === key 
                    ? `border-2 ${plan.border} ${plan.bg}` 
                    : 'border hover:border-muted-foreground/20'
                }`}
                onClick={() => setSelectedPlan(key as any)}
              >
                <CardHeader className="text-center">
                  {plan.popular && (
                    <Badge className="mx-auto mb-2 bg-memory-emerald-100 text-memory-emerald-800">
                      Most Popular
                    </Badge>
                  )}
                  <CardTitle className="flex items-center justify-center gap-2">
                    {key === 'starter' && <Calendar className="h-5 w-5 text-blue-600" />}
                    {key === 'plus' && <Crown className="h-5 w-5 text-memory-emerald-600" />}
                    {key === 'pro' && <Shield className="h-5 w-5 text-purple-600" />}
                    {plan.name}
                  </CardTitle>
                  <div className="text-3xl font-bold">
                    {plan.price}<span className="text-lg text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center pt-4">
            <Button 
              onClick={handleUpgrade}
              size="lg"
              className="bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700"
            >
              Upgrade to {plans[selectedPlan].name}
            </Button>
            {onDismiss && (
              <Button variant="outline" size="lg" onClick={onDismiss}>
                Maybe Later
              </Button>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="text-center space-y-2 pt-4 border-t">
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Secure payments
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Cancel anytime
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                No hidden fees
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              30-day money-back guarantee • Used by thousands of professionals
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}