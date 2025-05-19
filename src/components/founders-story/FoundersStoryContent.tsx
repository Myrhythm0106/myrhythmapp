
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
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

export function FoundersStoryContent() {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-6 text-foreground">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center gap-2 text-primary hover:text-primary/80"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>
      
      <FoundersStoryHeader />

      <Card className="p-6 md:p-8 mb-8 bg-gradient-to-br from-background to-muted/30 border">
        <div className="prose prose-zinc max-w-none">
          <TruthSection />
        </div>
      </Card>
      
      <div className="space-y-12">
        <Card className="p-6 md:p-8 bg-gradient-to-br from-background to-muted/30 border">
          <div className="prose prose-zinc max-w-none">
            <StorySection />
          </div>
        </Card>
        
        <Card className="p-6 md:p-8 bg-gradient-to-br from-background to-muted/30 border">
          <div className="prose prose-zinc max-w-none">
            <MeetMyRhythmSection />
          </div>
        </Card>
        
        <Card className="p-6 md:p-8 bg-gradient-to-br from-background to-muted/30 border">
          <div className="prose prose-zinc max-w-none">
            <WhyItWorksSection />
          </div>
        </Card>
        
        <Card className="p-6 md:p-8 bg-gradient-to-br from-background to-muted/30 border">
          <div className="prose prose-zinc max-w-none">
            <WhoItsForSection />
          </div>
        </Card>
        
        <Card className="p-6 md:p-8 bg-gradient-to-br from-background to-muted/30 border">
          <div className="prose prose-zinc max-w-none">
            <BuiltForPeopleSection />
          </div>
        </Card>
        
        <Card className="p-6 md:p-8 bg-gradient-to-br from-background to-muted/30 border">
          <div className="prose prose-zinc max-w-none">
            <YourRhythmSection />
          </div>
        </Card>
        
        <Card className="p-6 md:p-8 bg-gradient-to-br from-background to-muted/30 border">
          <div className="prose prose-zinc max-w-none">
            <FinalWordSection />
          </div>
        </Card>
      </div>
      
      <div className="mt-12 text-center">
        <Button 
          size="lg" 
          className="text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => navigate("/guide")}
        >
          Read the MyRhythm Guide
        </Button>
      </div>
    </div>
  );
}
