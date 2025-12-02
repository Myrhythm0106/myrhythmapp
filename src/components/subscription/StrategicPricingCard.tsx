import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Zap, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { isFoundingMemberActive, getPremiumPricing } from "@/config/pricing";

interface StrategicPricingCardProps {
  onSelectPlan: (planType: 'premium') => void;
  onContinueFree: () => void;
  showFreeOption?: boolean;
}

export function StrategicPricingCard({ onSelectPlan, onContinueFree, showFreeOption = true }: StrategicPricingCardProps) {
  const [isYearly, setIsYearly] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);
  
  const isFoundingActive = isFoundingMemberActive();
  const pricing = getPremiumPricing(isYearly);

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
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Simple, Transparent Pricing
        </h2>
        <p className="text-muted-foreground text-lg mb-6">
          One plan. Everything included. Start with a 7-day free trial.
        </p>
        
        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-4 p-2 bg-muted/50 rounded-xl">
          <button
            onClick={() => setIsYearly(false)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              !isYearly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
              isYearly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Annual
            <Badge className="bg-primary text-primary-foreground text-xs">Save £20</Badge>
          </button>
        </div>
      </div>

      {/* Premium Card */}
      <Card className="border-2 border-primary relative overflow-hidden">
        {isFoundingActive && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-2 text-center text-sm font-medium">
            <Sparkles className="inline-block h-4 w-4 mr-2" />
            Founding Member Price
          </div>
        )}
        
        <CardHeader className={cn("text-center", isFoundingActive && "pt-14")}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">MyRhythm Premium</CardTitle>
          </div>
          
          <div className="mt-4">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold">£{pricing.price}</span>
              <span className="text-muted-foreground">/{isYearly ? 'year' : 'month'}</span>
            </div>
            
            {pricing.regularPrice && (
              <p className="text-sm text-muted-foreground mt-2">
                <span className="line-through">£{pricing.regularPrice}/{isYearly ? 'year' : 'month'}</span>
                <span className="text-primary ml-2 font-medium">Save £{pricing.savings}</span>
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button 
            onClick={handleSelectPlan}
            disabled={isSelecting}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
          >
            {isSelecting ? (
              'Processing...'
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Start 7-Day Free Trial
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            No payment required to start • Cancel anytime • 30-day money-back guarantee
          </p>
        </CardContent>
      </Card>

      {/* Continue Free Option */}
      {showFreeOption && (
        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            onClick={onContinueFree}
            className="text-muted-foreground hover:text-foreground"
          >
            Continue with limited free access
          </Button>
        </div>
      )}
    </div>
  );
}
