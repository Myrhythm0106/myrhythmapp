
import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";

export interface MoodEntry {
  id: string;
  date: Date;
  mood: "great" | "okay" | "struggling";
  score: number; // 1-5 scale
  note?: string;
}

export function useMoodTracker() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load entries from localStorage on initial render
  useEffect(() => {
    const loadEntries = () => {
      try {
        const savedEntries = localStorage.getItem("moodEntries");
        if (savedEntries) {
          const parsedEntries = JSON.parse(savedEntries).map((entry: any) => ({
            ...entry,
            date: new Date(entry.date)
          }));
          setEntries(parsedEntries);
        }
      } catch (error) {
        console.error("Failed to load mood entries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEntries();
  }, []);
  
  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("moodEntries", JSON.stringify(entries));
      } catch (error) {
        console.error("Failed to save mood entries:", error);
      }
    }
  }, [entries, isLoading]);
  
  const addEntry = (entry: MoodEntry) => {
    setEntries(prev => [entry, ...prev]);
  };
  
  const updateEntry = (id: string, updates: Partial<MoodEntry>) => {
    setEntries(prev =>
      prev.map(entry => (entry.id === id ? { ...entry, ...updates } : entry))
    );
  };
  
  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };
  
  const getLatestMood = (): MoodEntry | null => {
    return entries.length > 0 ? entries[0] : null;
  };
  
  const getMoodTrend = (days: number = 7) => {
    const recentEntries = entries
      .filter(entry => entry.date >= subDays(new Date(), days))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    if (recentEntries.length < 2) return "flat";
    
    const firstHalf = recentEntries.slice(0, Math.floor(recentEntries.length / 2));
    const secondHalf = recentEntries.slice(Math.floor(recentEntries.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, entry) => sum + entry.score, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, entry) => sum + entry.score, 0) / secondHalf.length;
    
    if (secondHalfAvg > firstHalfAvg + 0.5) return "up";
    if (secondHalfAvg < firstHalfAvg - 0.5) return "down";
    return "flat";
  };
  
  const getChartData = (days: number = 7) => {
    const result: {day: string; value: number}[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(now, i);
      const dateString = format(date, "EEE");
      
      const entriesForDay = entries.filter(
        entry => format(entry.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      );
      
      if (entriesForDay.length > 0) {
        const avgScore = entriesForDay.reduce((sum, entry) => sum + entry.score, 0) / entriesForDay.length;
        result.push({ day: dateString, value: avgScore });
      } else {
        result.push({ day: dateString, value: 0 });
      }
    }
    
    return result;
  };
  
  return {
    entries,
    isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
    getLatestMood,
    getMoodTrend,
    getChartData
  };
}
