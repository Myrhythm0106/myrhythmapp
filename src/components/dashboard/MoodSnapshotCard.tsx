
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SmilePlus, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { useMoodTracker } from "@/hooks/use-mood-tracker";
import { format } from "date-fns";

type MoodType = "great" | "good" | "okay" | "not-great" | "struggling";
type MoodTrend = "up" | "neutral" | "down";

export function MoodSnapshotCard() {
  // Get mood data from your mood tracker hook
  const { entries } = useMoodTracker();

  const latestMood = entries.length > 0 ? entries[0].mood as MoodType : null;
  const previousMood = entries.length > 1 ? entries[1].mood as MoodType : null;
  
  // Calculate mood trend
  const getMoodTrend = (): MoodTrend => {
    if (!latestMood || !previousMood) return "neutral";
    
    const moodLevels: Record<MoodType, number> = {
      "great": 5,
      "good": 4,
      "okay": 3,
      "not-great": 2,
      "struggling": 1
    };
    
    const latestLevel = moodLevels[latestMood];
    const previousLevel = moodLevels[previousMood];
    
    if (latestLevel > previousLevel) return "up";
    if (latestLevel < previousLevel) return "down";
    return "neutral";
  };
  
  const moodTrend = getMoodTrend();
  
  // Get color based on mood
  const getMoodColor = (mood: MoodType | null) => {
    switch (mood) {
      case "great": return "text-emerald-500";
      case "good": return "text-blue-500";
      case "okay": return "text-amber-500";
      case "not-great": return "text-orange-500";
      case "struggling": return "text-red-500";
      default: return "text-gray-400";
    }
  };
  
  // Get emoji based on mood
  const getMoodEmoji = (mood: MoodType | null) => {
    switch (mood) {
      case "great": return "😄";
      case "good": return "🙂";
      case "okay": return "😐";
      case "not-great": return "😕";
      case "struggling": return "😔";
      default: return "❓";
    }
  };

  // Get trend component
  const getTrendComponent = () => {
    switch (moodTrend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Mood Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        {latestMood ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-4xl">{getMoodEmoji(latestMood)}</span>
                <div>
                  <p className={`text-lg font-medium ${getMoodColor(latestMood)}`}>
                    {latestMood.charAt(0).toUpperCase() + latestMood.slice(1).replace("-", " ")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entries[0]?.date ? format(new Date(entries[0].date), "EEEE h:mm a") : "Today"}
                  </p>
                </div>
              </div>
              {getTrendComponent()}
            </div>
            
            {entries[0]?.note && (
              <p className="mt-2 text-sm text-muted-foreground border-l-2 border-primary/20 pl-2">
                "{entries[0].note}"
              </p>
            )}
          </>
        ) : (
          <div className="py-6 text-center">
            <p className="mb-4 text-muted-foreground">How are you feeling today?</p>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500">
              <SmilePlus className="mr-1 h-4 w-4" />
              Log Your Mood
            </Button>
          </div>
        )}
      </CardContent>
      {latestMood && (
        <CardFooter className="pt-0">
          <Button variant="ghost" size="sm" className="ml-auto flex items-center gap-1 text-muted-foreground">
            View History
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
