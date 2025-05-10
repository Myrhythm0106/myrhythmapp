
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageFilter } from "./types/messageTypes";

interface MessageFilterProps {
  filter: MessageFilter;
  onFilterChange: (filter: MessageFilter) => void;
}

export function MessageFilterTabs({ filter, onFilterChange }: MessageFilterProps) {
  return (
    <Tabs value={filter} onValueChange={(v) => onFilterChange(v as MessageFilter)} className="mb-4">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="encouragement">Encouragement</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
