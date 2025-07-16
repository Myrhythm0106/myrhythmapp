import React, { useState, useEffect } from "react";
import { HeroSection } from "./sections/HeroSection";
import { MemoryStrugglesSection } from "./sections/MemoryStrugglesSection";
import { Memory8StepFrameworkSection } from "./sections/Memory8StepFrameworkSection";
import { MemorySuccessStoriesSection } from "./sections/MemorySuccessStoriesSection";
import { FounderStorySection } from "./sections/FounderStorySection";
import { MemoryCommunitySection } from "./sections/MemoryCommunitySection";
import { MemoryFirstHomeSkeleton } from "./MemoryFirstHomeSkeleton";
import { MobileMenu } from "@/components/mobile/MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Preview3Background } from "@/components/ui/Preview3Background";

export function MemoryFirstHomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <Preview3Background>
        <MemoryFirstHomeSkeleton />
      </Preview3Background>
    );
  }
  
  return (
    <Preview3Background>
      <div className="space-y-12 max-w-6xl mx-auto pb-12 px-4">
        {isMobile && <MobileMenu />}
        
        <HeroSection />
        <MemoryStrugglesSection />
        <Memory8StepFrameworkSection />
        <MemorySuccessStoriesSection />
        <FounderStorySection />
        <MemoryCommunitySection />
      </div>
    </Preview3Background>
  );
}