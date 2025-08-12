import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppleHeroSection } from "@/components/landing/AppleHeroSection";
import { StatisticsSection } from "@/components/landing/StatisticsSection";
import { InteractiveDemo } from "@/components/landing/InteractiveDemo";
import { MyRhythmIntro } from "@/components/landing/MyRhythmIntro";
import { WhyItHelpsSection } from "@/components/landing/WhyItHelpsSection";
import { PersonalJourneySection } from "@/components/landing/PersonalJourneySection";
import { CallToAction } from "@/components/landing/CallToAction";
import { FloatingRegisterButton } from "@/components/landing/FloatingRegisterButton";
import LandingFooter from "@/components/landing/LandingFooter";
import { useNavigate } from "react-router-dom";

const DemoLanding = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen">
      <ScrollArea className="h-screen">
        <AppleHeroSection />
        <StatisticsSection />
        <InteractiveDemo />
        <MyRhythmIntro />
        <WhyItHelpsSection />
        <PersonalJourneySection />
        <CallToAction onGetStarted={handleGetStarted} />
        <LandingFooter />
      </ScrollArea>
      
      <FloatingRegisterButton />
    </div>
  );
};

export default DemoLanding;