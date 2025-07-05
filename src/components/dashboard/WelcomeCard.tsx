
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Sparkles, Lightbulb, Star, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
        return "Using Memory1st principles, track your MYRHYTHM progress and build your LEAP life - empowered, authentic, and productive.";
      case "cognitive-optimization":
        return "Discover your MYRHYTHM and unlock your cognitive potential through Memory1st approaches designed for your LEAP success.";
      case "caregiver-support":
        return "Find your MYRHYTHM as a caregiver using Memory1st self-care principles. Your LEAP journey supports both you and your loved one.";
      case "wellness-productivity":
        return "Build empowering MYRHYTHM habits using Memory1st structure that supports your LEAP goals - authentic wellness and meaningful productivity.";
      default:
        return "Welcome to MyRhythm. Discover your Memory1st foundation, find your MYRHYTHM process, and create your LEAP life.";
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
        <div className="flex flex-col gap-4">
          {/* MyRhythm Foundation Concepts */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-green-50 rounded-lg border border-green-200">
              <Brain className="h-4 w-4 mx-auto mb-1 text-green-600" />
              <p className="text-xs font-medium text-green-800">Memory1st</p>
              <p className="text-xs text-green-600">Brain Health</p>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
              <Heart className="h-4 w-4 mx-auto mb-1 text-blue-600" />
              <p className="text-xs font-medium text-blue-800">MYRHYTHM</p>
              <p className="text-xs text-blue-600">Your Process</p>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded-lg border border-purple-200">
              <Zap className="h-4 w-4 mx-auto mb-1 text-purple-600" />
              <p className="text-xs font-medium text-purple-800">LEAP</p>
              <p className="text-xs text-purple-600">Your Outcome</p>
            </div>
          </div>

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
              Your MYRHYTHM journey: Memory1st foundation, personal process, LEAP outcome. 
              {userType === "brain-injury-recovery" 
                ? " Every small step counts on your path to empowered, authentic, productive living."
                : " Embrace your unique rhythm and celebrate your progress toward meaningful goals."
              }
            </p>
          </div>

          {/* Journey Milestones */}
          <div className="flex justify-center gap-2 text-xs">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Week 1: Finding Rhythm
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Month 1: Living MYRHYTHM
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Month 6: Full LEAP Life
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
