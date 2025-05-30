
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeartHandshake, ArrowRight, Flame, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function GratitudePracticeWidget() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gratitudeNote, setGratitudeNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock data for display
  const currentStreak = 5;
  const todayPrompts = [
    "What small moment brought you joy today?",
    "Who showed you kindness recently?", 
    "What progress did you make today, no matter how small?",
    "What are you proud of yourself for today?",
    "What challenge taught you something valuable?"
  ];
  
  const todayPrompt = todayPrompts[Math.floor(Math.random() * todayPrompts.length)];

  const handleQuickEntry = async () => {
    if (!user) {
      toast.error("Please log in to save gratitude entries");
      return;
    }
    
    if (!gratitudeNote.trim()) {
      toast.error("Share what's sparking gratitude in your heart");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('gratitude_entries')
        .insert({
          user_id: user.id,
          gratitude_text: gratitudeNote.trim(),
          prompt_type: 'daily_widget'
        });

      if (error) throw error;

      toast.success("Your gratitude lights up the world! ✨", {
        description: "Every moment of gratitude grows your resilience."
      });
      setGratitudeNote("");
    } catch (error) {
      console.error('Error saving gratitude:', error);
      toast.error("Failed to save gratitude entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 border-rose-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <HeartHandshake className="h-5 w-5 text-rose-500" />
          Daily Gratitude Practice
          <Sparkles className="h-4 w-4 text-amber-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-rose-100 to-pink-100 p-4 rounded-lg border border-rose-200">
          <p className="text-sm font-medium mb-2 text-rose-800">Today's Growth Question</p>
          <p className="text-sm text-rose-700 italic">
            {todayPrompt}
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-rose-700 mb-1 block">
              What are you grateful for? 💖
            </label>
            <Input
              placeholder="I'm grateful for..."
              value={gratitudeNote}
              onChange={(e) => setGratitudeNote(e.target.value)}
              className="text-sm border-rose-200 focus:border-rose-400"
              disabled={isSubmitting}
            />
          </div>
          
          <Button 
            size="sm" 
            onClick={handleQuickEntry}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
            disabled={!gratitudeNote.trim() || isSubmitting}
          >
            <HeartHandshake className="h-4 w-4 mr-1" />
            {isSubmitting ? "Saving..." : "Capture This Moment"}
          </Button>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-rose-700">{currentStreak} days growing</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/gratitude")}
            className="text-rose-600 hover:text-rose-800 hover:bg-rose-100"
          >
            Explore More
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
