
import React from "react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventTimeline } from "../storyboard/EventTimeline";
import { CalendarEvent, sampleEvents } from "../types/calendarTypes";

interface StoryboardViewProps {
  date: Date;
  events: CalendarEvent[];
}

export function StoryboardView({ date, events = [] }: StoryboardViewProps) {
  // For demo purposes, using sample data
  const displayEvents = events.length > 0 ? events : sampleEvents;
  
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted/20 py-2 px-4 border-b">
        <h3 className="font-medium">{format(date, "EEEE, MMMM d, yyyy")} - My Day Storyboard</h3>
      </div>
      
      <ScrollArea className="h-[500px]">
        <EventTimeline events={displayEvents} />
      </ScrollArea>
    </div>
  );
}
