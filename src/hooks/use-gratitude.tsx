
import React, { createContext, useState, useContext, ReactNode } from "react";

export type GratitudeEntry = {
  id: string;
  text: string;
  reflection?: string;
  tags?: string[];
  date: string;
  source?: string;
  mood?: string;
  isShared: boolean;
};

interface GratitudeContextType {
  entries: GratitudeEntry[];
  addEntry: (entry: Omit<GratitudeEntry, "id" | "date">) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, entry: Partial<GratitudeEntry>) => void;
  toggleShared: (id: string) => void;
}

// Sample data
const sampleEntries: GratitudeEntry[] = [
  {
    id: "1",
    text: "I'm grateful for my morning walk in the sunshine",
    reflection: "It helped me clear my mind and start the day with positive energy",
    tags: ["nature", "exercise", "morning"],
    date: new Date().toISOString(),
    mood: "great",
    isShared: false
  },
  {
    id: "2",
    text: "Thankful for the support of friends",
    reflection: "They've been there through tough times and continue to inspire me",
    tags: ["friends", "support"],
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    mood: "good",
    isShared: true
  }
];

const GratitudeContext = createContext<GratitudeContextType | undefined>(undefined);

export const GratitudeProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<GratitudeEntry[]>(sampleEntries);
  
  const addEntry = (entry: Omit<GratitudeEntry, "id" | "date">) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString(),
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
  
  return (
    <GratitudeContext.Provider value={{ 
      entries, 
      addEntry, 
      deleteEntry, 
      updateEntry,
      toggleShared
    }}>
      {children}
    </GratitudeContext.Provider>
  );
};

export const useGratitude = () => {
  const context = useContext(GratitudeContext);
  
  if (context === undefined) {
    // If not wrapped in provider, return a default empty state that won't crash the app
    return {
      entries: [],
      addEntry: () => {},
      deleteEntry: () => {},
      updateEntry: () => {},
      toggleShared: () => {}
    };
  }
  
  return context;
};
