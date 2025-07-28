
import { CalendarEvent, RichMedia } from "../types/calendarTypes";
import { cn } from "@/lib/utils";

export const getEventTypeStyles = (type: CalendarEvent["type"], isGoal?: boolean) => {
  if (isGoal || type === "goal") {
    return "bg-amber-100 text-amber-800";
  }
  
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
