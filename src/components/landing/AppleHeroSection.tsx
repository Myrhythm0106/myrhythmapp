import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { GlassNav } from "./premium/GlassNav";
import { ScrollReveal } from "./premium/ScrollReveal";
import { PremiumHeroVisual } from "./premium/PremiumHeroVisual";
import { ParallaxOrb } from "./premium/ParallaxOrb";

export function AppleHeroSection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Glass Navigation */}
      <GlassNav />

      {/* Background Orbs */}
      <ParallaxOrb color="emerald" size="lg" position="top-20 -right-64" speed={0.3} />
      <ParallaxOrb color="teal" size="md" position="bottom-20 -left-48" speed={0.4} />
      <ParallaxOrb color="blue" size="sm" position="top-1/3 left-1/4" speed={0.2} />

      {/* Hero Content */}
      <div className="relative z-10 pt-32 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Main Headline */}
          <ScrollReveal>
            <div className="text-center space-y-8 max-w-5xl mx-auto">
              <h1 className="text-display-lg md:text-display-xl font-display tracking-tighter text-gray-900">
                Your Memory.
                <span className="block text-brand-emerald-600">Empowered.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                Transform challenges into confidence with personalized cognitive support designed for you.
              </p>

              {/* Primary CTA */}
              <div className="pt-6">
                <Button 
                  onClick={() => navigate("/auth")}
                  size="lg"
                  className="px-10 py-6 text-lg font-semibold bg-brand-emerald-600 hover:bg-brand-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  No credit card required
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Hero Visual */}
          <ScrollReveal delay={200}>
            <PremiumHeroVisual />
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal delay={400}>
            <div className="flex flex-wrap justify-center items-center gap-12 pt-32">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-2">94%</div>
                <div className="text-sm text-gray-600">Improved confidence</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-2">2.3x</div>
                <div className="text-sm text-gray-600">Faster completion</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-2">15k+</div>
                <div className="text-sm text-gray-600">Lives transformed</div>
              </div>
            </div>
          </ScrollReveal>

          {/* Testimonial */}
          <ScrollReveal delay={600}>
            <div className="max-w-3xl mx-auto text-center pt-32">
              <blockquote className="text-2xl text-gray-700 leading-relaxed font-light italic">
                "MyRhythm gave me my confidence back. I can trust my memory again."
              </blockquote>
              <div className="mt-6">
                <div className="font-semibold text-gray-900">Sarah M.</div>
                <div className="text-sm text-gray-600">Brain Injury Survivor</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
