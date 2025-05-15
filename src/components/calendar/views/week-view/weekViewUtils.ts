
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
  if (hour < 10) return "high"; // Morning - high energy
  if (hour > 15) return dayOfWeek < 5 ? "low" : "medium"; // Evening - low on weekdays, medium on weekends
  return "medium"; // Mid-day - medium energy
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
