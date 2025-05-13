
import { useState, useMemo } from "react";
import { GratitudeEntry } from "../GratitudePrompt";
import { useGratitude } from "@/hooks/use-gratitude";
import { toast } from "@/components/ui/toast";

export function useGratitudeJournal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<GratitudeEntry | null>(null);
  const { entries, deleteEntry, updateEntry } = useGratitude();
  
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = !searchQuery || 
        entry.gratitudeText.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = !filterType || entry.promptType === filterType;
      
      return matchesSearch && matchesFilter;
    });
  }, [entries, searchQuery, filterType]);
  
  const handleShare = (entry: GratitudeEntry) => {
    updateEntry(entry.id, { isShared: !entry.isShared });
    toast({
      title: entry.isShared ? "Entry is now private" : "Entry shared with your trusted contacts",
      variant: "default",
    });
  };
  
  const handleDelete = (id: string) => {
    deleteEntry(id);
    setSelectedEntry(null);
    toast({
      title: "Entry deleted successfully",
      variant: "default",
    });
  };
  
  const hasSearchFilters = !!searchQuery || !!filterType;
  
  return {
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
  };
}
