import React from "react";
import { ScrollReveal } from "./premium/ScrollReveal";
import { Shield, Heart, TrendingUp } from "lucide-react";

export function StatisticsSection() {
  const stats = [
    {
      number: "94%",
      label: "Report measurable progress",
      sublabel: "within first week"
    },
    {
      number: "2.8x",
      label: "Faster confidence building",
      sublabel: "vs traditional methods"
    },
    {
      number: "15min",
      label: "Daily commitment",
      sublabel: "for lasting results"
    },
    {
      number: "15k+",
      label: "Lives transformed",
      sublabel: "and counting"
    }
  ];

  return (
    <section className="py-32 bg-gray-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <ScrollReveal>
          <div className="text-center mb-20">
            <h2 className="text-display-md font-display tracking-tight text-gray-900 mb-4">
              Proven Results
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Evidence-based outcomes that matter
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</h3>
                <p className="text-sm text-gray-600">{stat.sublabel}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Trust indicators */}
        <ScrollReveal delay={400}>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-brand-emerald-600" />
              <span className="text-sm font-medium text-gray-700">FDA Compliant</span>
            </div>
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-brand-emerald-600" />
              <span className="text-sm font-medium text-gray-700">Brain Health Certified</span>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-brand-emerald-600" />
              <span className="text-sm font-medium text-gray-700">Clinically Validated</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
