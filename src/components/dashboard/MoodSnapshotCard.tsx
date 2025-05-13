
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

// Sample data - in a real app, this would come from an API or context
const moodData = [
  { day: "Mon", value: 4 },
  { day: "Tue", value: 3 },
  { day: "Wed", value: 5 },
  { day: "Thu", value: 3 },
  { day: "Fri", value: 4 },
  { day: "Sat", value: 4 },
  { day: "Sun", value: 5 },
];

export function MoodSnapshotCard() {
  const navigate = useNavigate();
  // Sample mood - in a real app, this would be the most recent mood
  const currentMood = "great"; // "great", "okay", or "struggling"
  
  // Determine if the mood trend is improving or declining
  const trendDirection = "up"; // "up", "down", or "flat"
  
  const getMoodIcon = () => {
    switch(currentMood) {
      case "great":
        return <Smile className="h-8 w-8 text-green-500" />;
      case "okay":
        return <Meh className="h-8 w-8 text-yellow-500" />;
      case "struggling":
        return <Frown className="h-8 w-8 text-red-500" />;
      default:
        return <Meh className="h-8 w-8 text-yellow-500" />;
    }
  };
  
  const getTrendIcon = () => {
    switch(trendDirection) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  const handleLogMood = () => {
    navigate("/tracking?type=mood");
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Mood Today</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getMoodIcon()}
            <div>
              <p className="font-medium capitalize">{currentMood}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                {getTrendIcon()}
                <span className="ml-1">Trending {trendDirection}</span>
              </div>
            </div>
          </div>
          <Button onClick={handleLogMood} variant="outline" size="sm">
            Update
          </Button>
        </div>
        
        <div className="h-[60px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-center text-muted-foreground mt-1">
            7-day mood trend
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          className="w-full text-primary"
          onClick={() => navigate("/tracking?tab=mood")}
        >
          View Detailed History
        </Button>
      </CardFooter>
    </Card>
  );
}
