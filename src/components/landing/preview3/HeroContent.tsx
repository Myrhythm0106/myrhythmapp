
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Brain, ArrowRight, ChevronDown } from "lucide-react";

export function HeroContent() {
  const navigate = useNavigate();

  console.log('HeroContent: Rendering component');

  const handleStartJourney = () => {
    console.log("=== REGISTRATION FLOW START ===");
    console.log("HeroContent: START YOUR CLEARER JOURNEY button clicked");
    console.log("HeroContent: Current location:", window.location.href);
    console.log("HeroContent: Navigate function available:", typeof navigate);
    console.log("HeroContent: About to navigate to /onboarding");
    
    try {
      navigate("/onboarding");
      console.log("HeroContent: Navigation to /onboarding initiated successfully");
      console.log("=== REGISTRATION FLOW - NAVIGATION COMPLETED ===");
    } catch (error) {
      console.error("HeroContent: Navigation error:", error);
      console.error("HeroContent: Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
    }
  };

  return (
    <>
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 max-w-6xl min-h-screen flex items-center">
        <div className="text-center w-full space-y-8">
          
          {/* Main Headlines */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-gray-900 leading-tight">
              <span className="text-emerald-600">LEAP.</span>
              <br />
              <span className="text-teal-600">REMEMBER.</span>
              <br />
              <span className="text-gray-900">THRIVE.</span>
            </h1>
            
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-semibold text-gray-700 max-w-4xl mx-auto">
              Your Rhythm for Unforgettable Growth.
            </h2>
          </div>

          {/* Body Copy */}
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto px-4">
            Tired of great ideas fading? Frustrated by forgetting lessons learned? MyRhythm helps you take massive strides in life and productivity, ensuring every vital lesson and hard-won triumph is <strong className="text-emerald-600">remembered</strong>, not lost.
          </p>

          {/* Primary CTA */}
          <div className="space-y-4 pt-6 px-4">
            <Button 
              size="lg" 
              className="text-lg sm:text-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 px-8 sm:px-12 py-6 sm:py-8 rounded-full group relative overflow-hidden w-full sm:w-auto" 
              onClick={handleStartJourney}
            >
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full animate-pulse"></div>
              <div className="relative flex items-center justify-center gap-3">
                <span className="text-center leading-tight font-semibold">
                  START YOUR CLEARER JOURNEY
                </span>
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </Button>
            
            <p className="text-sm text-gray-500 text-center">
              No credit card required. Cancel anytime.
            </p>
          </div>

          {/* Hero Visual Container */}
          <div className="relative max-w-4xl mx-auto mt-12 sm:mt-16 px-4">
            {/* Main Hero Visual */}
            <div 
              className="w-full h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-2xl"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Overlay for text visibility */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-teal-600/30 rounded-3xl"></div>
              
              {/* Memory trail effects */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-16 sm:w-20 h-0.5 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent via-emerald-200 to-transparent animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute top-1/2 left-1/2 w-20 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-teal-200 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
              
              {/* Central content */}
              <div className="relative text-center text-white z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 backdrop-blur-sm">
                  <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-white animate-pulse" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Every Step Remembered</h3>
                <p className="text-base sm:text-lg opacity-90">Growth that truly sticks</p>
              </div>
            </div>
            
            {/* Floating memory nodes around the visual */}
            <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-full opacity-70 animate-pulse flex items-center justify-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
            </div>
            <div className="absolute -bottom-2 sm:-bottom-3 -left-2 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 bg-teal-500 rounded-full opacity-60 animate-pulse flex items-center justify-center" style={{animationDelay: '1s'}}>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
            </div>
            <div className="absolute top-1/2 -right-3 sm:-right-5 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-400 rounded-full opacity-80 animate-pulse" style={{animationDelay: '1.5s'}}></div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600/70" />
        </div>
      </div>
    </>
  );
}
