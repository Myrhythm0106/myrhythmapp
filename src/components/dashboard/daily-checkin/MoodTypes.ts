
import React from "react";
import { Smile, Meh, Frown } from "lucide-react";

export interface MoodOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  numericValue: number;
}

export const moodOptions: MoodOption[] = [
  {
    value: "great",
    label: "Great",
    icon: <Smile className="h-6 w-6" />,
    color: "text-green-500",
    numericValue: 3
  },
  {
    value: "okay",
    label: "Okay",
    icon: <Meh className="h-6 w-6" />,
    color: "text-amber-500",
    numericValue: 2
  },
  {
    value: "struggling",
    label: "Struggling",
    icon: <Frown className="h-6 w-6" />,
    color: "text-red-500",
    numericValue: 1
  }
];

export interface MoodHistoryEntry {
  day: string;
  value: number;
  mood: string;
}

// Helper function to get color based on mood value
export const getMoodColor = (value: number): string => {
  switch (value) {
    case 3: return "#22c55e"; // green-500
    case 2: return "#f59e0b"; // amber-500
    case 1: return "#ef4444"; // red-500
    default: return "#d1d5db"; // gray-300
  }
};

// Helper function to get the mood icon
export const getMoodIcon = (mood: string): React.ReactNode | null => {
  const option = moodOptions.find(opt => opt.value === mood);
  if (!option) return null;
  return React.cloneElement(option.icon as React.ReactElement, { 
    className: `h-4 w-4 ${option.color}`
  });
};
