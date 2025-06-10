
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { getPromptTypeColor, getPromptTypeIcon } from "../utils/promptTypeUtils";

interface EntryMetadataProps {
  promptType: string;
  date: string;
}

export function EntryMetadata({ promptType, date }: EntryMetadataProps) {
  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">{getPromptTypeIcon(promptType)}</span>
        <Badge 
          variant="secondary" 
          className={getPromptTypeColor(promptType)}
        >
          {promptType}
        </Badge>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Calendar className="h-3 w-3" />
        {new Date(date).toLocaleDateString()}
      </div>
    </div>
  );
}
