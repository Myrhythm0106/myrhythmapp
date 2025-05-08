
import React from "react";
import PlanCard from "./PlanCard";

interface PricingSectionProps {
  onSelectPlan: (plan: string) => void;
}

const PricingSection = ({ onSelectPlan }: PricingSectionProps) => {
  return (
    <section className="py-16 bg-muted/40">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Choose Your Plan</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the plan that best fits your needs and start your journey to better brain health and productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <PlanCard
            title="Basic Plan"
            description="Essential features for individual support"
            price={
              <>
                <div className="text-3xl font-bold">Free for 7 days</div>
                <div className="text-sm text-muted-foreground">Then $7.99/month</div>
              </>
            }
            features={[
              "Basic symptom tracking",
              "Limited calendar features",
              "Access to public resources",
              "Community forum access"
            ]}
            buttonText="Start Free Trial"
            onSelectPlan={onSelectPlan}
          />

          <PlanCard
            title="Premium Plan"
            description="Enhanced features for your recovery journey"
            price={<div className="text-3xl font-bold">$9.99<span className="text-base font-normal text-muted-foreground">/month</span></div>}
            features={[
              "Advanced symptom tracking",
              "Full calendar management",
              "Complete resource library",
              "Community forum participation",
              "Personalized insights",
              "Priority support"
            ]}
            buttonText="Choose Premium"
            isPopular={true}
            onSelectPlan={onSelectPlan}
          />

          <PlanCard
            title="Family Plan"
            description="Support for caregivers and families"
            price={<div className="text-3xl font-bold">$19.99<span className="text-base font-normal text-muted-foreground">/month</span></div>}
            features={[
              "All Premium features",
              "Multiple user accounts",
              "Shared calendars",
              "Caregiver resources",
              "Family support group",
              "Dedicated case manager",
              "24/7 emergency support"
            ]}
            buttonText="Choose Family Plan"
            buttonVariant="outline"
            onSelectPlan={onSelectPlan}
          />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
