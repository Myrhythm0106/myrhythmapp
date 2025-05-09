
import React from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb, Brain } from "lucide-react";
import { InspirationalMessage } from "@/data/inspirationalMessages";

interface InspirationSectionProps {
  selectedMood: string | null;
  inspiration: InspirationalMessage;
  getNewInspiration: () => void;
}

export function InspirationSection({ selectedMood, inspiration, getNewInspiration }: InspirationSectionProps) {
  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        <h3 className="font-medium text-sm">
          {selectedMood 
            ? `Daily Inspiration for ${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Days` 
            : "Daily Inspiration"}
        </h3>
      </div>
      <div className="bg-primary/10 p-3 rounded-md">
        <p className="text-sm italic">{inspiration.text}</p>
        <p className="text-xs mt-2 text-muted-foreground">
          {inspiration.type && `Focus: ${inspiration.type.charAt(0).toUpperCase() + inspiration.type.slice(1)}`}
        </p>
      </div>
      <div className="flex justify-end mt-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={getNewInspiration}
          className="text-xs flex items-center gap-1"
        >
          <Brain className="h-3 w-3" />
          New Tip
        </Button>
      </div>
    </>
  );
}
