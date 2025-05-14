
import React, { useState } from "react";
import { format } from "date-fns";
import { 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useGratitude } from "@/hooks/use-gratitude";
import { HeartHandshake, Share2, Trash2, Save } from "lucide-react";
import { GratitudeEntry } from "../GratitudePrompt";
import { toast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EntryDetailsDialogProps {
  selectedEntry?: GratitudeEntry | null;
  isNewEntry?: boolean;
  onShareEntry?: (entry: GratitudeEntry) => void;
  onDeleteEntry?: (id: string) => void;
  onClose?: () => void;
}

export function EntryDetailsDialog({
  selectedEntry,
  isNewEntry = false,
  onShareEntry,
  onDeleteEntry,
  onClose
}: EntryDetailsDialogProps) {
  const { addEntry } = useGratitude();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // For new entries
  const [gratitudeText, setGratitudeText] = useState("");
  const [whyGrateful, setWhyGrateful] = useState("");
  const [promptType, setPromptType] = useState<"fitness" | "mindfulness" | "social" | "general">("general");
  const [moodScore, setMoodScore] = useState(3);

  // Format the date if we have a selected entry
  const formattedDate = selectedEntry 
    ? format(new Date(selectedEntry.date), "MMM d, yyyy 'at' h:mm a") 
    : "";

  // Function to handle saving a new entry
  const handleSaveNew = () => {
    if (!gratitudeText.trim()) {
      toast({
        title: "Please enter what you're grateful for",
        variant: "destructive",
      });
      return;
    }

    const newEntry = {
      promptType,
      gratitudeText,
      whyGrateful,
      moodScore,
      isShared: false,
      tags: extractTags(gratitudeText),
    };

    addEntry(newEntry);
    toast({
      title: "New gratitude entry saved!",
      description: "Your gratitude has been recorded successfully.",
    });
    
    if (onClose) {
      onClose();
    }
  };

  // Simple tag extraction from text
  const extractTags = (text: string): string[] => {
    const commonWords = ["for", "the", "and", "that", "with", "this", "from", "have", "was", "feel", "felt"];
    const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
    const potentialTags = words.filter(word => 
      word.length > 3 && !commonWords.includes(word)
    );
    
    // Return unique words that might be tags
    return [...new Set(potentialTags)].slice(0, 5);
  };

  // Render different content based on whether we're viewing or creating
  if (isNewEntry) {
    return (
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-primary" />
            Add New Gratitude Entry
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Gratitude Type</label>
            <Select
              value={promptType}
              onValueChange={(value: "fitness" | "mindfulness" | "social" | "general") => setPromptType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gratitude type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="mindfulness">Mindfulness</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">What are you grateful for?</label>
            <Textarea
              placeholder="I'm grateful for..."
              value={gratitudeText}
              onChange={(e) => setGratitudeText(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Why are you grateful for this?</label>
            <Textarea
              placeholder="Because..."
              value={whyGrateful}
              onChange={(e) => setWhyGrateful(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">How does this make you feel? (1-5)</label>
            <div className="flex gap-2 justify-between">
              {[1, 2, 3, 4, 5].map((score) => (
                <Button
                  key={score}
                  type="button"
                  size="sm"
                  variant={moodScore === score ? "default" : "outline"}
                  className={`rounded-full w-10 h-10 p-0 ${moodScore === score ? "bg-primary" : ""}`}
                  onClick={() => setMoodScore(score)}
                >
                  {score}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveNew} disabled={!gratitudeText.trim()}>
            <Save className="h-4 w-4 mr-1" />
            Save Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    );
  }

  // Viewing an existing entry
  return (
    <>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-primary" />
            Gratitude Details
          </DialogTitle>
        </DialogHeader>
        
        {selectedEntry && (
          <div className="space-y-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {selectedEntry.promptType}
              </Badge>
              <span className="text-sm text-muted-foreground">{formattedDate}</span>
              <div className="grow"></div>
              <div className="text-xl" title={`Mood: ${selectedEntry.moodScore}/5`}>
                {['😔', '😐', '🙂', '😊', '😄'][selectedEntry.moodScore - 1]}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">What I'm grateful for:</h3>
              <div className="bg-muted/20 p-3 rounded-md">
                {selectedEntry.gratitudeText}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Why I'm grateful:</h3>
              <div className="bg-muted/20 p-3 rounded-md">
                {selectedEntry.whyGrateful || "No reason provided"}
              </div>
            </div>
            
            {selectedEntry.tags && selectedEntry.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-1">
                  {selectedEntry.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter className="flex gap-2 sm:justify-between">
          <div>
            {onDeleteEntry && selectedEntry && (
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {onShareEntry && selectedEntry && (
              <Button
                variant="outline"
                onClick={() => onShareEntry(selectedEntry)}
              >
                <Share2 className={`h-4 w-4 mr-1 ${selectedEntry.isShared ? "text-primary" : ""}`} />
                {selectedEntry.isShared ? "Shared" : "Share"}
              </Button>
            )}
            
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this gratitude entry.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (onDeleteEntry && selectedEntry) {
                  onDeleteEntry(selectedEntry.id);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
