import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FoundersMemoryStoryContent } from "@/components/memory-first/FoundersMemoryStoryContent";

export default function FoundersMemoryStory() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/60 to-background">
      <ScrollArea className="h-[calc(100vh)]">
        <FoundersMemoryStoryContent />
      </ScrollArea>
    </div>
  );
}