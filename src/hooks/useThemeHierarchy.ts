import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ThemeHierarchy {
  yearlyTheme: string;
  monthlyThemes: Record<string, string>; // month index as key
  weeklyThemes: Record<string, string>; // ISO week format as key
  dailyOverrides: Record<string, string>; // YYYY-MM-DD format as key
}

const defaultThemes: ThemeHierarchy = {
  yearlyTheme: "Abundance",
  monthlyThemes: {
    "0": "New Beginnings", "1": "Persistence", "2": "Growth", 
    "3": "Clarity", "4": "Strength", "5": "Balance",
    "6": "Freedom", "7": "Wisdom", "8": "Preparation",
    "9": "Gratitude", "10": "Community", "11": "Reflection"
  },
  weeklyThemes: {},
  dailyOverrides: {}
};

export function useThemeHierarchy() {
  const { user } = useAuth();
  const [themes, setThemes] = useState<ThemeHierarchy>(defaultThemes);
  const [isLoading, setIsLoading] = useState(false);

  // Load themes from database
  useEffect(() => {
    const loadThemes = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('notes')
          .select('content')
          .eq('user_id', user.id)
          .eq('title', 'Theme Hierarchy Settings')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const savedThemes = JSON.parse(data[0].content);
          setThemes(prev => ({ ...prev, ...savedThemes }));
        }
      } catch (error) {
        console.error('Error loading themes:', error);
      }
    };

    loadThemes();
  }, [user]);

  // Save themes to database
  const saveThemes = async (newThemes: Partial<ThemeHierarchy>) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updatedThemes = { ...themes, ...newThemes };
      
      const { error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: 'Theme Hierarchy Settings',
          content: JSON.stringify(updatedThemes)
        });

      if (error) throw error;

      setThemes(updatedThemes);
      return true;
    } catch (error) {
      console.error('Error saving themes:', error);
      toast.error('Failed to save theme');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get current contextual theme based on date
  const getCurrentTheme = useCallback((date: Date = new Date()) => {
    const year = date.getFullYear();
    const month = date.getMonth().toString();
    const dateStr = date.toISOString().split('T')[0];
    const weekKey = `${year}-W${Math.ceil(((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + new Date(year, 0, 1).getDay() + 1) / 7)}`;

    // Priority: Daily override > Weekly theme > Monthly theme
    const dailyTheme = themes.dailyOverrides[dateStr];
    const weeklyTheme = themes.weeklyThemes[weekKey];
    const monthlyTheme = themes.monthlyThemes[month] || defaultThemes.monthlyThemes[month];

    return {
      yearly: themes.yearlyTheme,
      monthly: monthlyTheme,
      weekly: weeklyTheme,
      daily: dailyTheme,
      current: dailyTheme || weeklyTheme || monthlyTheme || "Focus"
    };
  }, [themes]);

  // Get theme hierarchy for display
  const getThemeHierarchy = useCallback((date: Date = new Date()) => {
    const currentThemes = getCurrentTheme(date);
    const year = date.getFullYear();
    
    return {
      full: `${year}: Year of ${currentThemes.yearly} → ${currentThemes.monthly} → ${currentThemes.current}`,
      yearly: `${year}: Year of ${currentThemes.yearly}`,
      monthly: currentThemes.monthly,
      current: currentThemes.current,
      breadcrumb: [
        `${year}: ${currentThemes.yearly}`,
        currentThemes.monthly,
        currentThemes.current
      ]
    };
  }, [getCurrentTheme]);

  const updateYearlyTheme = useCallback(async (theme: string) => {
    const success = await saveThemes({ yearlyTheme: theme });
    if (success) {
      toast.success(`Year theme set to: ${theme}! 🌟`);
    }
    return success;
  }, [saveThemes]);

  const updateMonthlyTheme = useCallback(async (month: number, theme: string) => {
    const newMonthlyThemes = { ...themes.monthlyThemes, [month.toString()]: theme };
    const success = await saveThemes({ monthlyThemes: newMonthlyThemes });
    if (success) {
      toast.success(`Monthly theme updated: ${theme}! 💫`);
    }
    return success;
  }, [themes.monthlyThemes, saveThemes]);

  const updateWeeklyTheme = useCallback(async (weekKey: string, theme: string) => {
    const newWeeklyThemes = { ...themes.weeklyThemes, [weekKey]: theme };
    const success = await saveThemes({ weeklyThemes: newWeeklyThemes });
    if (success) {
      toast.success(`Weekly theme updated: ${theme}! ⭐`);
    }
    return success;
  }, [themes.weeklyThemes, saveThemes]);

  const updateDailyTheme = useCallback(async (dateStr: string, theme: string) => {
    const newDailyOverrides = { ...themes.dailyOverrides, [dateStr]: theme };
    const success = await saveThemes({ dailyOverrides: newDailyOverrides });
    if (success) {
      toast.success(`Daily theme updated: ${theme}! 🎯`);
    }
    return success;
  }, [themes.dailyOverrides, saveThemes]);

  return {
    themes,
    isLoading,
    getCurrentTheme,
    getThemeHierarchy,
    updateYearlyTheme,
    updateMonthlyTheme,
    updateWeeklyTheme,
    updateDailyTheme
  };
}