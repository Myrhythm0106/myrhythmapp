
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Sparkles, Lightbulb, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MoodOption, moodOptions } from "@/components/dashboard/daily-checkin/MoodTypes";

interface WelcomeCardProps {
  name?: string;
  userType?: "brain-injury-recovery" | "cognitive-optimization" | "caregiver-support" | "wellness-productivity" | "new";
}

// Weekly inspiration based on mood and user type - empowering by default
const weeklyInspirations = {
  great: [
    "Unstoppable",
    "Thriving", 
    "Empowered",
    "Radiant",
    "Flourishing",
    "Magnificent",
    "Victorious"
  ],
  okay: [
    "Growing",
    "Capable",
    "Resilient",
    "Determined",
    "Progressing",
    "Strengthening",
    "Evolving"
  ],
  struggling: [
    "Brave",
    "Powerful",
    "Courageous",
    "Worthy",
    "Strong",
    "Enduring",
    "Unbreakable"
  ]
};

export function WelcomeCard({ name = "there", userType = "brain-injury-recovery" }: WelcomeCardProps) {
  const navigate = useNavigate();
  const [customWord, setCustomWord] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [weeklyWord, setWeeklyWord] = useState(() => {
    // Get a random empowering word for the current mood trend
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
      case "brain-injury-recovery":
        return "Track your empowering progress and discover resources to fuel your thriving journey.";
      case "cognitive-optimization":
        return "Unlock your cognitive potential and discover the amazing capabilities within you.";
      case "caregiver-support":
        return "Find strength for yourself while empowering your loved one, with resources to help you both flourish.";
      case "wellness-productivity":
        return "Build empowering habits and create the structure that supports your wellness and achievement goals.";
      default:
        return "Welcome to MyRhythm. Get started by customizing your profile and exploring your potential.";
    }
  };

  const handleCustomWordSave = () => {
    if (customWord.trim()) {
      setWeeklyWord(customWord.trim());
      setIsEditing(false);
      setCustomWord("");
      toast.success("Your empowering word has been saved!");
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
    toast.success("New empowering word generated!");
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-r from-beacon-600 to-beacon-800 p-6 text-white">
        <div className="absolute -right-8 -top-8 opacity-10">
          <Brain size={180} />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            {greetingTime()}, {name}
            <Star className="h-5 w-5 text-yellow-300" />
          </h2>
          <p className="mt-2 max-w-xl">{getMessage()}</p>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 bg-gradient-to-r from-amber-100 to-rose-100 rounded-xl p-4 shadow-sm transition-transform hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h3 className="text-sm font-medium text-gray-700">#IChoose this week to be</h3>
            </div>
            
            {!isEditing ? (
              <div className="space-y-2">
                <p className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
                  {weeklyWord}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                    size="sm"
                    className="text-xs py-0 h-7"
                  >
                    Customize
                  </Button>
                  <Button 
                    onClick={handleNewWordGenerate}
                    size="sm"
                    className="text-xs py-0 h-7 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    New Empowering Word
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter your empowering word..."
                  value={customWord}
                  onChange={(e) => setCustomWord(e.target.value)}
                  className="text-center text-lg border-amber-200 focus-visible:ring-amber-400"
                />
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    size="sm"
                    className="text-xs py-0 h-7"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCustomWordSave}
                    size="sm"
                    className="text-xs py-0 h-7 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600"
                  >
                    Save My Empowering Word
                  </Button>
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              {userType === "brain-injury-recovery" 
                ? "Your weekly word is chosen to empower your wellness journey and celebrate your incredible strength."
                : "Your weekly word is chosen based on your patterns to inspire and empower your growth."
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
