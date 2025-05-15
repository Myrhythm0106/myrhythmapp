
import { format } from "date-fns";
import { Action } from "@/components/calendar/ActionItem";
import { actions } from "@/components/calendar/data/actionsData";

// Get events for a specific day
export const getEventsForDay = (day: Date) => {
  const dayStr = format(day, "yyyy-MM-dd");
  return actions.filter(action => action.date === dayStr);
};

// Generate mock energy levels for visualization
export const getEnergyLevel = (day: Date, hour: number): "high" | "medium" | "low" => {
  // This would come from user data in a real app
  const dayOfWeek = day.getDay();
  
  // Morning hours (7-11)
  if (hour < 11) {
    // Most people have higher energy in the morning, especially on weekends
    return dayOfWeek === 0 || dayOfWeek === 6 ? "high" : "medium"; 
  }
  
  // Mid-day hours (11-15)
  if (hour >= 11 && hour < 15) {
    // Mid-day energy dip, more pronounced on weekdays
    return dayOfWeek < 5 ? "medium" : "high";
  }
  
  // Late afternoon/evening (15-18)
  if (hour >= 15 && hour < 18) {
    // Small afternoon boost
    return "medium";
  }
  
  // Evening (18+)
  return dayOfWeek < 5 ? "low" : "medium"; // Evening fatigue, less on weekends
};

// Get color for energy level
export const getEnergyLevelColor = (level: "high" | "medium" | "low"): string => {
  switch (level) {
    case "high":
      return "bg-green-50 border-green-200";
    case "medium":
      return "bg-yellow-50 border-yellow-200";
    case "low":
      return "bg-red-50 border-red-200";
    default:
      return "bg-transparent";
  }
};

// Get emoji for energy level
export const getEnergyLevelEmoji = (level: "high" | "medium" | "low"): string => {
  switch (level) {
    case "high":
      return "✨"; // Sparkles for high energy
    case "medium":
      return "✓"; // Check mark for medium energy
    case "low":
      return "⚠️"; // Warning for low energy
    default:
      return "";
  }
};

// Function to check if routines are completed for a day
export const getRoutineStatus = (day: Date) => {
  // In a real app, this would check actual user data
  return {
    medication: Math.random() > 0.3, // 70% chance of completion
    exercise: Math.random() > 0.5, // 50% chance of completion
    brainGames: Math.random() > 0.4, // 60% chance of completion
  };
};

// Generate time slots for the grid view (7 AM to 9 PM)
export const generateTimeSlots = (): string[] => {
  return Array.from({ length: 15 }, (_, i) => `${i + 7}:00`);
};
