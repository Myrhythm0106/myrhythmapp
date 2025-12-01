import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format, isToday, parseISO } from 'date-fns';

interface DailyWelcomeState {
  lastShownDate: string | null;
  mood: 'good' | 'okay' | 'rest' | null;
  dismissedToday: boolean;
}

export interface DailyProgressStats {
  completedToday: number;
  totalToday: number;
  completedThisWeek: number;
  currentStreak: number;
}

export function useDailyWelcome() {
  const { user } = useAuth();
  const [shouldShowWelcome, setShouldShowWelcome] = useState(false);
  const [welcomeState, setWelcomeState] = useState<DailyWelcomeState>({
    lastShownDate: null,
    mood: null,
    dismissedToday: false
  });
  const [progressStats, setProgressStats] = useState<DailyProgressStats>({
    completedToday: 0,
    totalToday: 0,
    completedThisWeek: 0,
    currentStreak: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load welcome state and progress
  const loadWelcomeState = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const storageKey = `daily_welcome_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      const today = format(new Date(), 'yyyy-MM-dd');

      if (stored) {
        const parsed: DailyWelcomeState = JSON.parse(stored);
        setWelcomeState(parsed);

        // Check if we should show welcome
        const lastShown = parsed.lastShownDate;
        const showWelcome = !lastShown || lastShown !== today || !parsed.dismissedToday;
        setShouldShowWelcome(showWelcome);
      } else {
        // First time user - always show welcome
        setShouldShowWelcome(true);
      }

      // Load progress stats from database
      await loadProgressStats();

    } catch (error) {
      console.error('Error loading welcome state:', error);
      setShouldShowWelcome(true);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const loadProgressStats = useCallback(async () => {
    if (!user) return;

    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      const weekStartStr = format(weekStart, 'yyyy-MM-dd');

      // Get today's actions
      const { data: todayActions } = await supabase
        .from('daily_actions')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('date', today);

      // Get this week's completed actions
      const { data: weekActions } = await supabase
        .from('daily_actions')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('date', weekStartStr);

      // Get streak data
      const { data: streakData } = await supabase
        .from('daily_win_streaks')
        .select('current_streak')
        .eq('user_id', user.id)
        .limit(1);

      const completedToday = todayActions?.filter(a => a.status === 'completed').length || 0;
      const totalToday = todayActions?.length || 0;

      setProgressStats({
        completedToday,
        totalToday,
        completedThisWeek: weekActions?.length || 0,
        currentStreak: streakData?.[0]?.current_streak || 0
      });

    } catch (error) {
      console.error('Error loading progress stats:', error);
    }
  }, [user]);

  useEffect(() => {
    loadWelcomeState();
  }, [loadWelcomeState]);

  // Dismiss welcome for today
  const dismissWelcome = useCallback((mood?: 'good' | 'okay' | 'rest') => {
    if (!user) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    const newState: DailyWelcomeState = {
      lastShownDate: today,
      mood: mood || welcomeState.mood,
      dismissedToday: true
    };

    localStorage.setItem(`daily_welcome_${user.id}`, JSON.stringify(newState));
    setWelcomeState(newState);
    setShouldShowWelcome(false);

    // Track mood if provided
    if (mood) {
      trackMood(mood);
    }
  }, [user, welcomeState.mood]);

  // Track mood selection
  const trackMood = useCallback(async (mood: 'good' | 'okay' | 'rest') => {
    if (!user) return;

    try {
      // Save to mood_entries table for analytics
      await supabase.from('mood_entries').insert({
        user_id: user.id,
        mood: mood === 'good' ? 'great' : mood === 'okay' ? 'okay' : 'tired',
        energy_level: mood === 'good' ? 4 : mood === 'okay' ? 3 : 1,
        context: 'daily_welcome',
        date: format(new Date(), 'yyyy-MM-dd')
      });
    } catch (error) {
      console.error('Error tracking mood:', error);
    }
  }, [user]);

  // Force show welcome (for testing or manual trigger)
  const showWelcome = useCallback(() => {
    setShouldShowWelcome(true);
  }, []);

  // Get greeting based on time of day
  const getTimeBasedGreeting = useCallback((): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return {
    shouldShowWelcome,
    isLoading,
    welcomeState,
    progressStats,
    dismissWelcome,
    showWelcome,
    getTimeBasedGreeting,
    refreshProgress: loadProgressStats
  };
}
