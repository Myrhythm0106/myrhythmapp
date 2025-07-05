
import React, { useState, useEffect } from "react";
import { gameTypes } from "@/components/brain-games/data/gamesData";
import { HeroSection } from "./sections/HeroSection";
import { EssentialToolsSection } from "./sections/EssentialToolsSection";
import { WhyMyRhythmSection } from "./sections/WhyMyRhythmSection";
import { OurStorySection } from "./sections/OurStorySection";
import { CommunityCTASection } from "./sections/CommunityCTASection";
import { BrainRecoveryHomeSkeleton } from "./BrainRecoveryHomeSkeleton";
import { MobileMenu } from "@/components/mobile/MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Preview3Background } from "@/components/ui/Preview3Background";

export function BrainRecoveryHome() {
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  // Simulate loading of data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Show skeleton for 1.5 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get a recommended game for quick start
  const recommendedGame = gameTypes[1]; // Memory Match game is ideal for new users
  
  if (isLoading) {
    return (
      <Preview3Background>
        <BrainRecoveryHomeSkeleton />
      </Preview3Background>
    );
  }
  
  return (
    <Preview3Background>
      <div className="space-y-8 max-w-5xl mx-auto pb-12 px-4">
        {/* Show mobile menu only on mobile devices */}
        {isMobile && <MobileMenu />}
        
        <HeroSection />
        <EssentialToolsSection recommendedGame={recommendedGame} />
        <WhyMyRhythmSection />
        <OurStorySection />
        <CommunityCTASection />
      </div>
    </Preview3Background>
  );
}
