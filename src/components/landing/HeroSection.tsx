
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, Brain, UserPlus, Star, ChevronDown, Eye, Leaf } from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function HeroSection() {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [isPromiseExpanded, setIsPromiseExpanded] = React.useState(false);
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
    console.log("HeroSection: Register Here button clicked - GREEN NATURE VERSION");
    console.log("HeroSection: About to navigate to /onboarding");
    console.log("HeroSection: Current location:", window.location.href);
    try {
      navigate("/onboarding");
      console.log("HeroSection: navigate() called successfully");
    } catch (error) {
      console.error("HeroSection: Navigation error:", error);
    }
  };

  const handleViewPreview = () => {
    navigate("/preview-landing");
  };

  const handleViewPreview2 = () => {
    navigate("/preview-2");
  };

  const handleViewPreview3 = () => {
    navigate("/preview-3");
  };

  return (
    <TooltipProvider>
      <section className="relative overflow-hidden min-h-screen">
        {/* Background Nature Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.2)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />

        {/* Top right buttons */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10 flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20" 
            onClick={handleViewPreview}
          >
            <Eye className="h-4 w-4" />
            Preview 1
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20" 
            onClick={handleViewPreview2}
          >
            <Brain className="h-4 w-4" />
            Preview 2
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20" 
            onClick={handleViewPreview3}
          >
            <Leaf className="h-4 w-4" />
            Preview 3
          </Button>
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20" 
            onClick={() => setShowLoginModal(true)}
          >
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-6xl min-h-screen flex items-center">
          <div className="text-center w-full space-y-8">
            
            {/* Brand and Title Section */}
            <div className="mb-16">
              <div className="flex items-center justify-center gap-4 mb-12">
                <Brain className="h-16 w-16 md:h-24 md:w-24 text-green-400" />
                <h1 className="text-6xl font-bold text-white md:text-9xl drop-shadow-lg">
                  MyRhythm
                </h1>
              </div>
              
              {/* Main Value Proposition with Updated Framework */}
              <div className="space-y-12">
                <p className="text-3xl max-w-5xl mx-auto leading-relaxed text-white font-medium md:text-2xl drop-shadow-md">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-green-300 font-semibold cursor-help border-b border-dotted border-green-300">
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
                  {" "}to Align Memory, Focus, Habits and Momentum.
                </p>
              </div>
            </div>
            
            {/* Memory Partner Promise Card - Now Collapsible */}
            <div className="mb-20">
              <Collapsible open={isPromiseExpanded} onOpenChange={setIsPromiseExpanded}>
                <CollapsibleTrigger asChild>
                  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-green-200 max-w-4xl mx-auto shadow-xl cursor-pointer hover:shadow-2xl transition-shadow">
                    <div className="flex items-center justify-center gap-3">
                      <Brain className="h-8 w-8 text-green-600" />
                      <span className="text-2xl font-semibold text-green-700">Your Memory Partner Promise</span>
                      <ChevronDown className={`h-5 w-5 text-green-600 transition-transform duration-200 ${isPromiseExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="bg-white/90 backdrop-blur-sm p-6 pt-2 rounded-b-3xl border-x border-b border-green-200 max-w-4xl mx-auto shadow-xl -mt-4">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Experience real memory improvement in just 7 days as you discover <strong className="text-green-600">YOUR unique LEAP pattern</strong>, establish <strong className="text-green-600">YOUR personal rhythm</strong>, and build <strong className="text-green-600">YOUR unstoppable momentum</strong>—where memory wellness becomes the foundation for your entire life transformation.
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
            
            {/* Call-to-Action Section */}
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Button 
                  size="lg" 
                  className="text-lg bg-green-600 hover:bg-green-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-6 flex items-center gap-3 rounded-full max-w-md mx-auto sm:mx-0" 
                  onClick={handleStartJourney}
                >
                  <UserPlus className="h-5 w-5 flex-shrink-0" />
                  <span className="text-center leading-tight">
                    Register Here
                    <br />
                    <span className="text-sm opacity-90">7-Day Free Trial</span>
                  </span>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 rounded-full border-2 border-white text-white hover:bg-white/10 max-w-md mx-auto sm:mx-0" 
                  onClick={scrollToFramework}
                >
                  Learn The Framework
                </Button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-8 md:gap-12 text-sm text-green-100 pt-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-green-300" />
                  <span>7-Day Free Trial</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-green-200/30"></div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-green-300" />
                  <span>Cancel Anytime</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-green-200/30"></div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-green-300" />
                  <span>Start Immediately</span>
                </div>
              </div>
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
