import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, Brain, ChevronDown, Users, Clock, Shield, Award, Heart, Calendar, Archive, Lightbulb, Star, TrendingUp } from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate("/onboarding");
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
      {/* Bold, dramatic background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/30 via-transparent to-teal-600/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.3),transparent)] opacity-80"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.3),transparent)] opacity-80"></div>
      </div>

      {/* Dynamic floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-400/40 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-teal-400/50 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-emerald-300/45 rounded-full blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-20 right-20 w-36 h-36 bg-teal-300/35 rounded-full blur-3xl animate-pulse" style={{animationDelay: '6s'}}></div>
      </div>

      {/* Top navigation */}
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
        <Button 
          variant="outline" 
          className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 rounded-full px-6 py-2 font-medium" 
          onClick={() => setShowLoginModal(true)}
        >
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Button>
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-7xl min-h-screen flex items-center">
        <div className="text-center w-full space-y-16 pt-16">
          
          {/* Powerful opening */}
          <div className="space-y-8">
            <div className="inline-block px-8 py-3 bg-emerald-400/20 rounded-full border border-emerald-400/40 backdrop-blur-sm mb-6">
              <span className="text-emerald-200 font-bold text-lg">🔥 By Survivors, For Survivors</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tight">
              No One Walks
              <br />
              <span className="text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text">
                Alone
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-emerald-100 max-w-5xl mx-auto leading-relaxed font-light">
              The brain recovery platform that turns your biggest challenges into your greatest victories
            </p>
          </div>

          {/* Survivor Success Stats - BOLD Impact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-10 border border-white/20 hover:scale-105 transition-transform">
              <div className="text-6xl font-black text-emerald-400 mb-4">94%</div>
              <div className="text-2xl text-white font-bold mb-2">Feel More Confident</div>
              <div className="text-emerald-200 text-lg">Within 30 days</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-10 border border-white/20 hover:scale-105 transition-transform">
              <div className="text-6xl font-black text-teal-400 mb-4">2,847</div>
              <div className="text-2xl text-white font-bold mb-2">Survivors Thriving</div>
              <div className="text-teal-200 text-lg">And counting daily</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-10 border border-white/20 hover:scale-105 transition-transform">
              <div className="text-6xl font-black text-emerald-400 mb-4">89%</div>
              <div className="text-2xl text-white font-bold mb-2">Families Reconnected</div>
              <div className="text-emerald-200 text-lg">Stronger than before</div>
            </div>
          </div>

          {/* Powerful Testimonial */}
          <div className="bg-gradient-to-r from-emerald-600/25 to-teal-600/25 backdrop-blur-md rounded-3xl p-12 border border-white/20 max-w-5xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <div className="text-3xl md:text-4xl text-white font-light italic leading-relaxed mb-8">
              "I went from writing everything on sticky notes to running my own business again. 
              MyRhythm didn't just help me remember—it helped me believe in myself again."
            </div>
            <div className="text-emerald-300 font-bold text-xl">
              — Sarah M., Brain Injury Survivor, 3 years post-recovery
            </div>
          </div>

          {/* Core Features - Survivor Focused */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
            <div className="bg-emerald-500/25 backdrop-blur-md rounded-2xl p-8 border border-emerald-400/30 hover:scale-105 transition-all group">
              <div className="text-emerald-300 mb-4 group-hover:scale-110 transition-transform">
                <Lightbulb className="h-10 w-10" />
              </div>
              <h3 className="font-black text-white text-xl mb-3">Memory Bridge</h3>
              <p className="text-emerald-100 text-lg">Smart reminders that actually understand your recovery journey</p>
            </div>
            <div className="bg-teal-500/25 backdrop-blur-md rounded-2xl p-8 border border-teal-400/30 hover:scale-105 transition-all group">
              <div className="text-teal-300 mb-4 group-hover:scale-110 transition-transform">
                <Heart className="h-10 w-10" />
              </div>
              <h3 className="font-black text-white text-xl mb-3">Empowerment Hub</h3>
              <p className="text-teal-100 text-lg">Track wins, celebrate progress, build unstoppable momentum</p>
            </div>
            <div className="bg-emerald-500/25 backdrop-blur-md rounded-2xl p-8 border border-emerald-400/30 hover:scale-105 transition-all group">
              <div className="text-emerald-300 mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="h-10 w-10" />
              </div>
              <h3 className="font-black text-white text-xl mb-3">Cognitive Calendar</h3>
              <p className="text-emerald-100 text-lg">Visual planning that makes complex days feel manageable</p>
            </div>
            <div className="bg-teal-500/25 backdrop-blur-md rounded-2xl p-8 border border-teal-400/30 hover:scale-105 transition-all group">
              <div className="text-teal-300 mb-4 group-hover:scale-110 transition-transform">
                <Archive className="h-10 w-10" />
              </div>
              <h3 className="font-black text-white text-xl mb-3">Memory Bank</h3>
              <p className="text-teal-100 text-lg">Secure vault for your most precious moments and milestones</p>
            </div>
          </div>

          {/* Urgent CTA with Scarcity */}
          <div className="space-y-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="inline-block px-6 py-3 bg-orange-500/30 rounded-full border border-orange-400/50">
                <span className="text-orange-200 font-bold text-lg">🚀 Limited Beta Access - Only 127 spots left</span>
              </div>
              <div className="flex items-center gap-2 text-orange-200">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Filling Fast!</span>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="text-2xl px-16 py-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 font-black shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/20" 
                onClick={handleStartJourney}
              >
                Join The Recovery Revolution
                <Badge className="ml-4 bg-white/30 text-white border-white/50 text-lg px-3 py-1">FREE ACCESS</Badge>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-xl px-12 py-8 rounded-2xl border-2 border-white/50 text-white hover:bg-white/10 font-bold backdrop-blur-sm" 
                onClick={scrollToFeatures}
              >
                See How It Works
              </Button>
            </div>
            
            <div className="text-lg text-emerald-200 max-w-3xl mx-auto font-medium">
              Join 2,847 survivors who've reclaimed their confidence. No credit card required. Your journey starts now.
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="h-8 w-8 text-emerald-400" />
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </section>
  );
}