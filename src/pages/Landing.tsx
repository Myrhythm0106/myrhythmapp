
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { MyRhythmIntro } from "@/components/landing/MyRhythmIntro";
import { WhyItHelpsSection } from "@/components/landing/WhyItHelpsSection";
import { PersonalJourneySection } from "@/components/landing/PersonalJourneySection";
import { CallToAction } from "@/components/landing/CallToAction";
import { AppleHeroSection } from "@/components/landing/AppleHeroSection";
import { StatisticsSection } from "@/components/landing/StatisticsSection";
import { InteractiveDemo } from "@/components/landing/InteractiveDemo";
import { FloatingRegisterButton } from "@/components/landing/FloatingRegisterButton";
import LandingFooter from "@/components/landing/LandingFooter";
import { BreakingTheCycleSection } from "@/components/landing/BreakingTheCycleSection";
import { MemoryBridgeSection } from "@/components/landing/MemoryBridgeSection";
import { FoundingMemberBanner } from "@/components/landing/FoundingMemberBanner";
import { FoundingMemberPricingCard } from "@/components/landing/FoundingMemberPricingCard";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Redirect authenticated users to Dashboard
  useEffect(() => {
    if (user && !loading) {
      console.log('Landing: Redirecting authenticated user to Dashboard');
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  // For unauthenticated users, prioritize authentication
  const handleAuthRedirect = () => {
    navigate("/auth");
  };

  const handleGetStarted = () => {
    // For unauthenticated users, go to auth first
    if (!user) {
      navigate("/auth");
    } else {
      navigate("/mvp/user-type-selection");
    }
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
    <ErrorBoundary>
      <div className="min-h-screen">
        <FoundingMemberBanner />
        <ScrollArea className="h-screen">
          <AppleHeroSection />
          
          {/* Auth-focused section for unauthenticated users */}
          {!user && (
            <div className="bg-gradient-to-b from-memory-emerald-50/30 to-clarity-teal-50/20 py-16">
              <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-brain-health-800 mb-6">
                  Ready to Transform Your Life?
                </h2>
                <p className="text-lg text-brain-health-600 mb-8 max-w-2xl mx-auto">
                  Join thousands who've discovered their rhythm. Start with a free assessment and personalized guidance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleAuthRedirect}
                    className="px-8 py-4 bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 hover:from-memory-emerald-600 hover:to-clarity-teal-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Get Started Free
                  </button>
                  <button
                    onClick={handleAuthRedirect}
                    className="px-8 py-4 border-2 border-memory-emerald-500 text-memory-emerald-600 hover:bg-memory-emerald-50 font-semibold rounded-xl transition-all duration-200"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <FoundingMemberPricingCard onGetStarted={handleGetStarted} />
          <BreakingTheCycleSection />
          <MemoryBridgeSection />
          <WhyItHelpsSection />
          <StatisticsSection />
          <InteractiveDemo />
          <MyRhythmIntro />
          <PersonalJourneySection />
          <CallToAction onGetStarted={handleGetStarted} />
          <LandingFooter />
        </ScrollArea>
        
        {/* Show floating button until user completes registration */}
        <FloatingRegisterButton />
      </div>
    </ErrorBoundary>
  );
};

export default Landing;
