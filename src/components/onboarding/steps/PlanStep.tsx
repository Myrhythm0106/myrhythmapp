import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { CheckCircle, Heart, Shield, Sparkles, Crown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { plans } from "./plan/plansData";
import { PlanType, PlanStepProps } from "./plan/types";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PaymentDetailsForm } from "@/components/payment/PaymentDetailsForm";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { isFoundingMemberActive } from "@/config/pricing";

export type { PlanType };

export const PlanStep = ({ onComplete, selectedPlan = "premium" }: PlanStepProps) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const isMobile = useIsMobile();
  const { updateSubscription } = useSubscription();
  const isFoundingActive = isFoundingMemberActive();

  const pricing = {
    monthly: isFoundingActive ? 10 : 15,
    yearly: isFoundingActive ? 100 : 150
  };

  const handleStartTrial = () => {
    // Set trial flags
    localStorage.setItem('trial_started', 'true');
    localStorage.setItem('selected_plan', 'premium');
    localStorage.setItem('selected_billing', isAnnual ? 'annual' : 'monthly');
    
    toast.success("Welcome to your 7-day free trial! Starting your assessment...");
    
    // Navigate directly to assessment with trial flag
    window.location.href = '/mvp/assessment-flow?trial=1&flow=post-trial';
  };

  const handleSubscribeNow = () => {
    setShowPaymentForm(true);
  };

  const handlePaymentComplete = (paymentDetails: any) => {
    console.log("PlanStep: Payment completed for premium plan");
    
    // Update subscription status (smart_pro is the premium tier)
    updateSubscription('smart_pro');
    
    // Set localStorage flags for progress tracking
    localStorage.setItem('payment_success', 'true');
    localStorage.setItem('selected_plan', 'premium');
    localStorage.setItem('selected_billing', isAnnual ? 'annual' : 'monthly');
    localStorage.setItem('onboarding_started', 'true');
    
    // Navigate to welcome page
    window.location.href = '/welcome?postCheckout=1&trial=1';
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
  };

  // Show payment form if selected
  if (showPaymentForm) {
    const plan = plans[0]; // Only one plan now
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4">
        <PaymentDetailsForm
          selectedPlan={{
            name: plan.name,
            price: isAnnual ? `£${pricing.yearly}/year` : `£${pricing.monthly}/month`,
            trialDays: 7
          }}
          onSubmit={handlePaymentComplete}
          onCancel={handlePaymentCancel}
        />
      </div>
    );
  }

  const features = [
    "Unlimited Memory Bridge recordings",
    "Brain Health Reminders with escalation",
    "Daily Brain Boost (240+ challenges)",
    "Support Circle (5 members)",
    "LEAP Assessment & Analytics",
    "Calendar Integration",
    "Progress Tracking & Reports",
    "Priority support"
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Start Your Journey
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          One simple plan. Everything included. Start with a <strong>7-day free trial</strong>.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={cn("text-sm font-medium", !isAnnual ? "text-foreground" : "text-muted-foreground")}>
          Monthly
        </span>
        <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
        <span className={cn("text-sm font-medium", isAnnual ? "text-foreground" : "text-muted-foreground")}>
          Annual
        </span>
        {isAnnual && (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Save £20/year
          </Badge>
        )}
      </div>

      {/* Single Premium Card */}
      <Card className="border-2 border-primary relative overflow-hidden max-w-lg mx-auto">
        {isFoundingActive && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-2 text-center text-sm font-medium">
            <Sparkles className="inline-block h-4 w-4 mr-2" />
            Founding Member Price - Lock in {isAnnual ? '£100/year' : '£10/month'} forever
          </div>
        )}
        
        <CardContent className={cn("p-6 space-y-6", isFoundingActive && "pt-14")}>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold">MyRhythm Premium</h3>
            </div>
            
            <div className="flex items-baseline justify-center gap-2 mt-4">
              <span className="text-4xl font-bold">
                £{isAnnual ? pricing.yearly : pricing.monthly}
              </span>
              <span className="text-muted-foreground">
                /{isAnnual ? 'year' : 'month'}
              </span>
            </div>
            
            {isFoundingActive && (
              <p className="text-sm text-muted-foreground mt-2">
                <span className="line-through">£{isAnnual ? '150' : '15'}/{isAnnual ? 'year' : 'month'}</span>
                <span className="text-primary ml-2">Save £{isAnnual ? '50' : '5'}</span>
              </p>
            )}
          </div>

          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <Button 
              onClick={handleStartTrial}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start 7-Day Free Trial
            </Button>
            
            <p className="text-center text-xs text-muted-foreground">
              No payment required to start • Cancel anytime
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <div className="grid grid-cols-3 gap-4 text-center max-w-lg mx-auto">
        <div className="space-y-2">
          <CheckCircle className="h-6 w-6 mx-auto text-primary" />
          <p className="text-xs text-muted-foreground">Full Access</p>
        </div>
        <div className="space-y-2">
          <Heart className="h-6 w-6 mx-auto text-primary" />
          <p className="text-xs text-muted-foreground">No Commitment</p>
        </div>
        <div className="space-y-2">
          <Shield className="h-6 w-6 mx-auto text-primary" />
          <p className="text-xs text-muted-foreground">Cancel Anytime</p>
        </div>
      </div>
    </div>
  );
};
