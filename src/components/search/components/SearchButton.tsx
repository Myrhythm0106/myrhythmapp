
import React from "react";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface SearchButtonProps {
  onClick: () => void;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ onClick }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onClick}
            className="h-9 w-9 md:h-10 md:w-10"
            aria-label="Search"
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Search (Ctrl+K)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
