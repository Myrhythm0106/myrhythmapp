import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { format } from "date-fns";
import { GratitudeEntry } from "@/components/gratitude/GratitudePrompt";

interface GratitudeContextType {
  entries: GratitudeEntry[];
  addEntry: (entry: Omit<GratitudeEntry, "id" | "date">) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, entry: Partial<GratitudeEntry>) => void;
  toggleShared: (id: string) => void;
  getMostCommonTags: (limit?: number) => Array<{text: string, value: number}>;
  getAverageMoodByDay: () => Array<{date: string, averageMood: number}>;
}

// Sample data with updated GratitudeEntry format including the whyGrateful field
const sampleEntries: GratitudeEntry[] = [
  {
    id: "1",
    date: new Date(),
    promptType: "fitness",
    gratitudeText: "I'm grateful for my morning walk in the sunshine",
    whyGrateful: "It energizes me for the day and helps clear my mind",
    moodScore: 4,
    isShared: false,
    tags: ["nature", "exercise", "morning"]
  },
  {
    id: "2",
    date: new Date(Date.now() - 86400000), // Yesterday
    promptType: "social",
    gratitudeText: "Thankful for the support of friends",
    whyGrateful: "They listened when I needed someone to talk to",
    moodScore: 5,
    isShared: true,
    tags: ["friends", "support"]
  }
];

// Local storage key for gratitude entries
const STORAGE_KEY = 'gratitude-entries';

const GratitudeContext = createContext<GratitudeContextType | undefined>(undefined);

export const GratitudeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage or use sample data if none exists
  const [entries, setEntries] = useState<GratitudeEntry[]>(() => {
    const storedEntries = localStorage.getItem(STORAGE_KEY);
    if (storedEntries) {
      try {
        // Parse the stored JSON and convert date strings back to Date objects
        const parsedEntries = JSON.parse(storedEntries);
        return parsedEntries.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
          whyGrateful: entry.whyGrateful || "" // Ensure backward compatibility
        }));
      } catch (error) {
        console.error('Error parsing stored gratitude entries:', error);
        return sampleEntries;
      }
    }
    return sampleEntries;
  });
  
  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);
  
  const addEntry = (entry: Omit<GratitudeEntry, "id" | "date">) => {
    const newEntry = {
      ...entry,
      id: crypto.randomUUID(),
      date: new Date(),
      whyGrateful: entry.whyGrateful || "" // Ensure the field exists
    };
    
    setEntries([newEntry, ...entries]);
  };
  
  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };
  
  const updateEntry = (id: string, updatedFields: Partial<GratitudeEntry>) => {
    setEntries(
      entries.map(entry => 
        entry.id === id ? { ...entry, ...updatedFields } : entry
      )
    );
  };
  
  const toggleShared = (id: string) => {
    setEntries(
      entries.map(entry => 
        entry.id === id ? { ...entry, isShared: !entry.isShared } : entry
      )
    );
  };

  // Get most common tags across all entries
  const getMostCommonTags = (limit: number = 20) => {
    const tagCounts: Record<string, number> = {};
    
    entries.forEach(entry => {
      entry.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    return Object.keys(tagCounts)
      .map(tag => ({ text: tag, value: tagCounts[tag] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  };
  
  // Get average mood by day
  const getAverageMoodByDay = () => {
    const moodsByDate: Record<string, {total: number, count: number}> = {};
    
    entries.forEach(entry => {
      const dateString = format(
        entry.date instanceof Date ? entry.date : new Date(entry.date),
        'yyyy-MM-dd'
      );
      
      if (!moodsByDate[dateString]) {
        moodsByDate[dateString] = { total: 0, count: 0 };
      }
      
      moodsByDate[dateString].total += entry.moodScore;
      moodsByDate[dateString].count += 1;
    });
    
    return Object.keys(moodsByDate).map(date => ({
      date,
      averageMood: moodsByDate[date].total / moodsByDate[date].count
    }));
  };
  
  return (
    <GratitudeContext.Provider value={{ 
      entries, 
      addEntry, 
      deleteEntry, 
      updateEntry,
      toggleShared,
      getMostCommonTags,
      getAverageMoodByDay
    }}>
      {children}
    </GratitudeContext.Provider>
  );
};

export const useGratitude = () => {
  const context = useContext(GratitudeContext);
  
  if (context === undefined) {
    // If not wrapped in provider, return a default empty state
    return {
      entries: [],
      addEntry: () => {},
      deleteEntry: () => {},
      updateEntry: () => {},
      toggleShared: () => {},
      getMostCommonTags: (limit?: number) => [],
      getAverageMoodByDay: () => []
    };
  }
  
  return context;
};
