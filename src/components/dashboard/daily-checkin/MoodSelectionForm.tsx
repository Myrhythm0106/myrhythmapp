
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { moodOptions } from "./MoodTypes";
import { Smile, Meh, Frown } from "lucide-react";

interface MoodSelectionFormProps {
  onSubmit: (mood: string, comment: string) => void;
  isLoading: boolean;
}

export function MoodSelectionForm({ onSubmit, isLoading }: MoodSelectionFormProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (selectedMood) {
      onSubmit(selectedMood, comment);
    }
  };

  // Map mood values to icons
  const getMoodIcon = (value: string) => {
    switch (value) {
      case "great":
        return <Smile className="h-6 w-6" />;
      case "okay":
        return <Meh className="h-6 w-6" />;
      case "struggling":
        return <Frown className="h-6 w-6" />;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Smile className="h-5 w-5 text-primary" />
          How are you feeling today?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {moodOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedMood === option.value ? "default" : "outline"}
              className={`flex-1 min-w-[100px] flex flex-col items-center gap-2 p-4 ${
                selectedMood === option.value ? "" : "hover:border-muted-foreground/50"
              }`}
              onClick={() => setSelectedMood(option.value)}
            >
              <div className={`rounded-full p-2 ${option.color}`}>
                {getMoodIcon(option.value)}
              </div>
              <span>{option.label}</span>
            </Button>
          ))}
        </div>
        
        {selectedMood && (
          <div className="space-y-2 animate-fade-in">
            <p className="text-sm text-muted-foreground">
              Would you like to add any notes about how you're feeling?
            </p>
            <Textarea
              placeholder="Optional: Share more about how you're feeling today..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end pt-2">
              <Button 
                onClick={handleSubmit} 
                disabled={!selectedMood || isLoading}
              >
                {isLoading ? "Saving..." : "Save Check-in"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
