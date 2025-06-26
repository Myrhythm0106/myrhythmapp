import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, Brain, UserPlus, Star } from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";
import { QuickRegisterModal } from "./QuickRegisterModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export function HeroSection() {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showRegisterModal, setShowRegisterModal] = React.useState(false);
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
  return <TooltipProvider>
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 py-20 md:py-28">
        {/* Login button at top right */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
          <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10" onClick={() => setShowLoginModal(true)}>
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </div>

        <div className="container mx-auto px-4 max-w-5xl text-center">
          {/* Brand and Title Section */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Brain className="h-14 w-14 md:h-20 md:w-20 text-primary" />
              <h1 className="text-5xl font-bold text-foreground md:text-8xl">
                MyRhythm
              </h1>
            </div>
            
            {/* Main Value Proposition */}
            <div className="space-y-8">
              <p className="text-2xl max-w-4xl mx-auto leading-relaxed text-annabel-600 md:text-3xl font-medium">
                Your trusted Memory Partner that strengthens your memory first, then empowers you to{" "}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-primary font-semibold cursor-help border-b border-dotted border-primary">
                      LEAP*
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">
                      <strong>L</strong>ive • <strong>E</strong>mpowered • <strong>A</strong>mbitious • <strong>P</strong>roductive
                    </p>
                  </TooltipContent>
                </Tooltip>
                {" "}forward in every area of life
              </p>
            </div>
          </div>
          
          {/* Memory Partner Promise Card */}
          <div className="mb-16">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-primary/20 max-w-3xl mx-auto shadow-lg">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Brain className="h-6 w-6 text-primary" />
                <span className="text-xl font-semibold text-primary">Memory-First Promise</span>
              </div>
              <p className="text-base text-gray-700 leading-relaxed">Experience real memory improvement in just 7 days with our MyRhythm framework, where memory wellness is the foundation that supports every other aspect of your life.</p>
            </div>
          </div>
          
          {/* Call-to-Action Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="text-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 px-10 py-6 flex items-center gap-3 rounded-full" onClick={() => setShowRegisterModal(true)}>
                <UserPlus className="h-6 w-6" />
                Start Your Memory-First Journey
              </Button>
              
              <Button size="lg" variant="outline" className="text-xl px-8 py-6 rounded-full border-2 hover:bg-primary/5" onClick={scrollToFramework}>Learn More</Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-muted-foreground/30"></div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Start Immediately</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-muted-foreground/30"></div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>7-Day Results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        <QuickRegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
      </section>
    </TooltipProvider>;
}