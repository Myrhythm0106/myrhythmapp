
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HeartHandshake, Star, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useUserData } from "@/hooks/use-user-data";

interface GratitudePromptProps {
  promptType: "fitness" | "mindfulness" | "social" | "general";
  activity?: string;
  onSave: (entry: GratitudeEntry) => void;
  onClose?: () => void;
}

export interface GratitudeEntry {
  id: string;
  date: Date;
  promptType: string;
  activity?: string;
  gratitudeText: string;
  whyGrateful: string; // Added field for why user is grateful
  moodScore: number;
  isShared: boolean;
  tags: string[];
}

export function GratitudePrompt({ promptType, activity, onSave, onClose }: GratitudePromptProps) {
  const [gratitudeText, setGratitudeText] = useState("");
  const [whyGrateful, setWhyGrateful] = useState(""); // Added state for why field
  const [moodScore, setMoodScore] = useState(3);
  const [isSharing, setIsSharing] = useState(false);
  const userData = useUserData();

  const getPromptText = () => {
    switch (promptType) {
      case "fitness":
        return `What are you grateful for related to ${activity || "this activity"}?`;
      case "mindfulness":
        return "What are you grateful for in this moment?";
      case "social":
        return "Who or what are you grateful for from your recent interaction?";
      default:
        return "What are you grateful for today?";
    }
  };

  const getPlaceholderText = () => {
    switch (promptType) {
      case "fitness":
        return "e.g., energy gained, the weather, feeling accomplished...";
      case "mindfulness":
        return "e.g., peace, clarity, a calm space...";
      case "social":
        return "e.g., support from a friend, an insightful conversation...";
      default:
        return "Share what you're grateful for...";
    }
  };

  const handleSave = () => {
    if (!gratitudeText.trim()) {
      toast.error("Please share what you're grateful for before saving.");
      return;
    }

    const entry: GratitudeEntry = {
      id: crypto.randomUUID(),
      date: new Date(),
      promptType,
      activity,
      gratitudeText,
      whyGrateful, // Include the why field in the saved entry
      moodScore,
      isShared: isSharing,
      tags: extractTags(gratitudeText),
    };

    onSave(entry);
    toast.success("Gratitude recorded!");
    
    if (onClose) {
      onClose();
    }
  };

  // Simple tag extraction from text - Fixed TypeScript error
  const extractTags = (text: string): string[] => {
    const commonWords = ["for", "the", "and", "that", "with", "this", "from", "have", "was", "feel", "felt"];
    const matches = text.toLowerCase().match(/\b(\w+)\b/g);
    const words = matches || []; // Handle null case properly
    const potentialTags = words.filter(word => 
      word.length > 3 && !commonWords.includes(word)
    );
    
    // Return unique words that might be tags
    return [...new Set(potentialTags)].slice(0, 5);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <HeartHandshake className="h-5 w-5 text-primary" />
          Gratitude Reflection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-medium text-lg">{getPromptText()}</p>

        <Textarea
          placeholder={getPlaceholderText()}
          value={gratitudeText}
          onChange={e => setGratitudeText(e.target.value)}
          className="min-h-[100px] text-base"
        />
        
        {/* Add the WHY field */}
        <div>
          <p className="font-medium text-lg mb-2">Why are you grateful for this?</p>
          <Textarea
            placeholder="Explain why this matters to you..."
            value={whyGrateful}
            onChange={e => setWhyGrateful(e.target.value)}
            className="min-h-[100px] text-base"
          />
        </div>

        <div className="space-y-2">
          <p className="font-medium">How does this make you feel?</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Less positive</span>
            <div className="flex gap-2">
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
            <span className="text-sm text-muted-foreground">More positive</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setIsSharing(!isSharing)}
          >
            <Share2 className={`h-4 w-4 mr-1 ${isSharing ? "text-primary" : ""}`} />
            {isSharing ? "Will be shared" : "Private (only you can see)"}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Skip for now
          </Button>
        )}
        <Button onClick={handleSave} disabled={!gratitudeText.trim()}>
          Save Gratitude
        </Button>
      </CardFooter>
    </Card>
  );
}
