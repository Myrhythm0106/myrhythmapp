
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckSquare } from "lucide-react";
import { format } from "date-fns";

export interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  type: "appointment" | "therapy" | "medication" | "activity" | "personal" | "other";
  watchers?: string[];
}

interface ScheduleSectionProps {
  upcomingEvents: ScheduleEvent[];
}

export function ScheduleSection({ upcomingEvents }: ScheduleSectionProps) {
  // Helper function to get the event type styles
  const getEventTypeStyles = (type: string) => {
    switch (type) {
      case "appointment":
        return "bg-blue-100 text-blue-800";
      case "therapy":
        return "bg-purple-100 text-purple-800";
      case "medication":
        return "bg-red-100 text-red-800";
      case "activity":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const todaysEvents = upcomingEvents.filter(
    event => event.date === format(new Date(), "yyyy-MM-dd")
  );

  const futureEvents = upcomingEvents.filter(
    event => event.date !== format(new Date(), "yyyy-MM-dd")
  );

  return (
    <>
      {/* Today's appointments section */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium text-sm">Today's Schedule</h3>
        </div>
        <div className="space-y-2">
          {todaysEvents.map(event => (
            <div key={event.id} className="bg-card border rounded-md p-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{event.title}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${getEventTypeStyles(event.type)}`}>
                  {event.time}
                </span>
              </div>
            </div>
          ))}
          {todaysEvents.length === 0 && (
            <div className="text-sm text-muted-foreground italic text-center py-2">
              No scheduled events for today
            </div>
          )}
        </div>
      </div>
      
      {/* Upcoming tasks section */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckSquare className="h-5 w-5 text-green-500" />
          <h3 className="font-medium text-sm">Upcoming Tasks</h3>
        </div>
        <div className="space-y-2 max-h-[150px] overflow-y-auto">
          {futureEvents
            .slice(0, 3) // Limit to first 3 upcoming events
            .map(event => (
              <div key={event.id} className="bg-card border rounded-md p-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{event.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {event.date.split('-').slice(1).join('/')} • {event.time}
                  </span>
                </div>
                <div className="mt-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${getEventTypeStyles(event.type)}`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
              </div>
            ))}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-2 text-xs"
        >
          View Full Calendar
        </Button>
      </div>
    </>
  );
}
