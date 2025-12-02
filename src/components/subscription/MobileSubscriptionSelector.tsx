import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, Crown, Zap, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { isFoundingMemberActive } from "@/config/pricing";

interface MobileSubscriptionSelectorProps {
  onSelectPlan: (planType: 'premium') => void;
  onContinueFree?: () => void;
}

export function MobileSubscriptionSelector({ onSelectPlan, onContinueFree }: MobileSubscriptionSelectorProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const isFoundingActive = isFoundingMemberActive();

  const pricing = {
    monthly: isFoundingActive ? 10 : 15,
    yearly: isFoundingActive ? 100 : 150,
    regularMonthly: 15,
    regularYearly: 150
  };

  const features = [
    'Unlimited Memory Bridge recordings',
    'Brain Health Reminders with escalation',
    'Daily Brain Boost (240+ challenges)',
    'Support Circle (5 members)',
    'LEAP Assessment & Analytics',
    'Calendar Integration',
    'Progress Tracking & Reports',
    'Priority support'
  ];

  const handleSelectPlan = () => {
    setIsSelecting(true);
    const billingPeriod = isYearly ? 'yearly' : 'monthly';
    toast.success(`MyRhythm Premium (${billingPeriod}) selected!`);
    
    setTimeout(() => {
      onSelectPlan('premium');
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">MyRhythm Premium</h2>
        <p className="text-muted-foreground">
          Everything you need for your cognitive empowerment journey
        </p>
      </div>

      {/* Founding Member Banner */}
      {isFoundingActive && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-2 text-primary font-medium">
            <Sparkles className="h-4 w-4" />
            <span>Founding Member Pricing</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Lock in £10/month forever - limited to first 500 users
          </p>
        </div>
      )}

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 p-4 bg-muted/50 rounded-xl">
        <span className={cn(
          "text-sm font-medium transition-colors",
          !isYearly ? "text-foreground" : "text-muted-foreground"
        )}>
          Monthly
        </span>
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
          className="data-[state=checked]:bg-primary"
        />
        <span className={cn(
          "text-sm font-medium transition-colors",
          isYearly ? "text-foreground" : "text-muted-foreground"
        )}>
          Annual
        </span>
        {isYearly && (
          <Badge className="bg-primary text-primary-foreground">
            Save £20
          </Badge>
        )}
      </div>

      {/* Single Premium Card */}
      <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">MyRhythm Premium</CardTitle>
          </div>
          
          <div className="mt-4">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold">
                £{isYearly ? pricing.yearly : pricing.monthly}
              </span>
              <span className="text-muted-foreground">
                /{isYearly ? 'year' : 'month'}
              </span>
            </div>
            
            {isFoundingActive && (
              <p className="text-sm text-muted-foreground mt-1">
                <span className="line-through">
                  £{isYearly ? pricing.regularYearly : pricing.regularMonthly}
                </span>
                <span className="text-primary ml-2">
                  Save £{isYearly ? (pricing.regularYearly - pricing.yearly) : (pricing.regularMonthly - pricing.monthly)}
                </span>
              </p>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mt-2">
            7-day free trial included
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button 
            onClick={handleSelectPlan}
            disabled={isSelecting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            {isSelecting ? (
              'Processing...'
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Start 7-Day Free Trial
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground space-y-1 pt-4">
        <p>• 7-day free trial - no charge until trial ends</p>
        <p>• Cancel anytime in settings</p>
        <p>• 30-day money-back guarantee</p>
      </div>
    </div>
  );
}
