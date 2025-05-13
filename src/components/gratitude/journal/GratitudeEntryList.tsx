
import React from "react";
import { GratitudeEntry } from "../GratitudePrompt";
import { GratitudeEntryCard } from "./GratitudeEntryCard";
import { EmptyJournalMessage } from "./EmptyJournalMessage";

interface GratitudeEntryListProps {
  entries: GratitudeEntry[];
  hasSearchFilters: boolean;
  onSelectEntry: (entry: GratitudeEntry) => void;
  onShareEntry: (entry: GratitudeEntry) => void;
}

export function GratitudeEntryList({
  entries,
  hasSearchFilters,
  onSelectEntry,
  onShareEntry
}: GratitudeEntryListProps) {
  if (entries.length === 0) {
    return <EmptyJournalMessage hasSearchFilters={hasSearchFilters} />;
  }

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
