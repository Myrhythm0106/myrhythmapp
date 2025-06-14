
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { MyRhythmIntro } from "@/components/landing/MyRhythmIntro";
import { MyRhythmBreakdown } from "@/components/landing/MyRhythmBreakdown";
import { WhyItHelpsSection } from "@/components/landing/WhyItHelpsSection";
import { CallToAction } from "@/components/landing/CallToAction";
import { HeroSection } from "@/components/landing/HeroSection";
import { FloatingRegisterButton } from "@/components/landing/FloatingRegisterButton";
import LandingFooter from "@/components/landing/LandingFooter";

const Landing = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate("/onboarding");
  };
  
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
      <FloatingRegisterButton />
    </div>
  );
};

export default Landing;
