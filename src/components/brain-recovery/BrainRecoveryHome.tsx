
import React, { useState, useEffect } from "react";
import { gameTypes } from "@/components/brain-games/data/gamesData";
import { HeroSection } from "./sections/HeroSection";
import { EssentialToolsSection } from "./sections/EssentialToolsSection";
import { WhyMyRhythmSection } from "./sections/WhyMyRhythmSection";
import { OurStorySection } from "./sections/OurStorySection";
import { CommunityCTASection } from "./sections/CommunityCTASection";
import { BrainRecoveryHomeSkeleton } from "./BrainRecoveryHomeSkeleton";

export function BrainRecoveryHome() {
  const [isLoading, setIsLoading] = useState(true);
  
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
    return <BrainRecoveryHomeSkeleton />;
  }
  
  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4">
      <HeroSection />
      <EssentialToolsSection recommendedGame={recommendedGame} />
      <WhyMyRhythmSection />
      <OurStorySection />
      <CommunityCTASection />
    </div>
  );
}
