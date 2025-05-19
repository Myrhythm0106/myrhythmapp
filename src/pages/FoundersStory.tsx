
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FoundersStoryContent } from "@/components/founders-story/FoundersStoryContent";

export default function FoundersStory() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/60 to-background">
      <ScrollArea className="h-[calc(100vh)]">
        <FoundersStoryContent />
      </ScrollArea>
    </div>
  );
}
