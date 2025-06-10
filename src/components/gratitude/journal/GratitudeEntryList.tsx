
import React from "react";
import { GratitudeEntry } from "../GratitudePrompt";
import { EntryListContainer } from "./components/EntryListContainer";
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
    <EntryListContainer
      entries={entries}
      onSelectEntry={onSelectEntry}
      onShareEntry={onShareEntry}
    />
  );
}
