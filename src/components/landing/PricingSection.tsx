import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Crown, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { isFoundingMemberActive, foundingMemberConfig } from "@/config/pricing";

interface PricingSectionProps {
  onSelectPlan?: (plan: string) => void;
}

const PricingSection = ({ onSelectPlan }: PricingSectionProps) => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const isFoundingActive = isFoundingMemberActive();
  
  const monthlyPrice = isFoundingActive ? 10 : 15;
  const annualPrice = isFoundingActive ? 100 : 150;
  const regularMonthly = 15;
  const regularAnnual = 150;
  
  const handleSelectPlan = () => {
    if (onSelectPlan) {
      onSelectPlan('premium');
    } else {
      navigate('/subscribe');
    }
  };

  const features = [
    "7-day free trial - no charge until trial ends",
    "Unlimited Memory Bridge recordings",
    "Brain Health Reminders with escalation",
    "Daily Brain Boost (240+ challenges)",
    "Support Circle (5 members included)",
    "LEAP Assessment & Analytics",
    "Calendar Integration",
    "Progress Tracking & Reports",
    "Promise Score tracking",
    "Streak celebrations & motivation",
    "Priority customer support"
  ];

  return (
    <section className="py-16 bg-muted/40">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            One plan. Everything included. Start with a 7-day free trial.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
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
        <Card className="border-2 border-primary relative overflow-hidden">
          {isFoundingActive && (
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-2 text-center text-sm font-medium">
              <Sparkles className="inline-block h-4 w-4 mr-2" />
              Founding Member Price - Lock in {isAnnual ? '£100/year' : '£10/month'} forever
            </div>
          )}
          
          <CardHeader className={cn("text-center", isFoundingActive && "pt-14")}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">MyRhythm Premium</CardTitle>
            </div>
            
            <div className="mt-4">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold">
                  £{isAnnual ? annualPrice : monthlyPrice}
                </span>
                <span className="text-muted-foreground">
                  /{isAnnual ? 'year' : 'month'}
                </span>
              </div>
              
              {isFoundingActive && (
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="line-through">£{isAnnual ? regularAnnual : regularMonthly}/{isAnnual ? 'year' : 'month'}</span>
                  <span className="text-primary ml-2 font-medium">
                    Save £{isAnnual ? (regularAnnual - annualPrice) : (regularMonthly - monthlyPrice)}/{isAnnual ? 'year' : 'month'}
                  </span>
                </p>
              )}
              
              <p className="text-sm text-muted-foreground mt-1">
                That's less than {isAnnual ? '£2/week' : 'a coffee/week'}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className={index === 0 ? "font-medium text-primary" : ""}>{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              onClick={handleSelectPlan}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              No payment required to start • Cancel anytime • 30-day money-back guarantee
            </p>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Join our community of people building better memory habits
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>✓ Secure payment</span>
            <span>✓ Cancel anytime</span>
            <span>✓ GDPR compliant</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
