
import React from "react";
import { format } from "date-fns";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GratitudeEntry } from "../GratitudePrompt";
import { Calendar, Heart, Share2, Trash } from "lucide-react";

interface EntryDetailsDialogProps {
  selectedEntry: GratitudeEntry | null;
  onShareEntry: (entry: GratitudeEntry) => void;
  onDeleteEntry: (id: string) => void;
  onClose: () => void;
}

export function EntryDetailsDialog({
  selectedEntry,
  onShareEntry,
  onDeleteEntry,
  onClose
}: EntryDetailsDialogProps) {
  if (!selectedEntry) return null;
  
  const formattedDate = format(new Date(selectedEntry.date), "MMMM d, yyyy 'at' h:mm a");
  
  const getMoodLabel = (score: number) => {
    switch (score) {
      case 1: return "Not so good 😔";
      case 2: return "Okay 😐";
      case 3: return "Good 🙂";
      case 4: return "Great 😊";
      case 5: return "Amazing 😄";
      default: return "Good 🙂";
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-xl">Gratitude Reflection</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{formattedDate}</span>
          </div>
          <Badge variant="outline">{selectedEntry.promptType}</Badge>
        </div>
        
        <div>
          <h3 className="font-medium mb-1">What I'm grateful for:</h3>
          <p className="text-base bg-muted/20 p-2 rounded-md">{selectedEntry.gratitudeText}</p>
        </div>
        
        {/* Display the WHY field if available */}
        {selectedEntry.whyGrateful && (
          <div>
            <h3 className="font-medium mb-1">Why I'm grateful:</h3>
            <p className="text-base bg-muted/20 p-2 rounded-md">{selectedEntry.whyGrateful}</p>
          </div>
        )}
        
        <div>
          <h3 className="font-medium mb-1">How it made me feel:</h3>
          <div className="flex items-center gap-2">
            <Heart className={`h-5 w-5 ${selectedEntry.moodScore >= 4 ? "text-red-500" : "text-muted-foreground"}`} />
            <span>{getMoodLabel(selectedEntry.moodScore)}</span>
          </div>
        </div>
        
        {selectedEntry.tags?.length > 0 && (
          <div>
            <h3 className="font-medium mb-1">Tags:</h3>
            <div className="flex flex-wrap gap-1">
              {selectedEntry.tags.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between mt-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={() => {
            onDeleteEntry(selectedEntry.id);
            onClose();
          }}
        >
          <Trash className="h-4 w-4 mr-1" />
          Delete
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShareEntry(selectedEntry)}
          >
            <Share2 className="h-4 w-4 mr-1" />
            {selectedEntry.isShared ? "Unshare" : "Share"}
          </Button>
          
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
