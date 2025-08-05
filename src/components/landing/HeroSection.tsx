import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, Brain, ChevronDown, Users, Clock, Shield, Award } from "lucide-react";
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
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-br from-memory-emerald-50 via-clarity-teal-50 to-purple-50">
      {/* Elegant background gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-memory-emerald-100/40 via-clarity-teal-100/30 to-purple-100/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent"></div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-memory-emerald-400/60 rounded-full animate-pulse opacity-70"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-clarity-teal-400/50 rounded-full animate-pulse opacity-60" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 left-1/2 w-5 h-5 bg-purple-400/40 rounded-full animate-pulse opacity-50" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Top navigation */}
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
        <Button 
          variant="ghost" 
          className="bg-white/90 backdrop-blur-md text-memory-emerald-700 hover:bg-memory-emerald-50 rounded-full px-6 py-2" 
          onClick={() => setShowLoginModal(true)}
        >
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Button>
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-6xl min-h-screen flex items-center">
        <div className="text-center w-full space-y-12 pt-16">
          
          {/* Hero headline */}
          <div className="space-y-8">
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-memory-emerald-500 via-clarity-teal-500 to-purple-500 flex items-center justify-center shadow-2xl">
                  <Brain className="h-10 w-10 md:h-12 md:w-12 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-memory-emerald-400/30 via-clarity-teal-400/30 to-purple-400/30 rounded-full blur-xl animate-pulse"></div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-memory-emerald-600 via-clarity-teal-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                MyRhythm
              </h1>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-800 max-w-4xl mx-auto leading-tight">
                The Brain Health Revolution Starts Here
              </h2>
              <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-600 leading-relaxed">
                Transform memory challenges into cognitive victories. Build unshakeable confidence through personalized brain training, memory partnerships, and empowerment-focused tools designed by survivors, for survivors.
              </p>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4 text-memory-emerald-500" />
              <span>Trusted by 10,000+ Brain Health Warriors</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4 text-clarity-teal-500" />
              <span>Results in 7 Days</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="h-4 w-4 text-purple-500" />
              <span>Privacy First</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Award className="h-4 w-4 text-memory-emerald-500" />
              <span>Evidence-Based</span>
            </div>
          </div>
          
          {/* Feature highlights */}
          <div className="bg-white/80 backdrop-blur-sm border border-memory-emerald-200/50 rounded-2xl p-8 max-w-4xl mx-auto shadow-xl">
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-memory-emerald-800">🧠 Memory Bridge Technology</h3>
                <p className="text-gray-600">Turn conversations into cognitive victories with AI-powered PACT analysis (Productivity, Authenticity, Connection, Transformation).</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-clarity-teal-800">🎯 Empowerment Hub</h3>
                <p className="text-gray-600">Your personalized command center for accountability, progress tracking, and confidence building.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-purple-800">📅 Cognitive Calendar</h3>
                <p className="text-gray-600">Smart scheduling that adapts to your energy levels and cognitive patterns.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-memory-emerald-800">🤝 Memory Bank</h3>
                <p className="text-gray-600">Secure storage for your journey, wins, and growth milestones.</p>
              </div>
            </div>
          </div>
          
          {/* CTA section */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="text-lg px-12 py-8 rounded-full bg-gradient-to-r from-memory-emerald-600 via-clarity-teal-600 to-purple-600 text-white hover:from-memory-emerald-700 hover:via-clarity-teal-700 hover:to-purple-700 shadow-2xl hover:shadow-memory-emerald-200/50 transition-all duration-300 font-bold w-full sm:w-auto max-w-sm" 
                onClick={handleStartJourney}
              >
                Start Your Brain Health Journey
                <Badge className="ml-3 bg-white/20 text-white border-white/30">FREE 7 DAYS</Badge>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-10 py-8 rounded-full border-2 border-memory-emerald-300 text-memory-emerald-700 bg-white/90 hover:bg-memory-emerald-50 transition-all duration-300 w-full sm:w-auto max-w-sm" 
                onClick={scrollToFeatures}
              >
                Explore Features
              </Button>
            </div>
            
            <div className="text-sm text-gray-500 max-w-2xl mx-auto">
              Join thousands who've transformed their brain health journey. No credit card required. Cancel anytime.
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="h-6 w-6 text-memory-emerald-500/70" />
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </section>
  );
}