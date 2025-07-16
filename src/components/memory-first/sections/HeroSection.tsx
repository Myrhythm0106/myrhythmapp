import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Users, Award } from "lucide-react";

export function HeroSection() {
  const navigate = useNavigate();
  
  return (
    <section className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-emerald-600/90 text-white p-8 md:p-12 border border-blue-200/20">
      <div className="absolute right-0 bottom-0 opacity-10">
        <Brain size={320} />
      </div>
      
      <div className="relative z-10 max-w-4xl space-y-6">
        {/* Header Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Brain className="h-3 w-3 mr-1" />
            Memory-First Design
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Heart className="h-3 w-3 mr-1" />
            Brain Injury Survivor Built
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Users className="h-3 w-3 mr-1" />
            Family-Centered
          </Badge>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          🧠 The Only Memory-First<br />
          Life Rebuilding App
        </h1>
        
        <p className="text-xl md:text-2xl opacity-95 max-w-3xl leading-relaxed">
          When memory fails, life doesn't have to. Rebuild your confidence, reclaim your independence, 
          and reconnect with your family—one gentle step at a time.
        </p>

        {/* Problem Statement */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 border-l-4 border-l-yellow-300">
          <h3 className="text-lg font-semibold mb-3 text-yellow-100">
            🤔 "I used to remember everything. Now I can't even trust myself to remember to eat lunch."
          </h3>
          <p className="text-white/90">
            If this sounds familiar, you're not alone. Memory challenges affect millions, but most apps treat 
            you like a broken computer that needs fixing. We treat you like a whole person rebuilding their rhythm.
          </p>
        </div>

        {/* Founder Credibility */}
        <div className="bg-emerald-500/20 backdrop-blur-sm p-6 rounded-lg border border-emerald-300/30">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-300/20 p-3 rounded-full">
              <Award className="h-6 w-6 text-emerald-200" />
            </div>
            <div>
              <p className="text-emerald-100 italic leading-relaxed">
                "After my brain aneurysm, I lived the frustration you're feeling. Sticky notes everywhere, 
                constant worry, family stress. My husband and I rebuilt our rhythm together—and that 
                became this app."
              </p>
              <p className="text-sm font-medium mt-3 text-emerald-200">
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
            className="bg-white text-primary hover:bg-white/90 shadow-lg text-lg px-8 py-6"
          >
            👉 Start My Memory-First Journey
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate("/auth")} 
            className="border-white/50 text-white hover:bg-white/10 text-lg px-8 py-6"
          >
            I'm a Family Member/Caregiver
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="pt-6 border-t border-white/20">
          <p className="text-sm text-white/80 mb-2">Trusted by brain injury survivors and families worldwide:</p>
          <div className="flex flex-wrap gap-4 text-sm text-white/90">
            <span>✓ 1,000+ memory-challenged users</span>
            <span>✓ Neurologist recommended</span>
            <span>✓ Family-tested approach</span>
            <span>✓ Privacy-first design</span>
          </div>
        </div>
      </div>
    </section>
  );
}