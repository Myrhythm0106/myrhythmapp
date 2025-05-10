import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, isToday, isPast, isFuture, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { WatchersDisplay } from "@/components/shared/WatchersDisplay";

interface Action {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  type: "appointment" | "therapy" | "medication" | "activity" | "personal" | "other";
  watchers?: string[];
  linkedGoal?: {
    id: string;
    title: string;
    type: "mobility" | "cognitive" | "health" | "other";
  };
}

interface UpcomingEventsProps {
  date?: Date;
}

// Sample data
const actions: Action[] = [
  {
    id: "1",
    title: "Neurology Appointment",
    date: "2023-05-20",
    time: "10:00 AM",
    location: "Dallas Neuro Center",
    type: "appointment",
    watchers: ["Dr. Smith"],
    linkedGoal: {
      id: "g1",
      title: "Follow medical plan",
      type: "health"
    }
  },
  {
    id: "2",
    title: "Cognitive Therapy",
    date: "2023-05-22",
    time: "2:30 PM",
    location: "Healing Minds Clinic",
    type: "therapy",
    linkedGoal: {
      id: "g2",
      title: "Improve memory skills",
      type: "cognitive"
    }
  },
  {
    id: "3",
    title: "Support Group Meeting",
    date: "2023-05-25",
    time: "6:00 PM",
    location: "Community Center",
    type: "activity",
    watchers: ["Sarah", "Michael"]
  },
  {
    id: "4",
    title: "Physical Therapy",
    date: "2023-05-27",
    time: "11:15 AM",
    location: "RehabWorks",
    type: "therapy",
    linkedGoal: {
      id: "g3",
      title: "Walk for 15 mins daily",
      type: "mobility"
    }
  },
];

export function UpcomingEvents({ date }: UpcomingEventsProps) {
  // In a real app, we would filter actions based on the selected date
  // For this demo, we'll just show all actions
  
  const getActionTypeStyles = (type: Action["type"]) => {
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
  
  const getGoalTypeStyles = (type: string) => {
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
  
  const getActionStatusStyles = (actionDate: string) => {
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

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {actions.map((action) => (
          <div 
            key={action.id} 
            className={`border rounded-md p-3 transition-all ${getActionStatusStyles(action.date)}`}
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium truncate">{action.title}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getActionTypeStyles(action.type)}`}>
                {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
              </span>
            </div>
            
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span className="truncate">{action.date}</span>
              </div>
              
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span className="truncate">{action.time}</span>
              </div>
              
              {action.location && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                  <span className="truncate">{action.location}</span>
                </div>
              )}

              {action.watchers && action.watchers.length > 0 && (
                <div className="flex items-center text-muted-foreground mt-1">
                  <WatchersDisplay watchers={action.watchers} compact />
                </div>
              )}
              
              {/* Display linked goal with enhanced visual styling */}
              {action.linkedGoal && (
                <div className="flex items-center mt-2 bg-primary/5 px-2 py-1 rounded-md border-l-2 border-primary/30 overflow-hidden">
                  <Target className="h-3.5 w-3.5 mr-1 text-primary flex-shrink-0" />
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs font-medium truncate max-w-full",
                      getGoalTypeStyles(action.linkedGoal.type)
                    )}
                  >
                    Goal: {action.linkedGoal.title}
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">Cancel</Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
