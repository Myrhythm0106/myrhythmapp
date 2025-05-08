
import { CalendarEvent, RichMedia } from "../types/calendarTypes";
import { cn } from "@/lib/utils";

export const getEventTypeStyles = (type: CalendarEvent["type"], isGoal?: boolean) => {
  if (isGoal || type === "goal") {
    return "bg-amber-100 text-amber-800 border-l-4 border-amber-500";
  }
  
  switch (type) {
    case "appointment":
      return "bg-blue-100 text-blue-800 border-l-4 border-blue-500";
    case "therapy":
      return "bg-purple-100 text-purple-800 border-l-4 border-purple-500";
    case "medication":
      return "bg-red-100 text-red-800 border-l-4 border-red-500";
    case "activity":
      return "bg-green-100 text-green-800 border-l-4 border-green-500";
    case "personal":
      return "bg-orange-100 text-orange-800 border-l-4 border-orange-500";
    default:
      return "bg-gray-100 text-gray-800 border-l-4 border-gray-500";
  }
};

export const getMediaIcon = (mediaType: RichMedia["type"]) => {
  switch (mediaType) {
    case "image":
      return "image";
    case "audio":
      return "headphones";
    case "video":
      return "video";
  }
};
