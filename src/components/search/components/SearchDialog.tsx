
import React from "react";
import { Command, CommandInput, CommandList, CommandEmpty } from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchResult } from "../types/searchTypes";
import { SearchResultGroup } from "./SearchResultGroup";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  onSearch: (value: string) => void;
  searchResults: Record<string, SearchResult[]>;
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
  const isMobile = useIsMobile();
  
  const renderSearchContent = () => (
    <Command className="rounded-lg border-none shadow-md">
      <CommandInput
        placeholder="Type to search..."
        value={searchQuery}
        onValueChange={onSearch}
        className="h-9 md:h-11"
      />
      <CommandList className="max-h-[300px] md:max-h-[400px] overflow-y-auto">
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(searchResults).map(([category, results]) => (
          <SearchResultGroup
            key={category}
            heading={category}
            results={results}
            onSelect={onSelect}
          />
        ))}
      </CommandList>
    </Command>
  );

  // Use Drawer for mobile and Dialog for desktop
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="px-4 pt-4 pb-2">
            <DrawerTitle>Search</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
            {renderSearchContent()}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        {renderSearchContent()}
      </DialogContent>
    </Dialog>
  );
};
