
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  type: "appointment" | "therapy" | "medication" | "activity" | "personal" | "other";
}

interface UpcomingEventsProps {
  date?: Date;
}

// Sample data
const events: Event[] = [
  {
    id: "1",
    title: "Neurology Appointment",
    date: "2023-05-20",
    time: "10:00 AM",
    location: "Dallas Neuro Center",
    type: "appointment"
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
    type: "activity"
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
  // In a real app, we would filter events based on the selected date
  // For this demo, we'll just show all events
  
  const getEventTypeStyles = (type: Event["type"]) => {
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
        {events.map((event) => (
          <div key={event.id} className="border rounded-md p-3">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">{event.title}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getEventTypeStyles(event.type)}`}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </span>
            </div>
            
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>{event.date}</span>
              </div>
              
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>{event.time}</span>
              </div>
              
              {event.location && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{event.location}</span>
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
