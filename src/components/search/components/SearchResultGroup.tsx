
import React from "react";
import { CommandGroup } from "@/components/ui/command";
import { SearchResult } from "../types/searchTypes";
import { SearchResultItem } from "./SearchResultItem";

interface SearchResultGroupProps {
  heading: string;
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
}

export const SearchResultGroup: React.FC<SearchResultGroupProps> = ({ 
  heading, 
  results, 
  onSelect 
}) => {
  if (results.length === 0) return null;
  
  return (
    <CommandGroup heading={heading}>
      {results.map(item => (
        <SearchResultItem 
          key={item.id}
          item={item} 
          onSelect={onSelect} 
        />
      ))}
    </CommandGroup>
  );
};
