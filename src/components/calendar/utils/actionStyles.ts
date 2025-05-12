
import { isToday, isPast, isFuture, addDays } from "date-fns";
import { Action } from "../ActionItem";

export const getActionTypeStyles = (type: Action["type"]) => {
  switch (type) {
    case "appointment":
      return "bg-blue-100 text-blue-800";
    case "therapy":
      return "bg-purple-100 text-purple-800";
    case "medication":
      return "bg-red-100 text-red-800";
    case "activity":
      return "bg-green-100 text-green-800";
    case "personal":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getGoalTypeStyles = (type: string) => {
  switch (type) {
    case "mobility":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "cognitive":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "health":
      return "bg-green-50 text-green-700 border-green-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const getActionStatusStyles = (actionDate: string) => {
  const today = new Date();
  const actionDateObj = new Date(actionDate);
  
  if (isPast(actionDateObj) && !isToday(actionDateObj)) {
    return "border-l-4 border-destructive"; // Late
  } else if (isToday(actionDateObj)) {
    return "border-l-4 border-secondary"; // Today
  } else if (isFuture(actionDateObj) && actionDateObj <= addDays(today, 3)) {
    return "border-l-4 border-beacon-500"; // Upcoming (within 3 days)
  }
  
  return ""; // Default - no special styling
};
