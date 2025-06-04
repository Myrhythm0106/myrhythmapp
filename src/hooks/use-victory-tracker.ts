
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DailyWinStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_win_date?: string;
  total_wins: number;
  created_at: string;
  updated_at: string;
}

interface VictoryCelebration {
  id: string;
  user_id: string;
  action_id?: string;
  celebration_type: string;
  milestone_value?: number;
  shown_at?: string;
  created_at: string;
}

export function useVictoryTracker() {
  const [streak, setStreak] = useState<DailyWinStreak | null>(null);
  const [celebrations, setCelebrations] = useState<VictoryCelebration[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize user's streak record
  const initializeStreak = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Check if streak record exists
      const { data: existingStreak } = await supabase
        .from('daily_win_streaks')
        .select('*')
        .eq('user_id', user.user.id)
        .single();

      if (!existingStreak) {
        // Create initial streak record
        const { data, error } = await supabase
          .from('daily_win_streaks')
          .insert([{
            user_id: user.user.id,
            current_streak: 0,
            longest_streak: 0,
            total_wins: 0
          }])
          .select()
          .single();

        if (error) throw error;
        setStreak(data);
      } else {
        setStreak(existingStreak);
      }
    } catch (error) {
      console.error('Error initializing streak:', error);
    }
  };

  // Update streak when a daily win is completed
  const updateStreakForDailyWin = async (completedDate: string) => {
    try {
      if (!streak) return;

      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      let newCurrentStreak = streak.current_streak;
      let newLongestStreak = streak.longest_streak;
      let newTotalWins = streak.total_wins + 1;

      // Update streak logic
      if (completedDate === today) {
        if (streak.last_win_date === yesterday || !streak.last_win_date) {
          newCurrentStreak = streak.current_streak + 1;
        } else if (streak.last_win_date !== today) {
          newCurrentStreak = 1; // Reset streak if gap
        }
      }

      newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);

      const { data, error } = await supabase
        .from('daily_win_streaks')
        .update({
          current_streak: newCurrentStreak,
          longest_streak: newLongestStreak,
          last_win_date: completedDate,
          total_wins: newTotalWins,
          updated_at: new Date().toISOString()
        })
        .eq('id', streak.id)
        .select()
        .single();

      if (error) throw error;
      setStreak(data);

      // Create milestone celebrations
      if (newCurrentStreak % 7 === 0 && newCurrentStreak > 0) {
        await createMilestoneCelebration('streak_milestone', newCurrentStreak);
        toast.success(`🔥 ${newCurrentStreak} Day Victory Streak! You're unstoppable!`, {
          description: "Your consistency is building incredible momentum!",
          duration: 6000
        });
      } else if (newCurrentStreak === 3) {
        toast.success("🌟 3 Day Victory Streak! You're building momentum!", {
          description: "Keep going - you're creating positive change!",
          duration: 4000
        });
      }

    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  // Create milestone celebration
  const createMilestoneCelebration = async (type: string, milestone: number) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('victory_celebrations')
        .insert([{
          user_id: user.user.id,
          celebration_type: type,
          milestone_value: milestone
        }])
        .select()
        .single();

      if (error) throw error;
      setCelebrations(prev => [...prev, data]);
    } catch (error) {
      console.error('Error creating milestone celebration:', error);
    }
  };

  // Fetch recent celebrations
  const fetchRecentCelebrations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('victory_celebrations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setCelebrations(data || []);
    } catch (error) {
      console.error('Error fetching celebrations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeStreak();
  }, []);

  return {
    streak,
    celebrations,
    loading,
    updateStreakForDailyWin,
    fetchRecentCelebrations,
    createMilestoneCelebration
  };
}
