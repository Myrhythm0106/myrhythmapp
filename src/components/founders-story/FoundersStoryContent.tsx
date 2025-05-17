
import React from "react";
import { FoundersStoryHeader } from "./FoundersStoryHeader";
import { TruthSection } from "./TruthSection";
import { StorySection } from "./StorySection";
import { MeetMyRhythmSection } from "./MeetMyRhythmSection";
import { WhyItWorksSection } from "./WhyItWorksSection";
import { WhoItsForSection } from "./WhoItsForSection";
import { BuiltForPeopleSection } from "./BuiltForPeopleSection";
import { YourRhythmSection } from "./YourRhythmSection";
import { FinalWordSection } from "./FinalWordSection";

export function FoundersStoryContent() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 md:px-6 text-foreground">
      <FoundersStoryHeader />

      <div className="space-y-8 prose prose-zinc max-w-none">
        <TruthSection />
        <StorySection />
        <MeetMyRhythmSection />
        <WhyItWorksSection />
        <WhoItsForSection />
        <BuiltForPeopleSection />
        <YourRhythmSection />
        <FinalWordSection />
      </div>
    </div>
  );
}
