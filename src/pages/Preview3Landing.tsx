
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MyRhythmIntro } from "@/components/landing/MyRhythmIntro";
import { WhyItHelpsSection } from "@/components/landing/WhyItHelpsSection";
import { PersonalJourneySection } from "@/components/landing/PersonalJourneySection";
import { CallToAction } from "@/components/landing/CallToAction";
import { Preview3HeroSection } from "@/components/landing/Preview3HeroSection";
import { FloatingRegisterButton } from "@/components/landing/FloatingRegisterButton";
import LandingFooter from "@/components/landing/LandingFooter";

const Preview3Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Only redirect authenticated users to dashboard
  useEffect(() => {
    if (user && !loading) {
      console.log('Preview3Landing: Redirecting authenticated user to dashboard');
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGetStarted = () => {
    navigate("/onboarding");
  };

  // Don't show loading for unauthenticated users - just show the landing page
  if (loading && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading MyRhythm Preview 3...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ScrollArea className="h-screen">
        <Preview3HeroSection />
        {/* Use existing sections but with subtle modifications for brain-health theme */}
        <div id="features-section">
          <MyRhythmIntro />
        </div>
        <WhyItHelpsSection />
        <div id="testimonials-section">
          <PersonalJourneySection />
        </div>
        <div id="pricing-section">
          <CallToAction onGetStarted={handleGetStarted} />
        </div>
        <LandingFooter />
      </ScrollArea>
      
      {/* Show floating button only for unauthenticated users */}
      {!user && <FloatingRegisterButton />}
    </div>
  );
};

export default Preview3Landing;
