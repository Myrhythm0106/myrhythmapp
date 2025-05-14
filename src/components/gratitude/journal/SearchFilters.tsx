
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BadgeX, Filter, Search, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: string | null;
  setFilterType: (type: string | null) => void;
  onAddNew?: () => void;
}

export function SearchFilters({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  onAddNew
}: SearchFiltersProps) {
  const clearFilters = () => {
    setSearchQuery("");
    setFilterType(null);
  };

  const hasFilters = !!searchQuery || !!filterType;

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your gratitude journal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full aspect-square rounded-l-none"
              onClick={() => setSearchQuery("")}
            >
              <BadgeX className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Select value={filterType || ""} onValueChange={(v) => setFilterType(v || null)}>
            <SelectTrigger className="w-[180px] sm:w-[140px] flex gap-1 items-center">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="fitness">Fitness</SelectItem>
              <SelectItem value="mindfulness">Mindfulness</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={onAddNew} variant="default" className="sm:w-[140px]">
            <Plus className="h-4 w-4 mr-1" />
            Add New
          </Button>
        </div>
      </div>

      {hasFilters && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filterType ? <span className="font-medium">{filterType}</span> : "all"} entries
            {searchQuery && (
              <>
                {" "}
                containing <span className="font-medium">"{searchQuery}"</span>
              </>
            )}
          </p>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
