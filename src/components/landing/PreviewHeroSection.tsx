
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, Brain, UserPlus, Star, ChevronDown, Mountain, Compass, Home } from "lucide-react";
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

  const handleGoToLive = () => {
    navigate("/");
  };

  const handleGoToPreview2 = () => {
    navigate("/preview-2");
  };

  return (
    <TooltipProvider>
      {/* PREVIEW BANNER */}
      <div className="bg-yellow-100 border-b-4 border-yellow-400 p-2 text-center">
        <p className="text-yellow-800 font-semibold">🔍 PREVIEW 1 - Professional Therapeutic Color Implementation</p>
      </div>

      <section className="relative overflow-hidden min-h-screen">
        {/* Background Mountain/Sunrise Image with therapeutic overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(23, 80, 80, 0.15)), url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        
        {/* Professional floating therapeutic elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-brain-health-400/30 rounded-full animate-pulse" style={{animationDelay: '0s', animationDuration: '8s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-clarity-teal-400/25 rounded-full animate-pulse" style={{animationDelay: '3s', animationDuration: '10s'}}></div>
          <div className="absolute bottom-1/3 left-1/2 w-5 h-5 bg-memory-emerald-400/20 rounded-full animate-pulse" style={{animationDelay: '6s', animationDuration: '12s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-primary/40 rounded-full animate-pulse" style={{animationDelay: '9s', animationDuration: '7s'}}></div>
        </div>
        
        {/* Top navigation buttons with professional therapeutic styling */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10 flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white hover:bg-brain-health-500/20 border border-white/20 transition-all" 
            onClick={handleGoToLive}
          >
            <Home className="h-4 w-4" />
            Live
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-2 bg-clarity-teal-500/25 backdrop-blur-sm text-white hover:bg-clarity-teal-500/35 border border-white/20 transition-all" 
            onClick={handleGoToPreview2}
          >
            <Brain className="h-4 w-4" />
            Preview 2
          </Button>
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white hover:bg-brain-health-500/20 border border-white/20 transition-all" 
            onClick={() => setShowLoginModal(true)}
          >
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-6xl min-h-screen flex items-center">
          <div className="grid md:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Side - Professional branding with therapeutic colors */}
            <div className="text-white space-y-8">
              <div className="flex items-center gap-4 mb-8">
                {/* Brain icon with subtle primary amber/gold (30% saturation) */}
                <div className="relative">
                  <Brain className="h-12 w-12 md:h-16 md:w-16 text-primary/80 filter drop-shadow-md" />
                  <div className="absolute inset-0 bg-primary/15 rounded-full blur-md animate-pulse"></div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold">
                  MyRhythm
                </h1>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-brain-health-300 font-bold cursor-help border-b border-dotted border-brain-health-300/60">
                        LEAP*
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-gray-800 border-brain-health-200">
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

              {/* Professional CTA with therapeutic color scheme */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    variant="premium"
                    className="text-lg px-8 py-6 flex items-center gap-3 rounded-full shadow-xl hover:shadow-2xl" 
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
                    className="text-lg px-8 py-6 rounded-full border-2 border-brain-health-300/60 text-white hover:bg-brain-health-500/20 hover:text-white hover:border-brain-health-400/80 transition-all" 
                    onClick={scrollToFramework}
                  >
                    Learn The Framework
                  </Button>
                </div>
                
                {/* Professional trust indicators with therapeutic colors */}
                <div className="flex items-center gap-6 text-sm text-gray-200 pt-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-brain-health-400/80 rounded-full animate-pulse"></div>
                    <span>7-Day Free Trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-clarity-teal-400/80 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    <span>Cancel Anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-memory-emerald-400/80 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                    <span>Start Immediately</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Professional promise card with therapeutic design */}
            <div className="relative">
              {/* Professional therapeutic promise card */}
              <div className="relative bg-white/15 backdrop-blur-md rounded-3xl p-8 border border-brain-health-300/30 shadow-2xl">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-brain-health-400/30 to-clarity-teal-400/25 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Compass className="h-12 w-12 text-white drop-shadow-md" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white">Your Guide to Freedom</h3>
                  
                  <p className="text-gray-200 leading-relaxed">
                    Experience real memory improvement in just 7 days as you discover <strong className="text-brain-health-300">YOUR unique LEAP pattern</strong>, establish <strong className="text-clarity-teal-300">YOUR personal rhythm</strong>, and build <strong className="text-memory-emerald-300">YOUR unstoppable momentum</strong>.
                  </p>
                  
                  <div className="bg-gradient-to-r from-brain-health-500/20 to-clarity-teal-500/15 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <p className="text-sm text-gray-200 italic">
                      "Memory wellness becomes the foundation for your entire life transformation."
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional floating therapeutic accents */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-brain-health-400/20 to-clarity-teal-400/15 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-memory-emerald-400/20 to-brain-health-400/15 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>

        {/* Professional scroll indicator */}
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
