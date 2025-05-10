
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MoodOption, moodOptions } from "@/components/dashboard/daily-checkin/MoodTypes";

interface WelcomeCardProps {
  name?: string;
  userType?: "tbi" | "abi" | "mental-health" | "caregiver" | "new";
}

// Weekly inspiration based on mood and user type
const weeklyInspirations = {
  great: [
    "Resilient",
    "Thriving",
    "Unstoppable",
    "Powerful",
    "Vibrant",
    "Flourishing",
    "Radiant"
  ],
  okay: [
    "Steady",
    "Balanced",
    "Present",
    "Mindful",
    "Growing",
    "Learning",
    "Adapting"
  ],
  struggling: [
    "Brave",
    "Enduring",
    "Persistent",
    "Genuine",
    "Healing",
    "Worthy",
    "Strong"
  ]
};

export function WelcomeCard({ name = "there", userType = "new" }: WelcomeCardProps) {
  const navigate = useNavigate();
  const [customWord, setCustomWord] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [weeklyWord, setWeeklyWord] = useState(() => {
    // Get a random word for the current mood trend
    // In a real app, we would determine the user's mood trend from their data
    const moodTrend: "great" | "okay" | "struggling" = "okay"; // Default to okay
    const words = weeklyInspirations[moodTrend];
    return words[Math.floor(Math.random() * words.length)];
  });
  
  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getMessage = () => {
    switch (userType) {
      case "tbi":
        return "Track your recovery progress and find resources to help with your journey.";
      case "abi":
        return "Monitor your healing journey and discover specialized support for your needs.";
      case "mental-health":
        return "Check in with your wellness today and explore tools to support your mental health.";
      case "caregiver":
        return "Find support for yourself while caring for your loved one, and access resources to help both of you.";
      default:
        return "Welcome to MyRhythm. Get started by customizing your profile and exploring resources.";
    }
  };

  const handleCustomWordSave = () => {
    if (customWord.trim()) {
      setWeeklyWord(customWord.trim());
      setIsEditing(false);
      setCustomWord("");
      toast.success("Your weekly word has been saved!");
    } else {
      toast.error("Please enter a word first");
    }
  };

  const handleNewWordGenerate = () => {
    // In a real app, we would determine the user's mood trend from their data
    const moodTrend: "great" | "okay" | "struggling" = "okay";
    const words = weeklyInspirations[moodTrend];
    const newWord = words[Math.floor(Math.random() * words.length)];
    setWeeklyWord(newWord);
    toast.success("New weekly word generated!");
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-r from-beacon-600 to-beacon-800 p-6 text-white">
        <div className="absolute -right-8 -top-8 opacity-10">
          <Brain size={180} />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold">
            {greetingTime()}, {name}
          </h2>
          <p className="mt-2 max-w-xl">{getMessage()}</p>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-3">#IChoose this week to be...</h3>
            {!isEditing ? (
              <div className="space-y-4">
                <p className="text-3xl font-bold tracking-tight bg-gradient-to-r from-beacon-600 to-beacon-800 bg-clip-text text-transparent">
                  {weeklyWord}
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                  >
                    Customize
                  </Button>
                  <Button 
                    onClick={handleNewWordGenerate}
                  >
                    Generate New Word
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter your own word..."
                  value={customWord}
                  onChange={(e) => setCustomWord(e.target.value)}
                  className="max-w-xs mx-auto text-center text-lg"
                />
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCustomWordSave}
                  >
                    Save My Word
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-center text-sm text-muted-foreground">
              Your weekly word is chosen to inspire and motivate you based on your recent mood trends.
              You can customize it or generate a new suggestion any time.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
