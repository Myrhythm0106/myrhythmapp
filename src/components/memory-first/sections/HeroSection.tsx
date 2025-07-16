import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Users, Award } from "lucide-react";

export function HeroSection() {
  const navigate = useNavigate();
  
  return (
    <section className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-200/60 via-blue-200/60 to-teal-200/60 text-gray-800 p-8 md:p-12 border border-purple-200/40 shadow-soft">
        <div className="absolute right-0 bottom-0 opacity-5">
        <Brain size={320} className="text-purple-300" />
      </div>
      
      <div className="relative z-10 max-w-4xl space-y-6">
        {/* Header Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-purple-100/60 text-purple-700 border-purple-300/50">
            <Brain className="h-3 w-3 mr-1" />
            Memory-First Design
          </Badge>
          <Badge variant="secondary" className="bg-blue-100/60 text-blue-700 border-blue-300/50">
            <Heart className="h-3 w-3 mr-1" />
            Brain Injury Survivor Built
          </Badge>
          <Badge variant="secondary" className="bg-teal-100/60 text-teal-700 border-teal-300/50">
            <Users className="h-3 w-3 mr-1" />
            Family-Centered
          </Badge>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-800">
          🧠 Unlock Your Brain's<br />
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">Amazing Potential</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl leading-relaxed">
          Your brain is incredible and adaptive. Discover new pathways to confidence, independence, 
          and deeper family connections. Your greatest chapters are ahead of you.
        </p>

        {/* Problem Statement */}
        <div className="bg-amber-50/70 backdrop-blur-sm p-6 rounded-lg border border-amber-200/50 border-l-4 border-l-amber-400">
          <h3 className="text-lg font-semibold mb-3 text-amber-800">
            🤔 "I used to remember everything. Now I can't even trust myself to remember to eat lunch."
          </h3>
          <p className="text-gray-700">
            If this sounds familiar, you're not alone. Memory challenges affect millions, but most apps treat 
            you like a broken computer that needs fixing. We treat you like a whole person rebuilding their rhythm.
          </p>
        </div>

        {/* Founder Credibility */}
        <div className="bg-emerald-50/70 backdrop-blur-sm p-6 rounded-lg border border-emerald-200/50">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-200/40 p-3 rounded-full">
              <Award className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-gray-700 italic leading-relaxed">
                "After my brain aneurysm, I lived the frustration you're feeling. Sticky notes everywhere, 
                constant worry, family stress. My husband and I rebuilt our rhythm together—and that 
                became this app."
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
            className="bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 text-white hover:from-purple-600 hover:via-blue-600 hover:to-teal-600 shadow-lg text-lg px-8 py-6"
          >
            👉 Start My Memory-First Journey
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate("/auth")} 
            className="border-purple-300 text-purple-600 hover:bg-purple-50 text-lg px-8 py-6"
          >
            I'm a Family Member/Caregiver
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="pt-6 border-t border-purple-200/30">
          <p className="text-sm text-gray-600 mb-2">Trusted by brain injury survivors and families worldwide:</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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