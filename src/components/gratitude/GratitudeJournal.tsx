
import React from "react";
import { Dialog } from "@/components/ui/dialog";
import { SearchFilters } from "./journal/SearchFilters";
import { GratitudeEntryList } from "./journal/GratitudeEntryList";
import { EntryDetailsDialog } from "./journal/EntryDetailsDialog";
import { useGratitudeJournal } from "./journal/useGratitudeJournal";

export function GratitudeJournal() {
  const {
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    selectedEntry,
    setSelectedEntry,
    filteredEntries,
    handleShare,
    handleDelete,
    hasSearchFilters
  } = useGratitudeJournal();

  return (
    <div className="space-y-6">
      <SearchFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
      />
      
      <GratitudeEntryList
        entries={filteredEntries}
        hasSearchFilters={hasSearchFilters}
        onSelectEntry={setSelectedEntry}
        onShareEntry={handleShare}
      />
      
      <Dialog 
        open={!!selectedEntry} 
        onOpenChange={(open) => !open && setSelectedEntry(null)}
      >
        <EntryDetailsDialog
          selectedEntry={selectedEntry}
          onShareEntry={handleShare}
          onDeleteEntry={handleDelete}
          onClose={() => setSelectedEntry(null)}
        />
      </Dialog>
    </div>
  );
}
