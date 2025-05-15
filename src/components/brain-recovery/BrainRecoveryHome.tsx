
import React from "react";
import { gameTypes } from "@/components/brain-games/data/gamesData";
import { HeroSection } from "./sections/HeroSection";
import { EssentialToolsSection } from "./sections/EssentialToolsSection";
import { WhyMyRhythmSection } from "./sections/WhyMyRhythmSection";
import { OurStorySection } from "./sections/OurStorySection";
import { CommunityCTASection } from "./sections/CommunityCTASection";

export function BrainRecoveryHome() {
  // Get a recommended game for quick start
  const recommendedGame = gameTypes[1]; // Memory Match game is ideal for new users
  
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
