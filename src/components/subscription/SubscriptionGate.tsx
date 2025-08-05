import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, Star, Crown, Users, Zap, ArrowRight, Clock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface SubscriptionGateProps {
  onPlanSelected: (planType: 'basic' | 'premium' | 'family') => void;
  onContinueFree: () => void;
  showFreeTrial?: boolean;
}

export function SubscriptionGate({ onPlanSelected, onContinueFree, showFreeTrial = true }: SubscriptionGateProps) {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'family' | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const plans = [
    {
      id: 'basic' as const,
      name: 'MyRhythm Align',
      monthlyPrice: '£5.99',
      yearlyPrice: '£59.99',
      description: 'Perfect for individual recovery',
      icon: <Zap className="w-6 h-6" />,
      features: [
        'Daily empowerment rituals',
        'PACT goal tracking',
        'Memory exercises',
        'Progress analytics',
        'Community access'
      ],
      popular: false
    },
    {
      id: 'premium' as const,
      name: 'MyRhythm Restore',
      monthlyPrice: '£9.99',
      yearlyPrice: '£99.99',
      description: 'Complete cognitive recovery toolkit',
      icon: <Crown className="w-6 h-6" />,
      features: [
        'Everything in Align',
        'Advanced brain training',
        'Personalized coaching',
        'Medical tracking',
        'Priority support',
        'Family sharing (2 accounts)'
      ],
      popular: true
    },
    {
      id: 'family' as const,
      name: 'MyRhythm Family',
      monthlyPrice: '£19.99',
      yearlyPrice: '£199.99',
      description: 'Support for the whole care team',
      icon: <Users className="w-6 h-6" />,
      features: [
        'Everything in Restore',
        'Up to 6 family accounts',
        'Caregiver dashboard',
        'Family progress sharing',
        'Care coordination tools',
        'Video consultations'
      ],
      popular: false
    }
  ];

  const handleSelectPlan = (planType: 'basic' | 'premium' | 'family') => {
    setSelectedPlan(planType);
    toast.success(`${plans.find(p => p.id === planType)?.name} selected! Starting your 7-day free trial...`);
    
    // Simulate subscription flow
    setTimeout(() => {
      onPlanSelected(planType);
    }, 1000);
  };

  const handleContinueFree = () => {
    toast.info("Starting with limited features. You can upgrade anytime!");
    onContinueFree();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        {showFreeTrial && (
          <Badge variant="secondary" className="mb-2">
            <Clock className="w-4 h-4 mr-2" />
            7-Day Free Trial - No Credit Card Required
          </Badge>
        )}
        
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-beacon-600 bg-clip-text text-transparent">
          Choose Your Recovery Journey
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Start your free trial today. Cancel anytime, no questions asked.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={cn("text-sm", !isYearly ? "font-medium" : "text-muted-foreground")}>
          Monthly
        </span>
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />
        <span className={cn("text-sm", isYearly ? "font-medium" : "text-muted-foreground")}>
          Yearly
        </span>
        {isYearly && (
          <Badge variant="secondary" className="ml-2">Save 20%</Badge>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "relative border-2 transition-all duration-300 hover:shadow-lg",
              plan.popular ? "border-primary scale-105" : "border-border hover:border-primary/50",
              selectedPlan === plan.id && "ring-2 ring-primary"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center">
                {plan.icon}
              </div>
              
              <div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </div>
              
              <div className="space-y-1">
                <div className="text-3xl font-bold">
                  {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </div>
                <div className="text-sm text-muted-foreground">
                  per {isYearly ? 'year' : 'month'}
                </div>
                {showFreeTrial && (
                  <Badge variant="outline" className="mt-2">
                    7 days free, then charged
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={selectedPlan === plan.id}
                className={cn(
                  "w-full py-3",
                  plan.popular
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-secondary hover:bg-secondary/90"
                )}
              >
                {selectedPlan === plan.id ? (
                  "Selected"
                ) : showFreeTrial ? (
                  <>
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Select Plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Free Option */}
      <div className="text-center space-y-4 pt-8 border-t">
        <h3 className="text-lg font-medium">Not ready to commit?</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Try MyRhythm with limited features. You can upgrade anytime to unlock the full experience.
        </p>
        <Button
          variant="outline"
          onClick={handleContinueFree}
          className="px-8"
        >
          Continue with Limited Features
        </Button>
      </div>
    </div>
  );
}