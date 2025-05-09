
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Smile, Meh, Frown, Lightbulb, Brain } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface MoodOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

// Inspirational messages array
const inspirationalMessages = [
  {
    text: "Take a deep breath and find a moment of calm today.",
    category: "mindfulness"
  },
  {
    text: "Remember to stretch for 5 minutes every hour to keep your body loose.",
    category: "physical"
  },
  {
    text: "Drink a glass of water right now - staying hydrated helps brain function!",
    category: "health"
  },
  {
    text: "One small positive thought can change your whole day.",
    category: "positivity"
  },
  {
    text: "Try focusing on one task at a time today to reduce cognitive load.",
    category: "productivity"
  },
  {
    text: "Stand up and do a quick 30-second stretch to boost your energy.",
    category: "physical"
  },
  {
    text: "Practice gratitude by noting three things you're thankful for today.",
    category: "mindfulness"
  },
  {
    text: "Every step forward is progress, no matter how small.",
    category: "positivity"
  },
  {
    text: "Consider taking a 10-minute nature walk to refresh your mind.",
    category: "health"
  },
  {
    text: "Set one achievable goal for today and celebrate when you complete it.",
    category: "productivity"
  }
];

export function DailyCheckin() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [inspiration, setInspiration] = useState(inspirationalMessages[0]);

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

  // Get a random inspiration message
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * inspirationalMessages.length);
    setInspiration(inspirationalMessages[randomIndex]);
  }, []);

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

  const getNewInspiration = () => {
    const currentIndex = inspirationalMessages.findIndex(msg => msg.text === inspiration.text);
    let newIndex = currentIndex;
    
    // Make sure we get a different message
    while (newIndex === currentIndex) {
      newIndex = Math.floor(Math.random() * inspirationalMessages.length);
    }
    
    setInspiration(inspirationalMessages[newIndex]);
    toast.success("New inspiration loaded!");
  };

  return (
    <Card className="bg-card shadow-sm hover:shadow transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Daily Check-in</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
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
          </div>

          <div className="border-l-0 md:border-l pl-0 md:pl-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h3 className="font-medium text-sm">Daily Inspiration</h3>
            </div>
            <div className="bg-primary/10 p-3 rounded-md">
              <p className="text-sm italic">{inspiration.text}</p>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
