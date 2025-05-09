
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { moodOptions } from "./MoodTypes";

interface MoodSelectionFormProps {
  selectedMood: string | null;
  setSelectedMood: (mood: string) => void;
  handleSubmit: () => void;
}

export function MoodSelectionForm({ selectedMood, setSelectedMood, handleSubmit }: MoodSelectionFormProps) {
  return (
    <>
      <p className="mb-4 text-sm">How are you feeling today?</p>
      <RadioGroup 
        className="gap-3" 
        value={selectedMood || ""} 
        onValueChange={setSelectedMood}
      >
        {moodOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label
              htmlFor={option.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className={option.color}>{option.icon}</span>
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      <Button 
        onClick={handleSubmit} 
        className="w-full mt-4 bg-primary hover:bg-primary/90"
      >
        Submit Check-in
      </Button>
    </>
  );
}
