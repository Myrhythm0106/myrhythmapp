
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeartHandshake, ArrowRight, Flame, Sparkles, ArrowDown, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAccountabilityIntegration } from "@/hooks/use-accountability-integration";

export function GratitudePracticeWidget() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifyTaskCompleted } = useAccountabilityIntegration();
  const [gratitudeNote, setGratitudeNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
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
  const hasContent = gratitudeNote.trim().length > 0;

  useEffect(() => {
    const checkScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        setShowScrollHint(scrollHeight > clientHeight && scrollTop < scrollHeight - clientHeight - 20);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll(); // Initial check
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

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
      const { data, error } = await supabase
        .from('gratitude_entries')
        .insert({
          user_id: user.id,
          gratitude_text: gratitudeNote.trim(),
          prompt_type: 'daily_widget'
        })
        .select()
        .single();

      if (error) throw error;

      // Notify support circle of gratitude practice completion
      await notifyTaskCompleted('Daily Gratitude Practice', data.id);

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

  const handleViewAll = () => {
    navigate("/gratitude");
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
      <CardContent 
        ref={containerRef}
        className="space-y-4 relative overflow-y-auto"
        style={{ maxHeight: '300px' }}
      >
        {/* Scroll hint */}
        {showScrollHint && (
          <div className="absolute top-0 right-2 z-10 animate-bounce">
            <div className="bg-rose-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <ArrowDown className="h-3 w-3" />
              More
            </div>
          </div>
        )}
        
        <div className="bg-gradient-to-r from-rose-100 to-pink-100 p-4 rounded-lg border border-rose-200">
          <p className="text-sm font-medium mb-2 text-rose-800">Today's question</p>
          <p className="text-sm text-rose-700 italic">
            {todayPrompt}
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="text-xs font-medium text-rose-700">
                What are you grateful for? 💖
              </label>
              {hasContent && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
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
          
          <div className="text-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleViewAll}
              className="text-rose-600 hover:text-rose-800 hover:bg-rose-100 border-rose-200"
            >
              <Brain className="h-4 w-4 mr-1" />
              Add Brain Health Gratitude
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-rose-200">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-rose-700">{currentStreak} day streak</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleViewAll}
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
