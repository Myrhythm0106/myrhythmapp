
import React from "react";
import { GratitudeEntry } from "../../GratitudePrompt";
import { GratitudeEntryCard } from "../GratitudeEntryCard";

interface EntryListContainerProps {
  entries: GratitudeEntry[];
  onSelectEntry: (entry: GratitudeEntry) => void;
  onShareEntry: (entry: GratitudeEntry) => void;
}

export function EntryListContainer({
  entries,
  onSelectEntry,
  onShareEntry
}: EntryListContainerProps) {
  return (
    <div className="space-y-4">
      {entries.map(entry => (
        <GratitudeEntryCard 
          key={entry.id} 
          entry={entry} 
          onSelectEntry={onSelectEntry}
          onShareEntry={onShareEntry}
        />
      ))}
    </div>
  );
}
