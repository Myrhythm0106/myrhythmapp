
import React from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EventForm } from "@/components/calendar/EventForm";
import { Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimeSlot {
  time: string;
  hour: number;
}

interface DayEvent {
  id: string;
  title: string;
  startHour: number;
  duration: number; // in hours
  type: string;
  linkedGoal?: {
    id: string;
    title: string;
    type: "mobility" | "cognitive" | "health" | "other";
  };
}

interface DayViewProps {
  date: Date;
  events: DayEvent[];
}

const timeSlots: TimeSlot[] = Array.from({ length: 24 }, (_, i) => ({
  time: `${i === 0 ? '12' : i > 12 ? i - 12 : i}:00 ${i >= 12 ? 'PM' : 'AM'}`,
  hour: i,
}));

// Sample events
const sampleEvents: DayEvent[] = [
  {
    id: "1",
    title: "Neurology Appointment",
    startHour: 10,
    duration: 1,
    type: "appointment",
    linkedGoal: {
      id: "g1",
      title: "Follow medical plan",
      type: "health"
    }
  },
  {
    id: "2",
    title: "Physical Therapy",
    startHour: 14,
    duration: 1.5,
    type: "therapy",
    linkedGoal: {
      id: "g3",
      title: "Walk for 15 mins daily",
      type: "mobility"
    }
  }
];

export function DayView({ date, events = sampleEvents }: DayViewProps) {
  const getEventForHour = (hour: number) => {
    return events.filter(event => 
      event.startHour <= hour && 
      event.startHour + event.duration > hour
    );
  };

  const getEventTypeStyles = (type: string) => {
    switch (type) {
      case "appointment":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "therapy":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "medication":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
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

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted/20 py-2 px-4 border-b">
        <h3 className="font-medium">{format(date, "EEEE, MMMM d, yyyy")}</h3>
      </div>
      <div className="h-[500px] overflow-y-auto">
        {timeSlots.map((slot, i) => {
          const hourEvents = getEventForHour(slot.hour);
          
          return (
            <Dialog key={slot.hour}>
              <DialogTrigger asChild>
                <div 
                  className={cn(
                    "flex border-b py-2 relative h-16 cursor-pointer hover:bg-muted/20 transition-colors",
                    i % 2 === 0 ? "bg-background" : "bg-muted/10"
                  )}
                >
                  <div className="px-4 w-20 text-sm text-muted-foreground flex-shrink-0">
                    {slot.time}
                  </div>
                  <div className="flex-1 px-2 relative">
                    {hourEvents.map(event => (
                      <div 
                        key={event.id}
                        className={cn(
                          "rounded p-1 mb-1 flex items-center justify-between",
                          getEventTypeStyles(event.type)
                        )}
                      >
                        <span className="text-sm font-medium">{event.title}</span>
                        {event.linkedGoal && (
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs flex items-center gap-1",
                              getGoalTypeStyles(event.linkedGoal.type)
                            )}
                          >
                            <Target className="h-3 w-3" />
                            {event.linkedGoal.title}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Add New Action at {slot.time}</DialogTitle>
                </DialogHeader>
                <EventForm 
                  defaultTime={`${String(slot.hour).padStart(2, '0')}:00`} 
                />
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
}
