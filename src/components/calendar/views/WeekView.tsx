
import React from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  date: Date;
  events: any[]; // In a real app, we'd type this properly
}

export function WeekView({ date, events = [] }: WeekViewProps) {
  const startDate = startOfWeek(date, { weekStartsOn: 0 }); // 0 = Sunday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="grid grid-cols-7 bg-muted/20 text-center py-2 border-b">
        {weekDays.map((day) => (
          <div key={day.toString()} className="px-1">
            <div className="text-xs text-muted-foreground">
              {format(day, "EEE")}
            </div>
            <div className={cn(
              "text-sm font-medium w-8 h-8 rounded-full mx-auto flex items-center justify-center",
              isSameDay(day, new Date()) && "bg-primary text-primary-foreground"
            )}>
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>
      <div className="h-[400px] overflow-y-auto p-2 grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div key={day.toString()} className="min-h-[100px] border rounded p-1">
            {/* Here we'd render events for each day */}
          </div>
        ))}
      </div>
    </div>
  );
}
