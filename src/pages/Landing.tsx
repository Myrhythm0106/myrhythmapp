
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MyRhythmIntro } from "@/components/landing/MyRhythmIntro";
import { MyRhythmBreakdown } from "@/components/landing/MyRhythmBreakdown";
import { WhyItHelpsSection } from "@/components/landing/WhyItHelpsSection";
import { CallToAction } from "@/components/landing/CallToAction";
import { HeroSection } from "@/components/landing/HeroSection";
import { FloatingRegisterButton } from "@/components/landing/FloatingRegisterButton";
import LandingFooter from "@/components/landing/LandingFooter";

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user && !loading) {
      console.log('Landing: Redirecting authenticated user to dashboard');
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGetStarted = () => {
    navigate("/onboarding");
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render landing page content for unauthenticated users
  // Don't hide the content if user is authenticated - let the useEffect handle redirect
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/60 to-background">
      <ScrollArea className="h-screen">
        <HeroSection />
        <MyRhythmIntro />
        <MyRhythmBreakdown />
        <WhyItHelpsSection />
        <CallToAction onGetStarted={handleGetStarted} />
        <LandingFooter />
      </ScrollArea>
      
      {/* Enhanced floating registration button for all devices */}
      {!user && <FloatingRegisterButton />}
    </div>
  );
};

export default Landing;
