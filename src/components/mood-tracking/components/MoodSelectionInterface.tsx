
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Smile } from "lucide-react";
import { toast } from "sonner";

interface MoodOption {
  value: "very-negative" | "negative" | "neutral" | "positive" | "very-positive";
  label: string;
  color: string;
  description: string;
  numericValue: number;
}

interface MoodSelectionInterfaceProps {
  onSubmit: (mood: string, note: string) => void;
  isLoading: boolean;
}

const moodOptions: MoodOption[] = [
  {
    value: "very-negative",
    label: "Very Down",
    color: "bg-red-600 hover:bg-red-700",
    description: "Feeling very low or distressed",
    numericValue: 1
  },
  {
    value: "negative", 
    label: "Down",
    color: "bg-red-400 hover:bg-red-500",
    description: "Feeling somewhat low or upset",
    numericValue: 2
  },
  {
    value: "neutral",
    label: "Neutral",
    color: "bg-gray-400 hover:bg-gray-500", 
    description: "Feeling balanced, neither good nor bad",
    numericValue: 3
  },
  {
    value: "positive",
    label: "Good",
    color: "bg-green-400 hover:bg-green-500",
    description: "Feeling positive and upbeat",
    numericValue: 4
  },
  {
    value: "very-positive",
    label: "Great",
    color: "bg-green-600 hover:bg-green-700",
    description: "Feeling excellent and very positive",
    numericValue: 5
  }
];

export function MoodSelectionInterface({ onSubmit, isLoading }: MoodSelectionInterfaceProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    if (!selectedMood) {
      toast.error("Please select a mood level");
      return;
    }

    onSubmit(selectedMood, note);
    setSelectedMood(null);
    setNote("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Smile className="h-5 w-5 text-primary" />
          How are you feeling right now?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Selection Circles */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Select your mood level:</h3>
          <div className="flex justify-between gap-2 p-4 bg-muted/30 rounded-lg">
            {moodOptions.map((mood) => (
              <div key={mood.value} className="flex flex-col items-center gap-2">
                <button
                  onClick={() => setSelectedMood(mood.value)}
                  className={`
                    w-12 h-12 rounded-full border-2 transition-all duration-200 
                    ${selectedMood === mood.value 
                      ? `${mood.color} border-white shadow-lg scale-110` 
                      : `${mood.color} border-transparent opacity-70 hover:opacity-100 hover:scale-105`
                    }
                  `}
                  title={mood.description}
                />
                <span className="text-xs font-medium text-center leading-tight">
                  {mood.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Optional Notes */}
        <div className="space-y-2">
          <label htmlFor="mood-notes" className="text-sm font-medium">
            Add Notes (Optional)
          </label>
          <Textarea
            id="mood-notes"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add any context about your mood... (e.g., 'Slept poorly', 'Had a good conversation')"
            className="min-h-[80px]"
          />
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          disabled={!selectedMood || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? "Saving..." : "Log Feeling"}
        </Button>
      </CardContent>
    </Card>
  );
}
