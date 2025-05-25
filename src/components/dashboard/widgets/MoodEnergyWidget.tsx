
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Battery, ArrowRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MoodEnergyWidget() {
  const navigate = useNavigate();
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  
  // Mock data for energy level
  const energyLevel = 75;
  
  const moodOptions = [
    { emoji: "😊", label: "Great", value: "great" },
    { emoji: "😐", label: "Okay", value: "okay" },
    { emoji: "😔", label: "Low", value: "low" }
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="h-5 w-5 text-red-500" />
          Mood & Energy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">How are you feeling today?</p>
            <div className="flex gap-2">
              {moodOptions.map((mood) => (
                <Button
                  key={mood.value}
                  variant={currentMood === mood.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentMood(mood.value)}
                  className="flex-1 h-12 flex-col gap-1"
                >
                  <span className="text-lg">{mood.emoji}</span>
                  <span className="text-xs">{mood.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Battery className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Energy Level</span>
              <span className="text-sm text-muted-foreground">{energyLevel}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${energyLevel}%` }}
              />
            </div>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/mood")}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            View Trends
          </span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
