
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Action {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  type: "appointment" | "therapy" | "medication" | "activity" | "personal" | "other";
  watchers?: string[];
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
    watchers: ["Dr. Smith"]
  },
  {
    id: "2",
    title: "Cognitive Therapy",
    date: "2023-05-22",
    time: "2:30 PM",
    location: "Healing Minds Clinic",
    type: "therapy"
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
    type: "therapy"
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

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {actions.map((action) => (
          <div key={action.id} className="border rounded-md p-3">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">{action.title}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getActionTypeStyles(action.type)}`}>
                {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
              </span>
            </div>
            
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>{action.date}</span>
              </div>
              
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>{action.time}</span>
              </div>
              
              {action.location && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{action.location}</span>
                </div>
              )}

              {action.watchers && action.watchers.length > 0 && (
                <div className="flex items-center text-muted-foreground">
                  <User className="h-3.5 w-3.5 mr-1" />
                  <div className="flex gap-1 flex-wrap">
                    {action.watchers.map((watcher, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {watcher}
                      </Badge>
                    ))}
                  </div>
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
