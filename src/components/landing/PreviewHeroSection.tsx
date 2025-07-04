
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, Brain, UserPlus, Star, ChevronDown, Mountain, Compass } from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function PreviewHeroSection() {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [isPromiseExpanded, setIsPromiseExpanded] = React.useState(false);
  const navigate = useNavigate();

  const scrollToFramework = () => {
    const frameworkSection = document.getElementById('myrhythm-framework');
    if (frameworkSection) {
      frameworkSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const handleStartJourney = () => {
    console.log("PreviewHeroSection: Register Here button clicked");
    try {
      navigate("/onboarding");
    } catch (error) {
      console.error("PreviewHeroSection: Navigation error:", error);
    }
  };

  return (
    <TooltipProvider>
      {/* PREVIEW BANNER */}
      <div className="bg-yellow-100 border-b-4 border-yellow-400 p-2 text-center">
        <p className="text-yellow-800 font-semibold">🔍 PREVIEW MODE - Visual Landing Page Transformation</p>
      </div>

      <section className="relative overflow-hidden min-h-screen">
        {/* Background Mountain/Sunrise Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        
        {/* Login button at top right */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all" 
            onClick={() => setShowLoginModal(true)}
          >
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-6xl min-h-screen flex items-center">
          <div className="grid md:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Side - Minimal Text with Visual Elements */}
            <div className="text-white space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <Brain className="h-12 w-12 md:h-16 md:w-16 text-white" />
                <h1 className="text-4xl md:text-6xl font-bold">
                  MyRhythm
                </h1>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-yellow-300 font-bold cursor-help border-b border-dotted border-yellow-300">
                        LEAP*
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-gray-800">
                      <p className="text-sm">
                        <strong>Your Personal Journey:</strong><br />
                        <strong>L</strong>ive • <strong>E</strong>mpowered • <strong>A</strong>uthentic • <strong>P</strong>roductive
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  {" "}Back Into Control
                </h2>
                
                <p className="text-xl text-gray-200 leading-relaxed">
                  Reclaim your rhythm. Rebuild your confidence. Take back control of your life.
                </p>
              </div>

              {/* Call-to-Action */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="text-lg bg-yellow-500 hover:bg-yellow-400 text-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-6 flex items-center gap-3 rounded-full" 
                    onClick={handleStartJourney}
                  >
                    <UserPlus className="h-5 w-5 flex-shrink-0" />
                    <span className="text-center leading-tight">
                      Start Your Journey
                      <br />
                      <span className="text-sm opacity-90">7-Day Free Trial</span>
                    </span>
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 py-6 rounded-full border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all" 
                    onClick={scrollToFramework}
                  >
                    Learn The Framework
                  </Button>
                </div>
                
                {/* Trust indicators */}
                <div className="flex items-center gap-6 text-sm text-gray-200 pt-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>7-Day Free Trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>Cancel Anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>Start Immediately</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Visual Promise Card */}
            <div className="relative">
              {/* Central empowerment image */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Compass className="h-12 w-12 text-yellow-300" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white">Your Guide to Freedom</h3>
                  
                  <p className="text-gray-200 leading-relaxed">
                    Experience real memory improvement in just 7 days as you discover <strong className="text-yellow-300">YOUR unique LEAP pattern</strong>, establish <strong className="text-yellow-300">YOUR personal rhythm</strong>, and build <strong className="text-yellow-300">YOUR unstoppable momentum</strong>.
                  </p>
                  
                  <div className="bg-white/10 p-4 rounded-xl">
                    <p className="text-sm text-gray-200 italic">
                      "Memory wellness becomes the foundation for your entire life transformation."
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating visual elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <ChevronDown className="h-8 w-8 text-white/70" />
          </div>
        </div>

        {/* Login Modal */}
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </section>
    </TooltipProvider>
  );
}
