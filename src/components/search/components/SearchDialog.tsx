
import React from "react";
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandInput, 
  CommandList 
} from "@/components/ui/command";
import { SearchResult } from "../types/searchTypes";
import { SearchResultGroup } from "./SearchResultGroup";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  onSearch: (value: string) => void;
  searchResults: SearchResult[];
  onSelect: (result: SearchResult) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({ 
  open, 
  onOpenChange, 
  searchQuery, 
  onSearch, 
  searchResults, 
  onSelect 
}) => {
  // Group results by category
  const navigationResults = searchResults.filter(item => item.category === "Navigation");
  const featuresResults = searchResults.filter(item => item.category === "Features");
  const resourcesResults = searchResults.filter(item => item.category === "Resources");
  
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search anything..." 
        value={searchQuery}
        onValueChange={onSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {/* Navigation Group */}
        <SearchResultGroup 
          heading="Navigation" 
          results={navigationResults} 
          onSelect={onSelect} 
        />
        
        {/* Features Group */}
        <SearchResultGroup 
          heading="Features" 
          results={featuresResults} 
          onSelect={onSelect} 
        />

        {/* Resources Group */}
        <SearchResultGroup 
          heading="Resources" 
          results={resourcesResults} 
          onSelect={onSelect} 
        />
      </CommandList>
    </CommandDialog>
  );
};
