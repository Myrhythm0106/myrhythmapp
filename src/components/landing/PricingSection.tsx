
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
          <h2 className="text-3xl font-bold mb-3">Choose Your MyRhythm Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every plan includes a 7-day trial to discover your personal LEAP pattern and build unstoppable momentum.
            Choose the level that fits your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <PlanCard
            title="MyRhythm Align"
            description="Foundation for aligning memory, focus, and daily rhythm"
            price={
              <>
                <div className="text-3xl font-bold">7 Days Free</div>
                <div className="text-sm text-muted-foreground">Then £5.99/month</div>
              </>
            }
            features={[
              "Your LEAP Assessment & Results",
              "Personal Rhythm Discovery",
              "Basic Calendar & Goals",
              "Memory Enhancement Tools",
              "Brain Games & Exercises",
              "Daily Progress Tracking"
            ]}
            buttonText="Start with Align"
            onSelectPlan={onSelectPlan}
          />

          <PlanCard
            title="MyRhythm Flow"
            description="Complete flow experience with advanced momentum building"
            price={
              <>
                <div className="text-3xl font-bold">7 Days Free</div>
                <div className="text-sm text-muted-foreground">Then £9.99/month</div>
              </>
            }
            features={[
              "Everything in MyRhythm Align",
              "Advanced LEAP Analytics",
              "Personalized Momentum Insights", 
              "Priority Customer Support",
              "Advanced Calendar Management",
              "Goal Achievement Coaching",
              "Premium Brain Training",
              "Detailed Progress Reports"
            ]}
            buttonText="Start with Flow"
            isPopular={true}
            onSelectPlan={onSelectPlan}
          />

          <PlanCard
            title="MyRhythm Thrive"
            description="Complete family wellness journey to help everyone thrive"
            price={
              <>
                <div className="text-3xl font-bold">7 Days Free</div>
                <div className="text-sm text-muted-foreground">Then £15.99/month</div>
              </>
            }
            features={[
              "Everything in MyRhythm Flow",
              "Up to 4 Family Members",
              "Shared Family Calendar",
              "Family Progress Tracking", 
              "Collaborative Goal Setting",
              "Family Support Resources",
              "Dedicated Family Coach",
              "Emergency Contact System"
            ]}
            buttonText="Start with Thrive"
            buttonVariant="outline"
            onSelectPlan={onSelectPlan}
          />
        </div>

        <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            🧠 Your 7-Day MyRhythm Experience
          </h3>
          <p className="text-sm text-blue-800 max-w-3xl mx-auto">
            Every trial includes: LEAP Assessment & Results • Personal Rhythm Discovery • Memory Enhancement Tools • 
            Goal Setting & Progress Tracking • Brain Training • Community Access • Momentum Building Insights. 
            <strong>Discover your unique LEAP pattern in just 7 days!</strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
