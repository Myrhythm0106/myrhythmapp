
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FoundersStoryContent } from "@/components/founders-story/FoundersStoryContent";

export default function FoundersStory() {
  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <FoundersStoryContent />
    </ScrollArea>
  );
}
