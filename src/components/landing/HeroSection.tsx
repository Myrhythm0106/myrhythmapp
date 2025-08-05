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
      {/* Neural network background with purple/teal integration */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/30 via-purple-600/20 to-teal-600/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.3),transparent)] opacity-80"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.3),transparent)] opacity-80"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.15),transparent)] opacity-60"></div>
        
        {/* Subtle neural network SVG background */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="neuralGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#9333ea" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.8"/>
            </linearGradient>
            <linearGradient id="neuralGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.7"/>
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.7"/>
            </linearGradient>
          </defs>
          
          {/* Neural pathways */}
          <path d="M100,200 Q300,100 500,200 T900,150 Q1000,120 1100,180" stroke="url(#neuralGradient1)" strokeWidth="2" fill="none" opacity="0.6"/>
          <path d="M150,400 Q350,300 550,380 T950,320 Q1050,290 1150,350" stroke="url(#neuralGradient2)" strokeWidth="1.5" fill="none" opacity="0.5"/>
          <path d="M50,600 Q250,500 450,580 T850,520 Q950,490 1050,550" stroke="url(#neuralGradient1)" strokeWidth="1.8" fill="none" opacity="0.4"/>
          <path d="M200,100 Q400,50 600,120 T1000,80 Q1100,60 1200,100" stroke="url(#neuralGradient2)" strokeWidth="1.2" fill="none" opacity="0.3"/>
          <path d="M120,700 Q320,650 520,720 T920,680 Q1020,660 1120,700" stroke="url(#neuralGradient1)" strokeWidth="1.6" fill="none" opacity="0.5"/>
          
          {/* Neural nodes */}
          <circle cx="300" cy="200" r="4" fill="#14b8a6" opacity="0.6"/>
          <circle cx="550" cy="380" r="3" fill="#9333ea" opacity="0.5"/>
          <circle cx="850" cy="150" r="5" fill="#10b981" opacity="0.7"/>
          <circle cx="450" cy="580" r="3.5" fill="#14b8a6" opacity="0.4"/>
          <circle cx="750" cy="320" r="4.5" fill="#9333ea" opacity="0.6"/>
          <circle cx="950" cy="680" r="3" fill="#10b981" opacity="0.5"/>
          <circle cx="600" cy="120" r="4" fill="#14b8a6" opacity="0.4"/>
          <circle cx="1000" cy="490" r="3.5" fill="#9333ea" opacity="0.5"/>
        </svg>
      </div>

      {/* Enhanced floating elements with purple integration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-400/40 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-teal-400/50 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-purple-400/35 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-emerald-300/45 rounded-full blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/4 right-1/3 w-22 h-22 bg-purple-300/40 rounded-full blur-lg animate-pulse" style={{animationDelay: '3s'}}></div>
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
              The memory first MyRhythm Framework that turns your biggest challenges into your greatest victories
            </p>
          </div>

          {/* Empowerment Success Stats - BOLD Impact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
            <div className="bg-purple-500/20 backdrop-blur-md rounded-3xl p-10 border border-purple-400/30 hover:scale-105 transition-transform">
              <div className="text-6xl font-black text-purple-400 mb-4">94%</div>
              <div className="text-2xl text-white font-bold mb-2">Feel More Confident</div>
              <div className="text-purple-200 text-lg">Within 30 days</div>
            </div>
            <div className="bg-emerald-500/20 backdrop-blur-md rounded-3xl p-10 border border-emerald-400/30 hover:scale-105 transition-transform">
              <div className="text-6xl font-black text-emerald-400 mb-4">2,847</div>
              <div className="text-2xl text-white font-bold mb-2">Survivors Thriving</div>
              <div className="text-emerald-200 text-lg">And counting daily</div>
            </div>
            <div className="bg-teal-500/20 backdrop-blur-md rounded-3xl p-10 border border-teal-400/30 hover:scale-105 transition-transform">
              <div className="text-6xl font-black text-teal-400 mb-4">91%</div>
              <div className="text-2xl text-white font-bold mb-2">Report Sharper Memory</div>
              <div className="text-teal-200 text-lg">Memory first results</div>
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
              — Sarah M., Brain Injury Survivor, 3 years post-empowerment
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
              <p className="text-teal-100 text-lg">Secure vault for your most precious moments and milestones for you to keep safe and remember</p>
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
                Join The Empowerment Revolution
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
              Join 2,847 survivors who've reclaimed their confidence. No credit card required. Your empowerment journey starts now.
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