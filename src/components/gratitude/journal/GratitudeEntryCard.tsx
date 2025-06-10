
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SwipeableContainer } from "@/components/ui/SwipeableContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import { GratitudeEntry } from "../GratitudePrompt";
import { Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EntryMetadata } from "./components/EntryMetadata";
import { EntryContent } from "./components/EntryContent";
import { EntryFooter } from "./components/EntryFooter";
import { SwipeHint } from "./components/SwipeHint";

interface GratitudeEntryCardProps {
  entry: GratitudeEntry;
  onSelectEntry: (entry: GratitudeEntry) => void;
  onShareEntry: (entry: GratitudeEntry) => void;
  onDeleteEntry?: (entry: GratitudeEntry) => void;
  onEditEntry?: (entry: GratitudeEntry) => void;
}

export function GratitudeEntryCard({ 
  entry, 
  onSelectEntry, 
  onShareEntry,
  onDeleteEntry,
  onEditEntry
}: GratitudeEntryCardProps) {
  const isMobile = useIsMobile();

  const handleDelete = () => {
    if (onDeleteEntry) {
      onDeleteEntry(entry);
      toast.success("Gratitude entry deleted", { duration: 2000 });
    }
  };

  const handleEdit = () => {
    if (onEditEntry) {
      onEditEntry(entry);
    } else {
      onSelectEntry(entry);
    }
  };

  const handleShare = () => {
    onShareEntry(entry);
    toast.success("Sharing options opened", { duration: 2000 });
  };

  // Convert date to string format for EntryMetadata
  const dateString = entry.date instanceof Date ? entry.date.toISOString() : entry.date;

  return (
    <SwipeableContainer
      enableHorizontalSwipe={isMobile}
      onSwipeLeft={{
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        color: "#ef4444",
        action: handleDelete
      }}
      onSwipeRight={{
        label: "Share",
        icon: <Share2 className="h-4 w-4" />,
        color: "#22c55e", 
        action: handleShare
      }}
      className="w-full"
    >
      <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
        <CardContent className="p-4">
          <EntryMetadata 
            promptType={entry.promptType}
            date={dateString}
          />
          
          <EntryContent 
            entry={entry}
            onSelectEntry={onSelectEntry}
          />
          
          <EntryFooter
            entry={entry}
            isMobile={isMobile}
            onSelectEntry={onSelectEntry}
            onEdit={handleEdit}
            onShare={handleShare}
          />
        </CardContent>
      </Card>

      <SwipeHint isMobile={isMobile} />
    </SwipeableContainer>
  );
}
