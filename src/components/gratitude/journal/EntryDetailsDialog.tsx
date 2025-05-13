
import React from "react";
import { format } from "date-fns";
import { Share2, Trash2 } from "lucide-react";
import { GratitudeEntry } from "../GratitudePrompt";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  
  const getPromptTypeLabel = (type: string) => {
    switch (type) {
      case "fitness": return "Fitness";
      case "mindfulness": return "Mindfulness";
      case "social": return "Social";
      default: return "General";
    }
  };
  
  const getMoodEmoji = (score: number) => {
    switch (score) {
      case 1: return "😔";
      case 2: return "😐";
      case 3: return "🙂";
      case 4: return "😊";
      case 5: return "😄";
      default: return "🙂";
    }
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Gratitude Reflection</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Date</h4>
          <p className="text-muted-foreground">
            {format(new Date(selectedEntry.date), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        <div>
          <h4 className="font-medium">Activity Type</h4>
          <p className="text-muted-foreground">{getPromptTypeLabel(selectedEntry.promptType)}</p>
        </div>
        <div>
          <h4 className="font-medium">What I'm grateful for</h4>
          <p>{selectedEntry.gratitudeText}</p>
        </div>
        <div>
          <h4 className="font-medium">How it made me feel</h4>
          <div className="flex items-center gap-2">
            <span className="text-xl">{getMoodEmoji(selectedEntry.moodScore)}</span>
            <span>Mood score: {selectedEntry.moodScore}/5</span>
          </div>
        </div>
        {selectedEntry.tags.length > 0 && (
          <div>
            <h4 className="font-medium">Themes</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedEntry.tags.map(tag => (
                <Badge key={tag} variant="outline" className="bg-primary/5">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button
          variant="ghost"
          onClick={() => onShareEntry(selectedEntry)}
        >
          <Share2 className={`h-4 w-4 mr-1 ${selectedEntry.isShared ? "text-primary" : ""}`} />
          {selectedEntry.isShared ? "Make Private" : "Share"}
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            onDeleteEntry(selectedEntry.id);
            onClose();
          }}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
