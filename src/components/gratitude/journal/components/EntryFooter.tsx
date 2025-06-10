
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Eye, Edit, Share2 } from "lucide-react";
import { GratitudeEntry } from "../../GratitudePrompt";

interface EntryFooterProps {
  entry: GratitudeEntry;
  isMobile: boolean;
  onSelectEntry: (entry: GratitudeEntry) => void;
  onEdit: () => void;
  onShare: () => void;
}

export function EntryFooter({ 
  entry, 
  isMobile, 
  onSelectEntry, 
  onEdit, 
  onShare 
}: EntryFooterProps) {
  return (
    <div className="flex items-center justify-between mt-4 pt-3 border-t">
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {entry.moodScore && (
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>Mood: {entry.moodScore}/5</span>
          </div>
        )}
        {entry.activity && (
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{entry.activity}</span>
          </div>
        )}
      </div>
      
      {!isMobile && (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEntry(entry);
            }}
            className="h-7 w-7 p-0"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="h-7 w-7 p-0"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
            className="h-7 w-7 p-0"
          >
            <Share2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
