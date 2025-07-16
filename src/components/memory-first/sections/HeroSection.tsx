import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Users, Award } from "lucide-react";

export function HeroSection() {
  const navigate = useNavigate();
  
  return (
    <section className="relative overflow-hidden rounded-lg bg-gradient-to-r from-rose-100 via-amber-50 to-orange-100 text-gray-800 p-8 md:p-12 border border-rose-200/30 shadow-lg">
        <div className="absolute right-0 bottom-0 opacity-5">
        <Brain size={320} className="text-rose-300" />
      </div>
      
      <div className="relative z-10 max-w-4xl space-y-6">
        {/* Header Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-rose-200/40 text-rose-800 border-rose-300/50">
            <Brain className="h-3 w-3 mr-1" />
            Memory-First Design
          </Badge>
          <Badge variant="secondary" className="bg-amber-200/40 text-amber-800 border-amber-300/50">
            <Heart className="h-3 w-3 mr-1" />
            Brain Injury Survivor Built
          </Badge>
          <Badge variant="secondary" className="bg-orange-200/40 text-orange-800 border-orange-300/50">
            <Users className="h-3 w-3 mr-1" />
            Family-Centered
          </Badge>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-800">
          🧠 Rediscover Your Brain's<br />
          <span className="text-rose-700">Gentle Strength</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl leading-relaxed">
          Your brain is beautifully resilient. Together, we'll nurture new pathways to confidence, 
          peace of mind, and deeper connections with those you love.
        </p>

        {/* Problem Statement */}
        <div className="bg-amber-50/80 backdrop-blur-sm p-6 rounded-lg border border-amber-200/50 border-l-4 border-l-amber-400">
          <h3 className="text-lg font-semibold mb-3 text-amber-800">
            💭 "I used to remember everything. Now I can't trust myself to remember simple things."
          </h3>
          <p className="text-gray-700">
            If this feels familiar, you're not alone. Memory challenges touch millions of lives, but most apps 
            treat you like something that needs fixing. We see you as someone rebuilding their beautiful rhythm.
          </p>
        </div>

        {/* Founder Credibility */}
        <div className="bg-rose-50/80 backdrop-blur-sm p-6 rounded-lg border border-rose-200/50">
          <div className="flex items-start gap-4">
            <div className="bg-rose-200/40 p-3 rounded-full">
              <Award className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <p className="text-gray-700 italic leading-relaxed">
                "After my brain aneurysm, I understood the deep frustration you're feeling. Sticky notes everywhere, 
                constant worry, family stress. My husband and I gently rebuilt our rhythm together—and that 
                loving journey became this app."
              </p>
              <p className="text-sm font-medium mt-3 text-gray-600">
                — Bella A., Founder & Brain Aneurysm Survivor<br />
                Brain Health Coach • Bee Foundation Ambassador
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <Button 
            size="lg" 
            onClick={() => navigate("/onboarding")} 
            className="bg-rose-600 text-white hover:bg-rose-700 shadow-lg text-lg px-8 py-6 rounded-full"
          >
            🌱 Begin My Gentle Journey
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate("/auth")} 
            className="border-rose-300 text-rose-700 hover:bg-rose-50 text-lg px-8 py-6 rounded-full"
          >
            💕 I'm a Family Member
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="pt-6 border-t border-rose-200/30">
          <p className="text-sm text-gray-600 mb-2">Lovingly created for brain injury survivors and families:</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>🌸 1,000+ gentle users</span>
            <span>🩺 Neurologist guided</span>
            <span>👨‍👩‍👧‍👦 Family-centered</span>
            <span>🔒 Privacy-first design</span>
          </div>
        </div>
      </div>
    </section>
  );
}