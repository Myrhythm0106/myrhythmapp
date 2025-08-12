import React from "react";
import { NegativeStatementsGrid } from "@/components/founders-story/NegativeStatementsGrid";
import { ArrowDown, Heart, Sparkles } from "lucide-react";

export function BreakingTheCycleSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-red-50/30 via-purple-50/40 to-brain-health-50/30">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Stop the Cycle of 
            <span className="block bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
              Hurtful Words
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
            Too often, people with memory challenges hear these discouraging phrases. 
            <span className="block mt-2 font-semibold text-purple-700">
              MyRhythm replaces these words with empowerment.
            </span>
          </p>
        </div>

        {/* Negative Statements Grid */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              What you might be hearing...
            </h3>
          </div>
          <NegativeStatementsGrid />
        </div>

        {/* Transformation Arrow */}
        <div className="flex justify-center mb-16">
          <div className="bg-white rounded-full p-6 shadow-xl border-4 border-purple-200">
            <ArrowDown className="w-12 h-12 text-purple-600 animate-bounce" />
          </div>
        </div>

        {/* Empowering Alternative */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-12 border-l-8 border-green-500 shadow-2xl">
          <div className="text-center space-y-8">
            <div className="flex justify-center items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-green-600 fill-current" />
              <h3 className="text-3xl font-bold text-gray-900">
                What you'll experience with MyRhythm
              </h3>
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
                <h4 className="text-xl font-semibold text-green-800 mb-3">
                  "You're making incredible progress!"
                </h4>
                <p className="text-gray-700 italic">
                  Celebrate every small win and build momentum daily
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
                <h4 className="text-xl font-semibold text-green-800 mb-3">
                  "You have the power to improve"
                </h4>
                <p className="text-gray-700 italic">
                  Take control of your cognitive journey with confidence
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
                <h4 className="text-xl font-semibold text-green-800 mb-3">
                  "Your strategies are working beautifully"
                </h4>
                <p className="text-gray-700 italic">
                  Discover and strengthen what works best for you
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
                <h4 className="text-xl font-semibold text-green-800 mb-3">
                  "You're exactly where you need to be"
                </h4>
                <p className="text-gray-700 italic">
                  Trust your journey and celebrate your unique rhythm
                </p>
              </div>
            </div>

            <div className="mt-12 p-8 bg-gradient-to-r from-purple-100 to-green-100 rounded-2xl">
              <p className="text-2xl font-bold text-gray-900 mb-4">
                That's the MyRhythm difference.
              </p>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                We replace judgment with empowerment, confusion with clarity, and doubt with confidence. 
                Your memory challenges become opportunities for growth and self-discovery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}