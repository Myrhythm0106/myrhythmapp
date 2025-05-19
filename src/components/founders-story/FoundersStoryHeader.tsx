
import React from "react";
import { Brain } from "lucide-react";

export function FoundersStoryHeader() {
  return (
    <header className="mb-10">
      <div className="flex items-center gap-3">
        <Brain className="h-8 w-8 md:h-10 md:w-10 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary">The Founder's Story</h1>
      </div>
      <p className="mt-4 text-lg text-muted-foreground">
        Discover the journey behind MyRhythm and how it came to be
      </p>
    </header>
  );
}
