import React from "react";
import { Brain, Users, TrendingUp, Heart, Sparkles, Shield } from "lucide-react";
import { ScrollReveal } from "./premium/ScrollReveal";

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Benefit({ icon, title, description }: BenefitProps) {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="w-12 h-12 flex items-center justify-center text-brand-emerald-600">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 font-light leading-relaxed">{description}</p>
    </div>
  );
}

export function WhyItHelpsSection() {
  const benefits = [
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Personalized Support",
      description: "Adaptive tools that learn your unique cognitive patterns and needs"
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Family Connection",
      description: "Keep loved ones informed and involved in your journey"
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Track Progress",
      description: "See measurable improvements in memory confidence"
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Build Confidence",
      description: "Replace uncertainty with empowerment and self-trust"
    },
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: "Daily Guidance",
      description: "Simple routines that fit naturally into your life"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Expert Validated",
      description: "Clinically proven methods backed by brain health science"
    }
  ];

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <ScrollReveal>
          <div className="text-center mb-20">
            <h2 className="text-display-md font-display tracking-tight text-gray-900 mb-4">
              Why MyRhythm
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Evidence-based support designed for real results
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <Benefit {...benefit} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
