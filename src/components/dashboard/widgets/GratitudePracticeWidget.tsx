
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
    "What made you smile today?",
    "Who showed you kindness recently?", 
    "What progress are you proud of?",
    "What challenge helped you grow?",
    "What small joy brightened your day?"
  ];
  
  const todayPrompt = todayPrompts[Math.floor(Math.random() * todayPrompts.length)];

  const handleQuickEntry = async () => {
    if (!user) {
      toast.error("Please log in to save your gratitude");
      return;
    }
    
    if (!gratitudeNote.trim()) {
      toast.error("Share what you're grateful for");
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

      toast.success("Your gratitude has been saved! ✨", {
        description: "Every grateful moment builds your resilience."
      });
      setGratitudeNote("");
    } catch (error) {
      console.error('Error saving gratitude:', error);
      toast.error("Couldn't save right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 border-rose-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <HeartHandshake className="h-5 w-5 text-rose-500" />
          Your Daily Gratitude
          <Sparkles className="h-4 w-4 text-amber-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-rose-100 to-pink-100 p-4 rounded-lg border border-rose-200">
          <p className="text-sm font-medium mb-2 text-rose-800">Today's question</p>
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
            {isSubmitting ? "Saving..." : "Save This Moment"}
          </Button>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-rose-700">{currentStreak} day streak</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/gratitude")}
            className="text-rose-600 hover:text-rose-800 hover:bg-rose-100"
          >
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
