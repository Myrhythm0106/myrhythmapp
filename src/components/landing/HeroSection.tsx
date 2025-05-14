
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
  const scrollToFeatures = () => {
    // Find the features section and scroll to it
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: 'smooth'
      });
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
            <h2 className="text-4xl font-bold leading-tight md:text-5xl">Be Empowered. Be Inspired.   Your Day Starts Here.</h2>
            <p className="text-xl text-muted-foreground">
              Take charge and live. Organise your priorities, build a Routine, strengthen your Discipline, Execute with focus and Review with intention.
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
              <Button size="lg" variant="outline" className="text-lg border-beacon-600 text-beacon-600 hover:bg-beacon-50 relative z-20" onClick={scrollToFeatures}>
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Removed the bouncing "Start Here" button */}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </section>;
};
export default HeroSection;
