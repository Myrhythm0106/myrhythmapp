
import React from "react";
import { SearchButton } from "./components/SearchButton";
import { SearchDialog } from "./components/SearchDialog";
import { useSearch } from "./hooks/useSearch";

export function GlobalSearch() {
  const {
    open,
    setOpen,
    searchQuery,
    searchResults,
    handleSearch,
    handleSelect,
    toggleSearch
  } = useSearch();

  return (
    <>
      <SearchButton onClick={toggleSearch} />
      <SearchDialog
        open={open}
        onOpenChange={setOpen}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        searchResults={searchResults}
        onSelect={handleSelect}
      />
    </>
  );
}
