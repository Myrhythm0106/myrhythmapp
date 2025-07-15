
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, Brain, ChevronDown } from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function HeroSection() {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const navigate = useNavigate();

  // Function to scroll to the MyRhythm Framework section
  const scrollToFramework = () => {
    const frameworkSection = document.getElementById('myrhythm-framework');
    if (frameworkSection) {
      frameworkSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const handleStartJourney = () => {
    console.log("HeroSection: Start Journey button clicked");
    console.log("HeroSection: About to navigate to /onboarding");
    console.log("HeroSection: Current location:", window.location.href);
    try {
      navigate("/onboarding");
      console.log("HeroSection: navigate() called successfully");
    } catch (error) {
      console.error("HeroSection: Navigation error:", error);
    }
  };

  return (
    <TooltipProvider>
      <section className="relative overflow-hidden min-h-screen">
        {/* Gentle, therapeutic background with soft nature scene */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(42, 78, 60, 0.05), rgba(180, 190, 180, 0.08), rgba(240, 245, 240, 0.1)), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80')`
          }}
        />

        {/* Subtle floating elements for gentle depth */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/10 rounded-full animate-pulse" style={{animationDelay: '0s', animationDuration: '6s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-brain-health-300/20 rounded-full animate-pulse" style={{animationDelay: '3s', animationDuration: '8s'}}></div>
          <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-memory-emerald-200/10 rounded-full animate-pulse" style={{animationDelay: '6s', animationDuration: '10s'}}></div>
        </div>

        {/* Gentle top navigation */}
        <div className="absolute top-6 right-6 z-10">
          <Button 
            variant="ghost" 
            className="bg-white/80 backdrop-blur-md text-gray-700 border border-white/40 hover:bg-white/90 rounded-full px-6 py-2 text-sm font-medium transition-all duration-300" 
            onClick={() => setShowLoginModal(true)}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Login
          </Button>
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-6xl min-h-screen flex items-center">
          <div className="text-center w-full space-y-12">
            
            {/* Warm, gentle brand section */}
            <div className="space-y-8">
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="relative">
                  <Brain className="h-12 w-12 md:h-20 md:w-20 text-primary/80 filter drop-shadow-sm" />
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
                </div>
                <h1 className="text-5xl md:text-7xl font-light text-gray-700 tracking-wide drop-shadow-sm">
                  MyRhythm
                </h1>
              </div>
              
              {/* Gentle, empowering value proposition */}
              <div className="space-y-6">
                <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed text-gray-600 font-light tracking-wide">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-primary/90 font-medium cursor-help border-b border-dotted border-primary/30 transition-all hover:border-primary/60">
                        LEAP*
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white/95 text-gray-700 backdrop-blur-sm border border-primary/10">
                      <p className="text-sm">
                        <strong>Your Personal Journey:</strong><br />
                        <strong>L</strong>ive • <strong>E</strong>mpowered • <strong>A</strong>uthentic • <strong>P</strong>roductive
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  {" "}to Align Memory, Focus, Habits and Momentum.
                </p>
              </div>
            </div>
            
            {/* Gentle memory partner promise */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary/70 to-brain-health-500/60 rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg font-medium text-primary/90">Your Memory Partner Promise</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  Experience gentle memory improvement in just 7 days as you discover <strong className="text-primary/80">YOUR unique LEAP pattern</strong>, establish <strong className="text-brain-health-600/80">YOUR personal rhythm</strong>, and build <strong className="text-memory-emerald-600/80">YOUR unstoppable momentum</strong>.
                </p>
              </div>
            </div>
            
            {/* Gentle call-to-action section */}
            <div className="space-y-8 pt-8">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button 
                  size="lg" 
                  variant="premium"
                  className="text-lg px-12 py-8 rounded-full group relative overflow-hidden border border-white/20" 
                  onClick={handleStartJourney}
                >
                  <div className="relative flex items-center gap-3">
                    <span className="font-semibold tracking-wide">
                      Start Your Journey
                    </span>
                    <div className="text-xs opacity-90 border-l border-white/30 pl-3">
                      7-Day Free Trial
                    </div>
                  </div>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-10 py-8 rounded-full border border-gray-300 text-gray-600 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300" 
                  onClick={scrollToFramework}
                >
                  Learn The Framework
                </Button>
              </div>
              
              {/* Subtle trust indicators */}
              <div className="flex items-center justify-center gap-12 text-sm text-gray-500 pt-4">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-primary/60 rounded-full animate-pulse"></div>
                  <span className="font-light">7-Day Free Trial</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-brain-health-300/60 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span className="font-light">Cancel Anytime</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-memory-emerald-300/60 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                  <span className="font-light">Start Immediately</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gentle scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="text-gray-400 text-xs font-light tracking-wider">DISCOVER MORE</div>
            <div className="animate-bounce">
              <ChevronDown className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Login Modal */}
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </section>
    </TooltipProvider>
  );
}
