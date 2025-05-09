
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Smile, Meh, Frown } from "lucide-react";

interface MoodOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export function DailyCheckin() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const moodOptions: MoodOption[] = [
    {
      value: "great",
      label: "Great",
      icon: <Smile className="h-6 w-6" />,
      color: "text-green-500"
    },
    {
      value: "okay",
      label: "Okay",
      icon: <Meh className="h-6 w-6" />,
      color: "text-amber-500"
    },
    {
      value: "struggling",
      label: "Struggling",
      icon: <Frown className="h-6 w-6" />,
      color: "text-red-500"
    }
  ];

  const handleSubmit = () => {
    if (!selectedMood) {
      toast.error("Please select how you're feeling today");
      return;
    }

    // In a real app, we would send this to an API
    console.log("Mood submitted:", selectedMood);
    toast.success("Your check-in has been recorded!");
    setSubmitted(true);
    
    // Reset after a while to allow for another check-in later
    setTimeout(() => {
      setSubmitted(false);
    }, 3600000); // Reset after 1 hour
  };

  return (
    <Card className="bg-card shadow-sm hover:shadow transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Daily Check-in</CardTitle>
      </CardHeader>
      <CardContent>
        {!submitted ? (
          <>
            <p className="mb-4 text-sm">How are you feeling today?</p>
            <RadioGroup className="gap-3" value={selectedMood || ""} onValueChange={setSelectedMood}>
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
        ) : (
          <div className="text-center py-2">
            <p className="font-medium text-green-600 mb-1">Check-in Recorded!</p>
            <p className="text-sm text-muted-foreground">
              Thank you for sharing how you're feeling today.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
