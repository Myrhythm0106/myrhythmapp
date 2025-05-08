
import React from "react";
import { CalendarEvent } from "../types/calendarTypes";
import { EventCard } from "./EventCard";

interface EventTimelineProps {
  events: CalendarEvent[];
}

export function EventTimeline({ events }: EventTimelineProps) {
  return (
    <div className="relative p-4">
      {/* Timeline connector */}
      <div className="absolute left-[25px] top-0 bottom-0 w-1 bg-muted-foreground/20" />
      
      <div className="space-y-8">
        {events.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </div>
    </div>
  );
}
