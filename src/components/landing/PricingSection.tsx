
import React from "react";
import PlanCard from "./PlanCard";
import { useNavigate } from "react-router-dom";

interface PricingSectionProps {
  onSelectPlan?: (plan: string) => void;
}

const PricingSection = ({ onSelectPlan }: PricingSectionProps) => {
  const navigate = useNavigate();
  
  const handleSelectPlan = (plan: string) => {
    if (onSelectPlan) {
      onSelectPlan(plan);
    } else {
      navigate('/subscribe');
    }
  };

  return (
    <section className="py-16 bg-muted/40">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Choose Your MyRhythm Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every plan includes a 7-day trial to discover your personal LEAP pattern and build unstoppable momentum.
            Choose the level that fits your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <PlanCard
            title="MyStarter"
            description="Perfect start with your support circle included"
            price={
              <>
                <div className="text-3xl font-bold">£7</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </>
            }
            features={[
              "✨ 3 Free Support Circle Members",
              "Your LEAP Assessment & Results",
              "Personal Rhythm Discovery",
              "Basic Calendar & Goals",
              "Memory Enhancement Tools",
              "Smart Break Reminders",
              "Brain Games & Exercises",
              "Daily Progress Tracking"
            ]}
            buttonText="Start with MyStarter"
            onSelectPlan={() => handleSelectPlan('starter')}
          />

          <PlanCard
            title="MyStretch"
            description="Enhanced experience with connected care network"
            price={
              <>
                <div className="text-3xl font-bold">£13</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </>
            }
            features={[
              "✨ 3 Free Support Circle Members",
              "Everything in MyStarter",
              "Advanced LEAP Analytics",
              "Personalized Momentum Insights", 
              "Priority Customer Support",
              "Advanced Calendar Management",
              "Goal Achievement Coaching",
              "Premium Brain Training",
              "Detailed Progress Reports"
            ]}
            buttonText="Start with MyStretch"
            isPopular={true}
            onSelectPlan={() => handleSelectPlan('smart_pro')}
          />

          <PlanCard
            title="MyLeap"
            description="Complete family wellness with unlimited support"
            price={
              <>
                <div className="text-3xl font-bold">£20</div>
<div className="text-sm text-muted-foreground">per month</div>
              </>
            }
            features={[
              "✨ 3 Free Support Circle Members",
              "Everything in MyStretch",
              "Up to 6 Family Members",
              "Shared Family Calendar",
              "Family Time Scheduling",
              "Family Progress Tracking", 
              "Collaborative Goal Setting",
              "Family Support Resources",
              "Dedicated Family Coach",
              "Unlimited Support Circle Growth"
            ]}
            buttonText="Start with MyLeap"
            buttonVariant="outline"
            onSelectPlan={() => handleSelectPlan('family_smart')}
          />
        </div>

        <div className="text-center bg-gradient-to-r from-teal-50 to-emerald-50 p-6 rounded-lg border border-teal-200">
          <h3 className="font-semibold text-teal-900 mb-2">
            🤝 Connected Care Experience - Starting at £7
          </h3>
          <p className="text-sm text-teal-800 max-w-3xl mx-auto">
            Every plan includes: <strong>3 Free Support Circle Members</strong> • LEAP Assessment & Results • Personal Rhythm Discovery • Memory Enhancement Tools • 
            Goal Setting & Progress Tracking • Brain Training • Community Access • Momentum Building Insights. 
            <strong>Build your connected care network from day one!</strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
