
import React from "react";
import { CommandItem } from "@/components/ui/command";
import { SearchResult } from "../types/searchTypes";

interface SearchResultItemProps {
  item: SearchResult;
  onSelect: (result: SearchResult) => void;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({ 
  item, 
  onSelect 
}) => {
  return (
    <CommandItem 
      key={item.id} 
      onSelect={() => onSelect(item)}
      className="flex items-center cursor-pointer"
    >
      {item.icon}
      <div>
        <div>{item.title}</div>
        <p className="text-xs text-muted-foreground">{item.description}</p>
      </div>
    </CommandItem>
  );
};
