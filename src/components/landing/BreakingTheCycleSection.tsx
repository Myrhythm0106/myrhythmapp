import React from "react";
import { NegativeStatementsGrid } from "@/components/founders-story/NegativeStatementsGrid";
import { ArrowDown, Heart } from "lucide-react";
import { ScrollReveal } from "./premium/ScrollReveal";

export function BreakingTheCycleSection() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-20">
            <h2 className="text-display-md font-display tracking-tight text-gray-900 mb-6">
              Breaking the Cycle
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Replace discouraging words with empowerment
            </p>
          </div>
        </ScrollReveal>

        {/* Negative Statements */}
        <ScrollReveal delay={200}>
          <div className="mb-16">
            <NegativeStatementsGrid />
          </div>
        </ScrollReveal>

        {/* Transformation Arrow */}
        <div className="flex justify-center mb-16">
          <div className="bg-gray-100 rounded-full p-6">
            <ArrowDown className="w-10 h-10 text-gray-600" />
          </div>
        </div>

        {/* Empowering Alternative */}
        <ScrollReveal delay={400}>
          <div className="bg-gradient-to-br from-brand-emerald-50 to-brand-teal-50 rounded-2xl p-12 border-l-4 border-brand-emerald-600">
            <div className="text-center space-y-8">
              <div className="flex justify-center items-center gap-3 mb-8">
                <Heart className="w-8 h-8 text-brand-emerald-600 fill-current" />
                <h3 className="text-3xl font-semibold text-gray-900">
                  The MyRhythm Difference
                </h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-brand-emerald-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    "You're making incredible progress"
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Celebrate every win and build momentum
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-brand-emerald-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    "You have the power to improve"
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Take control with confidence
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-brand-emerald-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    "Your strategies are working"
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Discover what works for you
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-brand-emerald-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    "Trust your journey"
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Celebrate your unique rhythm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
