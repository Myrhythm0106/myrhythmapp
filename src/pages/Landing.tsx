
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MyRhythmIntro } from "@/components/landing/MyRhythmIntro";
import { WhyItHelpsSection } from "@/components/landing/WhyItHelpsSection";
import { PersonalJourneySection } from "@/components/landing/PersonalJourneySection";
import { CallToAction } from "@/components/landing/CallToAction";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatisticsSection } from "@/components/landing/StatisticsSection";
import { InteractiveDemo } from "@/components/landing/InteractiveDemo";
import { FloatingRegisterButton } from "@/components/landing/FloatingRegisterButton";
import LandingFooter from "@/components/landing/LandingFooter";

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Redirect authenticated users to Memory Bridge (Apple/Nike level instant access)
  useEffect(() => {
    if (user && !loading) {
      console.log('Landing: Redirecting authenticated user to Memory Bridge');
      navigate("/memory-bridge", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGetStarted = () => {
    navigate("/auth");
  };

  // Don't show loading for unauthenticated users - just show the landing page
  // Only show brief loading if we're still checking auth state AND user might be authenticated
  if (loading && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-memory-emerald-50/30 to-clarity-teal-50/20">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-memory-emerald-500 mx-auto"></div>
          <p className="text-sm text-brain-health-600 font-light">Loading MyRhythm...</p>
        </div>
      </div>
    );
  }

  // For unauthenticated users or when loading is complete, show the landing page
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-memory-emerald-50/20">
      <ScrollArea className="h-screen">
        <HeroSection />
        <StatisticsSection />
        <InteractiveDemo />
        <MyRhythmIntro />
        <WhyItHelpsSection />
        <PersonalJourneySection />
        <CallToAction onGetStarted={handleGetStarted} />
        <LandingFooter />
      </ScrollArea>
      
      {/* Show floating button until user completes registration */}
      <FloatingRegisterButton />
    </div>
  );
};

export default Landing;
