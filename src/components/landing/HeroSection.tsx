
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
    console.log("HeroSection: Start Journey button clicked - SERENE NATURE VERSION");
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
        {/* Serene Forest Background with Therapeutic Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.25), rgba(6, 78, 59, 0.1)), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80')`
          }}
        />

        {/* Floating particles for depth */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-memory-emerald-300/20 rounded-full animate-pulse" style={{animationDelay: '0s', animationDuration: '4s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-clarity-teal-300/30 rounded-full animate-pulse" style={{animationDelay: '2s', animationDuration: '6s'}}></div>
          <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-memory-emerald-200/15 rounded-full animate-pulse" style={{animationDelay: '4s', animationDuration: '8s'}}></div>
        </div>

        {/* Elegant Top Navigation */}
        <div className="absolute top-6 right-6 z-10">
          <Button 
            variant="ghost" 
            className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 rounded-full px-6 py-2 text-sm font-medium transition-all duration-300" 
            onClick={() => setShowLoginModal(true)}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Login
          </Button>
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-6xl min-h-screen flex items-center">
          <div className="text-center w-full space-y-12">
            
            {/* Refined Brand Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="relative">
                  <Brain className="h-20 w-20 text-memory-emerald-400 filter drop-shadow-lg" />
                  <div className="absolute inset-0 bg-memory-emerald-400/20 rounded-full blur-xl animate-pulse"></div>
                </div>
                <h1 className="text-7xl font-light text-white tracking-wide drop-shadow-xl">
                  MyRhythm
                </h1>
              </div>
              
              {/* Elegant Value Proposition */}
              <div className="space-y-6">
                <p className="text-2xl max-w-4xl mx-auto leading-relaxed text-white/95 font-light tracking-wide">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-memory-emerald-300 font-medium cursor-help border-b border-dotted border-memory-emerald-300/50 transition-all hover:border-memory-emerald-300">
                        LEAP*
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white/95 text-gray-800 backdrop-blur-sm border border-memory-emerald-200">
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
            
            {/* Refined Memory Partner Promise - Subtle Banner */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-white/95 backdrop-blur-sm border border-memory-emerald-200/50 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg font-medium text-memory-emerald-700">Your Memory Partner Promise</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  Experience real memory improvement in just 7 days as you discover <strong className="text-memory-emerald-600">YOUR unique LEAP pattern</strong>, establish <strong className="text-memory-emerald-600">YOUR personal rhythm</strong>, and build <strong className="text-memory-emerald-600">YOUR unstoppable momentum</strong>.
                </p>
              </div>
            </div>
            
            {/* Premium Call-to-Action Section */}
            <div className="space-y-8 pt-8">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button 
                  size="lg" 
                  className="text-lg bg-gradient-to-r from-memory-emerald-600 via-memory-emerald-500 to-clarity-teal-500 hover:from-memory-emerald-700 hover:via-memory-emerald-600 hover:to-clarity-teal-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 px-12 py-8 rounded-full group relative overflow-hidden border-2 border-white/20" 
                  onClick={handleStartJourney}
                >
                  {/* Subtle shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-pulse"></div>
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
                  className="text-lg px-10 py-8 rounded-full border-2 border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300" 
                  onClick={scrollToFramework}
                >
                  Learn The Framework
                </Button>
              </div>
              
              {/* Elegant Trust Indicators */}
              <div className="flex items-center justify-center gap-12 text-sm text-memory-emerald-100/80 pt-4">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-memory-emerald-300 rounded-full animate-pulse"></div>
                  <span className="font-light">7-Day Free Trial</span>
                </div>
                <div className="w-px h-4 bg-memory-emerald-200/20"></div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-memory-emerald-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span className="font-light">Cancel Anytime</span>
                </div>
                <div className="w-px h-4 bg-memory-emerald-200/20"></div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-memory-emerald-300 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                  <span className="font-light">Start Immediately</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Elegant Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="text-white/60 text-xs font-light tracking-wider">DISCOVER MORE</div>
            <div className="animate-bounce">
              <ChevronDown className="h-6 w-6 text-white/70" />
            </div>
          </div>
        </div>

        {/* Login Modal */}
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </section>
    </TooltipProvider>
  );
}
