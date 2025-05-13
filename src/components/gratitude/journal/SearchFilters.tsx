
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: string | null;
  setFilterType: (type: string | null) => void;
}

export function SearchFilters({ 
  searchQuery, 
  setSearchQuery, 
  filterType, 
  setFilterType 
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search your gratitude entries..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button 
          variant={!filterType ? "default" : "outline"}
          size="sm" 
          onClick={() => setFilterType(null)}
        >
          All
        </Button>
        <Button 
          variant={filterType === "fitness" ? "default" : "outline"}
          size="sm" 
          onClick={() => setFilterType("fitness")}
        >
          Fitness
        </Button>
        <Button 
          variant={filterType === "mindfulness" ? "default" : "outline"}
          size="sm" 
          onClick={() => setFilterType("mindfulness")}
        >
          Mindfulness
        </Button>
        <Button 
          variant={filterType === "social" ? "default" : "outline"}
          size="sm" 
          onClick={() => setFilterType("social")}
        >
          Social
        </Button>
      </div>
    </div>
  );
}
