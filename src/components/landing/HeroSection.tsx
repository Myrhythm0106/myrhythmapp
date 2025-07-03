import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, Brain, UserPlus, Star } from "lucide-react";
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
    console.log("HeroSection: Start Your LEAP button clicked - PRODUCTION VERSION");
    console.log("HeroSection: About to navigate to /onboarding");
    console.log("HeroSection: Current location:", window.location.href);
    try {
      navigate("/onboarding");
      console.log("HeroSection: navigate() called successfully");
    } catch (error) {
      console.error("HeroSection: Navigation error:", error);
    }
  };
  return <TooltipProvider>
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 py-20 md:py-32">
        {/* Login button at top right */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
          <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10" onClick={() => setShowLoginModal(true)}>
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </div>

        <div className="container mx-auto px-4 max-w-6xl text-center">
          {/* Brand and Title Section */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-4 mb-12">
              <Brain className="h-16 w-16 md:h-24 md:w-24 text-primary" />
              <h1 className="text-6xl font-bold text-foreground md:text-9xl">
                MyRhythm
              </h1>
            </div>
            
            {/* Main Value Proposition with Updated Framework */}
            <div className="space-y-12">
              <p className="text-3xl max-w-5xl mx-auto leading-relaxed text-gray-700 md:text-4xl font-medium">
                Your{" "}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-primary font-semibold cursor-help border-b border-dotted border-primary">
                      LEAP*
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">
                      <strong>Your Personal Journey:</strong><br />
                      <strong>L</strong>ive • <strong>E</strong>mpowered • <strong>A</strong>uthentic • <strong>P</strong>roductive
                    </p>
                  </TooltipContent>
                </Tooltip>
                , Your Rhythm, Your Momentum.
              </p>
              
              {/* Updated Framework Description */}
              
            </div>
          </div>
          
          {/* Memory Partner Promise Card */}
          <div className="mb-20">
            <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl border border-primary/20 max-w-4xl mx-auto shadow-lg">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Brain className="h-8 w-8 text-primary" />
                <span className="text-2xl font-semibold text-primary">Your Memory Partner Promise</span>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Experience real memory improvement in just 7 days as you discover <strong>YOUR unique LEAP pattern</strong>, establish <strong>YOUR personal rhythm</strong>, and build <strong>YOUR unstoppable momentum</strong>—where memory wellness becomes the foundation for your entire life transformation.
              </p>
            </div>
          </div>
          
          {/* Call-to-Action Section */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Button size="lg" className="text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-6 flex items-center gap-3 rounded-full max-w-md mx-auto sm:mx-0" onClick={handleStartJourney}>
                <UserPlus className="h-5 w-5 flex-shrink-0" />
                <span className="text-center leading-tight">
                  Start Your LEAP
                  <br />
                  <span className="text-sm opacity-90">7-Day Free Trial</span>
                </span>
              </Button>
              
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-2 hover:bg-primary/5 max-w-md mx-auto sm:mx-0" onClick={scrollToFramework}>
                Learn The Framework
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-8 md:gap-12 text-sm text-muted-foreground pt-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>7-Day Free Trial</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-muted-foreground/30"></div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Cancel Anytime</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-muted-foreground/30"></div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Start Immediately</span>
              </div>
            </div>
          </div>
        </div>

        {/* Login Modal */}
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </section>
    </TooltipProvider>;
}