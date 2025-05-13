
import { useState, useEffect } from "react";
import { GratitudeEntry } from "@/components/gratitude/GratitudePrompt";
import { toast } from "sonner";

export function useGratitude() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load entries from localStorage on initial render
  useEffect(() => {
    const loadEntries = () => {
      try {
        const savedEntries = localStorage.getItem("gratitudeEntries");
        if (savedEntries) {
          // Parse entries and convert date strings back to Date objects
          const parsedEntries = JSON.parse(savedEntries).map((entry: any) => ({
            ...entry,
            date: new Date(entry.date)
          }));
          setEntries(parsedEntries);
        }
      } catch (error) {
        console.error("Failed to load gratitude entries:", error);
        toast.error("Failed to load your gratitude journal");
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
        localStorage.setItem("gratitudeEntries", JSON.stringify(entries));
      } catch (error) {
        console.error("Failed to save gratitude entries:", error);
      }
    }
  }, [entries, isLoading]);

  const addEntry = (entry: GratitudeEntry) => {
    setEntries(prev => [entry, ...prev]);
  };

  const updateEntry = (id: string, updates: Partial<GratitudeEntry>) => {
    setEntries(prev =>
      prev.map(entry => (entry.id === id ? { ...entry, ...updates } : entry))
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast.success("Entry removed from your gratitude journal");
  };

  const getEntriesByDateRange = (startDate: Date, endDate: Date) => {
    return entries.filter(
      entry => entry.date >= startDate && entry.date <= endDate
    );
  };

  const getEntriesByPromptType = (promptType: string) => {
    return entries.filter(entry => entry.promptType === promptType);
  };

  const getMostCommonTags = (limit = 10) => {
    const tagCount: Record<string, number> = {};
    
    entries.forEach(entry => {
      entry.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag, count]) => ({ text: tag, value: count }));
  };

  const getAverageMoodByDay = () => {
    const moodByDay: Record<string, {total: number, count: number}> = {};
    
    entries.forEach(entry => {
      const dateKey = entry.date.toISOString().split('T')[0];
      if (!moodByDay[dateKey]) {
        moodByDay[dateKey] = { total: 0, count: 0 };
      }
      moodByDay[dateKey].total += entry.moodScore;
      moodByDay[dateKey].count += 1;
    });
    
    return Object.entries(moodByDay).map(([date, data]) => ({
      date,
      averageMood: data.total / data.count
    }));
  };

  return {
    entries,
    isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntriesByDateRange,
    getEntriesByPromptType,
    getMostCommonTags,
    getAverageMoodByDay
  };
}
