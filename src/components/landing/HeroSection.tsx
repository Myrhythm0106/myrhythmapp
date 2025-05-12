import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, LogIn, ArrowLeft } from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";
const HeroSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Function to handle back navigation if coming from onboarding
  const handleBackNavigation = () => {
    if (location.state?.from === "onboarding") {
      navigate(-1); // Go back to the previous page
    } else {
      navigate("/"); // Go to home if not coming from onboarding
    }
  };
  return <section className="relative overflow-hidden">
      <div className="bg-gradient-to-r from-beacon-100 to-beacon-200 py-28 md:py-36">
        {/* Login button at very top right */}
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10" onClick={() => setShowLoginModal(true)}>
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          </div>
          
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-14 w-14 text-beacon-600" />
              <h1 className="text-5xl font-bold">MyRhythm</h1>
            </div>
          </div>
          
          <div className="text-center mb-16 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold leading-tight md:text-5xl">Organise Your World. 
Support Your Recall.</h2>
            <p className="text-xl text-muted-foreground">
              Empowering you to live O.R.D.E.R.ly. Organize priorities, build Routines, strengthen Discipline, Execute with focus, and Review with intention. 
              <br /><br />
              It's not just productivity.
              It's your rhythm for life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="text-lg bg-aaron-400 hover:bg-aaron-500 text-black font-bold border-2 border-white relative z-20" onClick={() => navigate("/onboarding?step=1", {
              state: {
                from: "landing"
              }
            })}>
                <span>Start Your Journey</span>
                <ArrowRight className="ml-2 h-5 w-5 text-black" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg border-beacon-600 text-beacon-600 hover:bg-beacon-50 relative z-20" onClick={() => navigate("/onboarding?step=1", {
              state: {
                from: "landing"
              }
            })}>
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Start Here button/indicator with enhanced visibility */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
            <Button variant="secondary" size="lg" className="rounded-full px-8 py-6 font-semibold shadow-lg bg-aaron-300 hover:bg-aaron-400 text-black border-2 border-white" onClick={() => navigate("/onboarding?step=1", {
            state: {
              from: "landing"
            }
          })}>
              <span className="font-bold text-black">Start Here</span>
              <ArrowRight className="ml-2 h-5 w-5 text-black" />
            </Button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </section>;
};
export default HeroSection;