
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MountainPeakAchievement() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate("/onboarding");
  };

  return (
    <section 
      className="py-20 relative overflow-hidden min-h-screen flex items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.1), rgba(20, 184, 166, 0.2)), url('https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Memory Trail Effects Leading to Peak */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="peakTrail" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor:'#10B981', stopOpacity:0.3}} />
              <stop offset="50%" style={{stopColor:'#14B8A6', stopOpacity:0.8}} />
              <stop offset="100%" style={{stopColor:'#ffffff', stopOpacity:1}} />
            </linearGradient>
          </defs>
          {/* Ascending memory trails */}
          <path d="M 10% 90% Q 30% 60% 50% 40% T 90% 10%" stroke="url(#peakTrail)" strokeWidth="3" fill="none" className="animate-pulse" />
          <path d="M 5% 85% Q 25% 65% 45% 45% T 85% 15%" stroke="url(#peakTrail)" strokeWidth="2" fill="none" className="animate-pulse" style={{animationDelay: '1s'}} />
          <path d="M 15% 95% Q 35% 55% 55% 35% T 95% 5%" stroke="url(#peakTrail)" strokeWidth="2" fill="none" className="animate-pulse" style={{animationDelay: '2s'}} />
        </svg>
        
        {/* Floating memory nodes */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-emerald-400 rounded-full animate-pulse opacity-70"></div>
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-teal-400 rounded-full animate-pulse opacity-60" style={{animationDelay: '0.7s'}}></div>
        <div className="absolute bottom-1/2 left-1/2 w-3 h-3 bg-emerald-300 rounded-full animate-pulse opacity-80" style={{animationDelay: '1.4s'}}></div>
        <div className="absolute top-1/6 right-1/4 w-5 h-5 bg-white rounded-full animate-pulse opacity-90" style={{animationDelay: '2.1s'}}></div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
        
        {/* Peak Achievement Visual */}
        <div className="mb-12">
          <div className="relative inline-block">
            {/* Central peak icon with glow */}
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-white/20 to-emerald-100/30 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center animate-pulse">
                <Star className="h-10 w-10 text-white" />
              </div>
            </div>
            
            {/* Floating achievement indicators */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
              <Award className="h-6 w-6 text-emerald-300" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-emerald-500/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse" style={{animationDelay: '1s'}}>
              <Shield className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        {/* Peak Message */}
        <div className="space-y-8 mb-12">
          <h2 className="text-5xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Your Peak Awaits
          </h2>
          
          <p className="text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
            Every step remembered. Every lesson preserved. Every triumph yours forever.
          </p>
        </div>

        {/* Primary CTA */}
        <div className="space-y-8">
          <Button 
            size="lg" 
            className="text-2xl bg-white text-emerald-600 hover:bg-emerald-50 shadow-2xl hover:shadow-3xl transition-all duration-300 px-16 py-8 rounded-full group relative overflow-hidden transform hover:scale-105" 
            onClick={handleStartJourney}
          >
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/20 to-teal-50/20 rounded-full"></div>
            <div className="relative flex items-center gap-4">
              <span className="font-bold">BEGIN YOUR ASCENT</span>
              <ArrowRight className="h-8 w-8 flex-shrink-0 group-hover:translate-x-2 transition-transform" />
            </div>
          </Button>
          
          {/* Trust Indicators - Floating */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Star className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">7-Day Free Trial</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Shield className="h-5 w-5 text-emerald-300" />
              <span className="font-medium">Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Award className="h-5 w-5 text-teal-300" />
              <span className="font-medium">Start Immediately</span>
            </div>
          </div>
        </div>

        {/* Memory Preservation Promise */}
        <div className="mt-16">
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <p className="text-lg text-white/90 leading-relaxed italic">
              "Where memory wellness becomes the foundation for your entire life transformation."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
