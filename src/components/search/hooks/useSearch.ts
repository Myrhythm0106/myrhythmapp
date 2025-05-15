
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { SearchResult } from "../types/searchTypes";
import { allSearchResults } from "../data/searchData";

export function useSearch() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>(allSearchResults);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle search
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    
    if (!value) {
      setSearchResults(allSearchResults);
      return;
    }
    
    // Filter results based on search query
    const filtered = allSearchResults.filter(item => 
      item.title.toLowerCase().includes(value.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(value.toLowerCase())) ||
      item.category.toLowerCase().includes(value.toLowerCase())
    );
    
    setSearchResults(filtered);
  }, []);

  // Navigate to selected item
  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    navigate(result.route);
    toast({
      title: `Navigating to ${result.title}`,
      description: result.description
    });
  };

  // Toggle search dialog
  const toggleSearch = useCallback(() => {
    setOpen(prev => !prev);
    setSearchQuery("");
    setSearchResults(allSearchResults);
  }, []);

  // Keyboard shortcut: CTRL + K or Command + K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearch]);

  return {
    open,
    setOpen,
    searchQuery,
    searchResults,
    handleSearch,
    handleSelect,
    toggleSearch
  };
}
