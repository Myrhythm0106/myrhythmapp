
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, Brain, ChevronDown } from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function HeroSection() {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const navigate = useNavigate();

  // Function to scroll to MyRhythm Framework section
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
    console.log("HeroSection: About to navigate to /auth");
    console.log("HeroSection: Current location:", window.location.href);
    try {
      navigate("/auth");
      console.log("HeroSection: navigate() called successfully");
    } catch (error) {
      console.error("HeroSection: Navigation error:", error);
    }
  };

  return (
    <TooltipProvider>
      <section className="relative overflow-hidden min-h-screen">
        {/* Beautiful gradient background - purple-blue-teal dominant */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 via-blue-100/50 to-teal-100/60"></div>
        
        {/* Additional overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/30 via-blue-50/40 to-teal-50/30"></div>

        {/* Beautiful floating gradient elements - purple-blue-teal with tiny emerald touches */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 rounded-full animate-pulse opacity-60" style={{animationDelay: '0s', animationDuration: '6s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full animate-pulse opacity-50" style={{animationDelay: '3s', animationDuration: '8s'}}></div>
          <div className="absolute bottom-1/3 left-1/2 w-5 h-5 bg-gradient-to-r from-teal-400 via-purple-400 to-blue-400 rounded-full animate-pulse opacity-40" style={{animationDelay: '6s', animationDuration: '10s'}}></div>
          {/* Subtle amber accent */}
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-gradient-to-r from-amber-300/60 to-yellow-300/40 rounded-full animate-pulse opacity-30" style={{animationDelay: '9s', animationDuration: '12s'}}></div>
          {/* Tiny emerald therapeutic touch */}
          <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-emerald-400/40 rounded-full animate-pulse opacity-25" style={{animationDelay: '12s', animationDuration: '15s'}}></div>
        </div>

        {/* Fixed top navigation */}
        <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
          <Button 
            variant="ghost" 
            className="bg-white/80 backdrop-blur-md text-purple-700 border border-purple-200/60 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 rounded-full px-4 py-2 md:px-6 md:py-2 text-sm font-medium transition-all duration-300" 
            onClick={() => setShowLoginModal(true)}
          >
            <LogIn className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Login</span>
          </Button>
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-6xl min-h-screen flex items-center">
          <div className="text-center w-full space-y-8 md:space-y-12 pt-16 md:pt-0">
            
            {/* Brain icon with purple-blue-teal dominant, tiny emerald touch */}
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center justify-center gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="relative">
                  {/* BRAIN ICON - purple-blue-teal dominant with tiny emerald therapeutic touch */}
                  <div className="w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 flex items-center justify-center shadow-2xl border border-emerald-200/20">
                    <Brain className="h-6 w-6 md:h-8 md:w-8 lg:h-12 lg:w-12 text-white filter drop-shadow-md" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-blue-400/30 to-teal-400/30 rounded-full blur-xl animate-pulse"></div>
                </div>
                {/* Title - purple-blue-teal dominant */}
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent tracking-wide drop-shadow-sm">
                  MyRhythm
                </h1>
              </div>
              
              {/* Value proposition */}
              <div className="space-y-4 md:space-y-6">
                <p className="text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed text-gray-700 font-light tracking-wide px-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent font-medium cursor-help border-b border-dotted border-purple-300/50 transition-all hover:border-purple-500/80">
                        LEAP*
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white/95 text-gray-700 backdrop-blur-sm border border-purple-200/60">
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
            
            {/* Memory Partner Promise - purple-blue-teal with tiny emerald therapeutic touch */}
            <div className="max-w-5xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="memory-promise" className="border-none">
                  <div className="bg-gradient-to-r from-white/90 via-purple-50/60 to-blue-50/50 backdrop-blur-sm border border-purple-200/30 rounded-2xl shadow-xl border-l-2 border-l-emerald-300/30">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                          <Brain className="h-4 w-4 text-white" />
                          <div className="absolute w-1 h-1 bg-emerald-400/60 rounded-full -top-0.5 -right-0.5"></div>
                        </div>
                        <span className="text-lg font-medium bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">Your Memory Partner Promise</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <p className="text-sm text-gray-600 leading-relaxed max-w-3xl mx-auto">
                        Experience gentle memory improvement in just 7 days as you discover <strong className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">YOUR unique LEAP pattern</strong>, establish <strong className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">YOUR personal rhythm</strong>, and build <strong className="bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">YOUR unstoppable momentum</strong>.
                      </p>
                    </AccordionContent>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>
            
            {/* Call-to-action section - purple-blue-teal dominant */}
            <div className="space-y-6 md:space-y-8 pt-6 md:pt-8">
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
                <Button 
                  size="lg" 
                  className="text-base md:text-lg px-8 py-6 md:px-12 md:py-8 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 border-2 border-white/20 group relative overflow-hidden font-semibold w-full sm:w-auto max-w-sm" 
                  onClick={handleStartJourney}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center gap-2 md:gap-3">
                    <span className="font-semibold tracking-wide">
                      Start Your Journey
                    </span>
                    <div className="text-xs opacity-90 border-l border-white/30 pl-2 md:pl-3">
                      7-Day Free Trial
                    </div>
                  </div>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-base md:text-lg px-6 py-6 md:px-10 md:py-8 rounded-full border-2 border-purple-300/60 text-purple-700 bg-white/70 backdrop-blur-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:border-purple-400/80 transition-all duration-300 w-full sm:w-auto max-w-sm" 
                  onClick={scrollToFramework}
                >
                  Learn The Framework
                </Button>
              </div>
              
              {/* Trust indicators - purple-blue-teal with tiny emerald therapeutic touches */}
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm text-gray-600 pt-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse"></div>
                  <span className="font-light">7-Day Free Trial</span>
                </div>
                <div className="w-px h-4 bg-gradient-to-b from-purple-300 to-blue-300 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span className="font-light">Cancel Anytime</span>
                </div>
                <div className="w-px h-4 bg-gradient-to-b from-blue-300 to-teal-300 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-gradient-to-r from-teal-400 to-purple-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                  <span className="font-light">Start Immediately</span>
                </div>
                {/* Subtle amber-emerald accent */}
                <div className="w-px h-4 bg-gradient-to-b from-teal-300 to-amber-200/60 hidden lg:block"></div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-gradient-to-r from-amber-300/70 to-emerald-300/40 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
                  <span className="font-light text-amber-600/80">Premium Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="text-purple-500/80 text-xs font-light tracking-wider">DISCOVER MORE</div>
            <div className="animate-bounce">
              <ChevronDown className="h-6 w-6 text-purple-500/70" />
            </div>
          </div>
        </div>

        {/* Login Modal */}
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </section>
    </TooltipProvider>
  );
}
