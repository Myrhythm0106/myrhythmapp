
import React from "react";
import { Badge } from "@/components/ui/badge";
import { GratitudeEntry } from "../../GratitudePrompt";

interface EntryContentProps {
  entry: GratitudeEntry;
  onSelectEntry: (entry: GratitudeEntry) => void;
}

export function EntryContent({ entry, onSelectEntry }: EntryContentProps) {
  return (
    <div className="space-y-3">
      <p 
        className="text-sm font-medium leading-relaxed cursor-pointer"
        onClick={() => onSelectEntry(entry)}
      >
        {entry.gratitudeText}
      </p>
      
      {entry.whyGrateful && (
        <div className="text-sm text-muted-foreground italic border-l-2 border-muted pl-3">
          Why: {entry.whyGrateful}
        </div>
      )}
      
      {entry.tags && entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {entry.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
          {entry.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{entry.tags.length - 3} more
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
