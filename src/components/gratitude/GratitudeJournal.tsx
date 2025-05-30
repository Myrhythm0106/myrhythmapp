
import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { SearchFilters } from "./journal/SearchFilters";
import { GratitudeEntryList } from "./journal/GratitudeEntryList";
import { EntryDetailsDialog } from "./journal/EntryDetailsDialog";
import { useGratitudeJournal } from "./journal/useGratitudeJournal";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    hasSearchFilters,
    recentEntries
  } = useGratitudeJournal();

  // Add state for opening the quick add dialog
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Quick access to recent entries */}
      <Card className="bg-muted/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BookOpen className="h-5 w-5 text-primary mr-2" />
            Your Recent Gratitude Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {recentEntries.length > 0 ? (
              recentEntries.map(entry => (
                <div 
                  key={entry.id} 
                  className="bg-background p-3 rounded-md cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <p className="font-medium line-clamp-2">{entry.gratitudeText}</p>
                  <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                    <span className="capitalize">{entry.promptType}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center p-6">
                <p className="text-muted-foreground">No entries yet. Let's add your first gratitude!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <SearchFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        onAddNew={() => setIsQuickAddOpen(true)}
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

      {/* Quick Add Dialog */}
      <Dialog
        open={isQuickAddOpen}
        onOpenChange={setIsQuickAddOpen}
      >
        <EntryDetailsDialog
          isNewEntry={true}
          onClose={() => setIsQuickAddOpen(false)}
        />
      </Dialog>
    </div>
  );
}
