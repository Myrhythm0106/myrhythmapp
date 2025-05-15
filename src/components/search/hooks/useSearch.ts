
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { SearchResult } from "../types/searchTypes";
import { allSearchResults } from "../data/searchData";

export function useSearch() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Record<string, SearchResult[]>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle search
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    
    if (!value) {
      // Group all results by category
      const groupedResults = allSearchResults.reduce<Record<string, SearchResult[]>>((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});
      
      setSearchResults(groupedResults);
      return;
    }
    
    // Filter results based on search query
    const filtered = allSearchResults.filter(item => 
      item.title.toLowerCase().includes(value.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(value.toLowerCase())) ||
      item.category.toLowerCase().includes(value.toLowerCase())
    );
    
    // Group filtered results by category
    const groupedResults = filtered.reduce<Record<string, SearchResult[]>>((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
    
    setSearchResults(groupedResults);
  }, []);

  // Initialize search results on mount
  useEffect(() => {
    const groupedResults = allSearchResults.reduce<Record<string, SearchResult[]>>((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
    
    setSearchResults(groupedResults);
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
    
    // Reset search results to grouped initial state
    const groupedResults = allSearchResults.reduce<Record<string, SearchResult[]>>((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
    
    setSearchResults(groupedResults);
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
