
import React, { useState, useRef, useEffect } from "react";
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
import { HeartHandshake, Share2, Trash2, Save, Brain, Sparkles, ArrowDown, CheckCircle } from "lucide-react";
import { GratitudeEntry } from "../GratitudePrompt";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
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
  const [showScrollHint, setShowScrollHint] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const whyFieldRef = useRef<HTMLTextAreaElement>(null);
  
  // For new entries
  const [gratitudeText, setGratitudeText] = useState("");
  const [whyGrateful, setWhyGrateful] = useState("");
  const [promptType, setPromptType] = useState<"fitness" | "mindfulness" | "social" | "general">("general");
  const [moodScore, setMoodScore] = useState(3);

  // Progress calculation for new entries
  const getProgress = () => {
    if (!isNewEntry) return 100;
    let progress = 0;
    if (gratitudeText.trim()) progress += 40;
    if (whyGrateful.trim()) progress += 40;
    if (moodScore !== 3) progress += 20;
    return Math.min(progress, 100);
  };

  const currentProgress = getProgress();
  const isComplete = gratitudeText.trim() && whyGrateful.trim();

  useEffect(() => {
    if (!isNewEntry) return;
    
    const checkScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        setShowScrollHint(scrollHeight > clientHeight && scrollTop < scrollHeight - clientHeight - 50);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll(); // Initial check
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [isNewEntry]);

  const scrollToWhy = () => {
    if (whyFieldRef.current) {
      whyFieldRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      whyFieldRef.current.focus();
    }
  };

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

    if (!whyGrateful.trim()) {
      toast({
        title: "Please explain WHY you're grateful",
        description: "The 'why' is crucial for brain health benefits!",
        variant: "destructive",
      });
      scrollToWhy();
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
      title: "Brain Health Gratitude Saved! 🧠✨",
      description: "Your reflection strengthens neural pathways and builds resilience.",
    });
    
    if (onClose) {
      onClose();
    }
  };

  // Simple tag extraction from text
  const extractTags = (text: string): string[] => {
    const commonWords = ["for", "the", "and", "that", "with", "this", "from", "have", "was", "feel", "felt"];
    const matches = text.toLowerCase().match(/\b(\w+)\b/g);
    
    if (!matches) {
      return [];
    }
    
    const potentialTags = matches.filter(word => 
      word.length > 3 && !commonWords.includes(word)
    );
    
    return [...new Set(potentialTags)].slice(0, 5);
  };

  // Render different content based on whether we're viewing or creating
  if (isNewEntry) {
    return (
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Add Brain Health Gratitude
            <Sparkles className="h-4 w-4 text-amber-400" />
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Remember: The "WHY" is where the real brain health magic happens!
          </p>
          
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completion Progress</span>
              <span className="font-medium">{Math.round(currentProgress)}%</span>
            </div>
            <Progress value={currentProgress} className="h-2" />
          </div>
        </DialogHeader>
        
        <div 
          ref={containerRef}
          className="space-y-4 py-4 flex-1 overflow-y-auto relative"
          style={{ maxHeight: 'calc(90vh - 200px)' }}
        >
          {/* Scroll hint */}
          {showScrollHint && (
            <div className="absolute top-0 right-4 z-10 animate-bounce">
              <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <ArrowDown className="h-3 w-3" />
                Scroll down
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Gratitude Context</label>
            <Select
              value={promptType}
              onValueChange={(value: "fitness" | "mindfulness" | "social" | "general") => setPromptType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gratitude type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Gratitude</SelectItem>
                <SelectItem value="fitness">After Exercise</SelectItem>
                <SelectItem value="mindfulness">Quiet Moments</SelectItem>
                <SelectItem value="social">With Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-rose-500" />
                What are you grateful for? 💖
              </label>
              {gratitudeText.trim() && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
            <Textarea
              placeholder="I'm grateful for..."
              value={gratitudeText}
              onChange={(e) => setGratitudeText(e.target.value)}
              className="min-h-[80px]"
            />
            {gratitudeText.trim() && !whyGrateful.trim() && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={scrollToWhy}
                className="w-full mt-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <ArrowDown className="h-4 w-4 mr-2" />
                Continue to "WHY" section below ⬇️
              </Button>
            )}
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-blue-500" />
              <label className="text-sm font-medium text-blue-800">
                🧠 WHY are you grateful for this? (Brain Health Boost!)
              </label>
              <Sparkles className="h-4 w-4 text-purple-500" />
              {whyGrateful.trim() && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
            <p className="text-xs text-blue-600 mb-3">
              This deeper reflection actively engages your brain's thinking patterns, 
              strengthening neural connections and emotional processing.
            </p>
            <Textarea
              ref={whyFieldRef}
              placeholder="This matters to me because... / I feel grateful because... / This impacts my life by... / This helps me grow by..."
              value={whyGrateful}
              onChange={(e) => setWhyGrateful(e.target.value)}
              className="min-h-[100px] border-blue-300 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">How does this make you feel? (1-5)</label>
              {moodScore !== 3 && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
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
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Less positive</span>
              <span>More positive</span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSaveNew} 
            disabled={!isComplete}
            className={`${isComplete 
              ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600" 
              : "bg-muted"
            }`}
          >
            <Brain className="h-4 w-4 mr-1" />
            {isComplete ? "Save Brain Health Gratitude" : `Complete fields (${Math.round(currentProgress)}%)`}
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
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-rose-500" />
                What I'm grateful for:
              </h3>
              <div className="bg-muted/20 p-3 rounded-md">
                {selectedEntry.gratitudeText}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-500" />
                Why I'm grateful (Brain Health):
              </h3>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-md border border-blue-200">
                {selectedEntry.whyGrateful || "No deeper reflection provided"}
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
