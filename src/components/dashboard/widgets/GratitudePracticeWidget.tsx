
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeartHandshake, ArrowRight, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function GratitudePracticeWidget() {
  const navigate = useNavigate();
  const [gratitudeNote, setGratitudeNote] = useState("");
  
  // Mock data
  const currentStreak = 5;
  const todayPrompt = "What small moment made you smile today?";

  const handleQuickEntry = () => {
    if (gratitudeNote.trim()) {
      toast.success("Gratitude note saved!");
      setGratitudeNote("");
    } else {
      toast.error("Please write something first");
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <HeartHandshake className="h-5 w-5 text-pink-500" />
          Gratitude Practice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-3 rounded-lg">
          <p className="text-sm font-medium mb-1">Today's Prompt</p>
          <p className="text-sm text-muted-foreground">
            {todayPrompt}
          </p>
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Write a quick gratitude note..."
            value={gratitudeNote}
            onChange={(e) => setGratitudeNote(e.target.value)}
            className="text-sm"
          />
          <Button 
            size="sm" 
            onClick={handleQuickEntry}
            className="w-full"
            disabled={!gratitudeNote.trim()}
          >
            Save Note
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">{currentStreak} day streak</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/gratitude")}
          >
            View Journal
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
