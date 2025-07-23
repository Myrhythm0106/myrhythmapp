
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

export interface DailyAction {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  action_type: 'daily_win' | 'regular' | 'goal_linked' | 'routine';
  date: string;
  start_time?: string;
  duration_minutes?: number;
  status: 'pending' | 'completed' | 'skipped';
  is_daily_win: boolean;
  goal_id?: string;
  difficulty_level: number;
  focus_area?: 'sleep' | 'cognitive' | 'emotional' | 'physical' | 'social';
  celebration_shown: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: 'mobility' | 'cognitive' | 'health' | 'personal' | 'social';
  target_date?: string;
  status: 'active' | 'completed' | 'paused' | 'archived';
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export function useDailyActions() {
  const [actions, setActions] = useState<DailyAction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  // Auto-fetch today's actions on mount
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    fetchActionsForDate(today);
  }, []);

  // Fetch actions for a specific date
  const fetchActionsForDate = async (date: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('daily_actions')
        .select('*')
        .eq('date', date)
        .order('created_at');

      if (error) throw error;
      setActions((data || []) as DailyAction[]);
    } catch (error) {
      console.error('Error fetching actions:', error);
      toast.error('Failed to load actions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all active goals
  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('status', 'active')
        .order('created_at');

      if (error) throw error;
      setGoals((data || []) as Goal[]);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    }
  };

  // Create a new daily action
  const createAction = async (actionData: Partial<DailyAction>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('daily_actions')
        .insert([{
          ...actionData,
          title: actionData.title!,
          user_id: user.user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setActions(prev => [...prev, data as DailyAction]);
      toast.success(actionData.is_daily_win ? "Daily Win created! 🎉" : "Action created!");
      return data;
    } catch (error) {
      console.error('Error creating action:', error);
      toast.error('Failed to create action');
      throw error;
    }
  };

  // Complete an action
  const completeAction = async (actionId: string) => {
    try {
      const { data, error } = await supabase
        .from('daily_actions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', actionId)
        .select()
        .single();

      if (error) throw error;

      setActions(prev => prev.map(action => 
        action.id === actionId ? data as DailyAction : action
      ));

      // Show special celebration for daily wins
      if ((data as DailyAction).is_daily_win) {
        await createCelebration(actionId, 'daily_win');
        toast.success("Daily Win Complete! You're amazing! 🌟", {
          description: "Every victory matters on your journey!",
          duration: 5000
        });
      } else {
        toast.success("Action completed! 🎉");
      }

      return data;
    } catch (error) {
      console.error('Error completing action:', error);
      toast.error('Failed to complete action');
      throw error;
    }
  };

  // Create a celebration record
  const createCelebration = async (actionId: string, type: string, milestoneValue?: number) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from('victory_celebrations')
        .insert([{
          user_id: user.user.id,
          action_id: actionId,
          celebration_type: type,
          milestone_value: milestoneValue
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating celebration:', error);
    }
  };

  // Ensure today has a daily win
  const ensureDailyWinExists = async (date: string = format(new Date(), 'yyyy-MM-dd')) => {
    const todayActions = actions.filter(action => action.date === date);
    const hasDailyWin = todayActions.some(action => action.is_daily_win);

    if (!hasDailyWin) {
      // Create a suggested daily win based on user's rhythm assessment
      const suggestions = [
        "Take 5 deep breaths mindfully",
        "Write down one thing you're grateful for today",
        "Do one small stretch or movement",
        "Say something kind to yourself",
        "Drink a full glass of water with intention"
      ];

      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

      await createAction({
        title: randomSuggestion,
        action_type: 'daily_win',
        is_daily_win: true,
        date,
        difficulty_level: 1,
        focus_area: 'emotional'
      });
    }
  };

  // Create a new goal
  const createGoal = async (goalData: Partial<Goal>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('goals')
        .insert([{
          ...goalData,
          title: goalData.title!,
          user_id: user.user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setGoals(prev => [...prev, data as Goal]);
      toast.success("Goal created!");
      return data;
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
      throw error;
    }
  };

  return {
    actions,
    goals,
    loading,
    fetchActionsForDate,
    fetchGoals,
    createAction,
    completeAction,
    ensureDailyWinExists,
    createGoal
  };
}
