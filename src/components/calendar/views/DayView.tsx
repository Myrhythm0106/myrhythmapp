
import React from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EventForm } from "@/components/calendar/EventForm";

interface TimeSlot {
  time: string;
  hour: number;
}

interface DayViewProps {
  date: Date;
  events: any[]; // In a real app, we'd type this properly
}

const timeSlots: TimeSlot[] = Array.from({ length: 24 }, (_, i) => ({
  time: `${i === 0 ? '12' : i > 12 ? i - 12 : i}:00 ${i >= 12 ? 'PM' : 'AM'}`,
  hour: i,
}));

export function DayView({ date, events = [] }: DayViewProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted/20 py-2 px-4 border-b">
        <h3 className="font-medium">{format(date, "EEEE, MMMM d, yyyy")}</h3>
      </div>
      <div className="h-[500px] overflow-y-auto">
        {timeSlots.map((slot, i) => (
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
                  {/* Here we'd render events that match this timeslot */}
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
        ))}
      </div>
    </div>
  );
}
