
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
          <h2 className="text-3xl font-bold mb-3">Choose Your Memory Partner Plan</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every plan includes a 7-day trial to experience how MyRhythm becomes your trusted memory partner.
            Choose the level of memory support that fits your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <PlanCard
            title="Memory Partner Starter"
            description="Essential memory support for daily life"
            price={
              <>
                <div className="text-3xl font-bold">7 Days Free</div>
                <div className="text-sm text-muted-foreground">Then £5.99/month</div>
              </>
            }
            features={[
              "Daily memory logging & tracking",
              "Important moments capture",
              "Smart reminder system", 
              "Memory pattern insights",
              "Progress celebrations",
              "15-minute daily reflections"
            ]}
            buttonText="Start Memory Trial"
            onSelectPlan={onSelectPlan}
          />

          <PlanCard
            title="Memory Partner Pro"
            description="Complete memory empowerment toolkit"
            price={
              <>
                <div className="text-3xl font-bold">7 Days Free</div>
                <div className="text-sm text-muted-foreground">Then £9.99/month</div>
              </>
            }
            features={[
              "All Starter features included",
              "Advanced memory analytics",
              "AI-powered memory insights", 
              "Voice-to-text logging",
              "Memory trigger alerts",
              "Walking & step integration",
              "Personalized memory exercises",
              "Priority memory coaching support"
            ]}
            buttonText="Start Pro Trial"
            isPopular={true}
            onSelectPlan={onSelectPlan}
          />

          <PlanCard
            title="Memory Partner Care Team"
            description="Professional memory support with care coordination"
            price={
              <>
                <div className="text-3xl font-bold">7 Days Free</div>
                <div className="text-sm text-muted-foreground">Then £15.99/month</div>
              </>
            }
            features={[
              "All Memory Partner Pro features",
              "Care team dashboard & alerts",
              "Professional progress reports",
              "Medical appointment integration", 
              "Family/caregiver collaboration tools",
              "Emergency memory support access",
              "HIPAA-compliant data sharing",
              "Dedicated memory care specialist"
            ]}
            buttonText="Start Care Team Trial"
            buttonVariant="outline"
            onSelectPlan={onSelectPlan}
          />
        </div>

        <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            🧠 Your 7-Day Memory Partner Experience
          </h3>
          <p className="text-sm text-blue-800 max-w-3xl mx-auto">
            Every trial includes: Memory assessment • Important moments logging • Smart reminders • 
            Walking integration • 15-minute reflections • Progress tracking • Success celebrations • Personal memory insights. 
            <strong>See real memory improvement in just 7 days!</strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
