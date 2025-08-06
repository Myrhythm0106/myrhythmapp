
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

export function HeroSection() {
  const navigate = useNavigate();
  
  return (
    <section className="relative overflow-hidden rounded-lg bg-gradient-to-br from-memory-emerald/20 via-brain-health/15 to-clarity-teal/20 backdrop-blur-sm text-white p-6 md:p-10 border border-memory-emerald/30 shadow-lg">
      {/* Professional geometric patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-memory-emerald/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-clarity-teal/20 to-transparent rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative z-10 max-w-2xl space-y-4 bg-transparent rounded-lg">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white">
          🌟 MyRhythm: Empowerment Through Structure
        </h1>
        
        <p className="text-xl opacity-90 text-white">
          Professional-grade platform designed to restore confidence and independence
        </p>
        
        {/* Professional Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-memory-emerald/20 backdrop-blur-sm p-4 rounded-lg border border-memory-emerald/30">
            <div className="text-memory-emerald-200 font-semibold text-lg mb-2">Memory Bridge</div>
            <p className="text-sm text-white/90">Smart promise tracking</p>
          </div>
          <div className="bg-brain-health/20 backdrop-blur-sm p-4 rounded-lg border border-brain-health/30">
            <div className="text-brain-health-200 font-semibold text-lg mb-2">Memory Bank</div>
            <p className="text-sm text-white/90">Secure moment vault</p>
          </div>
          <div className="bg-clarity-teal/20 backdrop-blur-sm p-4 rounded-lg border border-clarity-teal/30">
            <div className="text-clarity-teal-200 font-semibold text-lg mb-2">Cognitive Calendar</div>
            <p className="text-sm text-white/90">Visual daily planning</p>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 italic mt-6">
          <p className="text-sm md:text-base text-white">
            💬 "We rebuilt a rhythm that gave us back our peace. That rhythm became MyRhythm. Now, it's here for you, your loved ones, and your care team."
          </p>
          <p className="text-sm font-medium mt-2 text-white/80">
            — Bella A., Founder & Brain Aneurysm Survivor
          </p>
        </div>
        
        <div className="pt-4">
          <Button size="lg" onClick={() => navigate("/onboarding")} className="bg-gradient-to-r from-memory-emerald to-clarity-teal text-white hover:from-memory-emerald/90 hover:to-clarity-teal/90 shadow-lg font-semibold">
            🚀 Begin Your Empowerment Journey
          </Button>
        </div>
      </div>
    </section>
  );
}
