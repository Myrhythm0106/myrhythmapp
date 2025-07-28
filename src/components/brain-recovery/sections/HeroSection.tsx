
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

export function HeroSection() {
  const navigate = useNavigate();
  
  return (
    <section className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600/60 via-blue-600/60 to-teal-600/60 text-white p-6 md:p-10 border-l border-emerald-300/30">
      <div className="absolute right-0 bottom-0 opacity-10">
        <Brain size={280} />
      </div>
      
      <div className="relative z-10 max-w-2xl space-y-4 bg-transparent rounded-lg">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white">
          🧠 MyRhythm: Reclaim Structure. Reignite Confidence.
        </h1>
        
        <p className="text-xl opacity-90 text-white">
          Your personalised path to rebuilding your rhythm and reclaiming your day.
        </p>
        
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 italic mt-6">
          <p className="text-sm md:text-base text-white">
            💬 "After my brain aneurysm, remembering simple things felt impossible. With my husband's support, we rebuilt a rhythm that gave us back our peace. That rhythm became MyRhythm. Now, it's here for you, your loved ones, and your care team."
          </p>
          <p className="text-sm font-medium mt-2 text-white/80">
            — Bella A., Brain Health Coach, Brain Aneurysm Survivor, Brain Aneurysm Ambassador, Bee Foundation Ambassador
          </p>
        </div>
        
        <div className="pt-4">
          <Button size="lg" onClick={() => navigate("/onboarding")} className="bg-white text-primary hover:bg-white/90 shadow-sm shadow-emerald-300/10">
            👉 Start Your Recovery Journey
          </Button>
        </div>
      </div>
    </section>
  );
}
