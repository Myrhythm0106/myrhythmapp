
import React from "react";
import { format } from "date-fns";
import { HeartHandshake, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GratitudeEntry } from "../GratitudePrompt";

interface GratitudeEntryCardProps {
  entry: GratitudeEntry;
  onSelectEntry: (entry: GratitudeEntry) => void;
  onShareEntry: (entry: GratitudeEntry) => void;
}

export function GratitudeEntryCard({ 
  entry, 
  onSelectEntry, 
  onShareEntry 
}: GratitudeEntryCardProps) {
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
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <HeartHandshake className="h-5 w-5 text-primary" />
            <Badge variant="outline">{getPromptTypeLabel(entry.promptType)}</Badge>
            {entry.activity && (
              <Badge variant="secondary">{entry.activity}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span title={`Mood: ${entry.moodScore}/5`} className="text-xl">
              {getMoodEmoji(entry.moodScore)}
            </span>
            <span className="text-sm text-muted-foreground">
              {format(new Date(entry.date), "MMM d, yyyy")}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-base">{entry.gratitudeText}</p>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {entry.tags.map(tag => (
            <Badge key={tag} variant="outline" className="bg-primary/5">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground"
            onClick={() => onSelectEntry(entry)}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            View details
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={entry.isShared ? "text-primary" : "text-muted-foreground"}
            onClick={() => onShareEntry(entry)}
          >
            <Share2 className="h-4 w-4 mr-1" />
            {entry.isShared ? "Shared" : "Private"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
