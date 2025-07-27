
import React from "react";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Action } from "@/components/calendar/ActionItem";
import { getActionTypeStyles } from "@/components/calendar/utils/actionStyles";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GridViewProps {
  weekDays: Date[];
  timeSlots: string[];
  showEnergyOverlay: boolean;
  getEventsForDay: (day: Date) => Action[];
  getEnergyLevel: (day: Date, hour: number) => "high" | "medium" | "low";
  getRoutineStatus: (day: Date) => Record<string, boolean>;
  handleEventClick: (event: any) => void;
}

export function GridView({
  weekDays,
  timeSlots,
  showEnergyOverlay,
  getEventsForDay,
  getEnergyLevel,
  getRoutineStatus,
  handleEventClick
}: GridViewProps) {
  return (
    <TooltipProvider>
      <Card className="border overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-8 text-center py-2 border-b bg-muted/10">
          <div className="px-2 font-medium text-muted-foreground">Time</div>
          {weekDays.map((day) => (
            <div key={day.toString()} className="px-2">
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
        
        {/* Time grid */}
        <div className="h-[600px] overflow-y-auto">
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="grid grid-cols-8 border-b min-h-[60px]">
              {/* Time column */}
              <div className="px-2 py-1 text-xs text-center text-muted-foreground border-r">
                {timeSlot}
              </div>
              
              {/* Day columns */}
              {weekDays.map((day) => {
                const hour = parseInt(timeSlot.split(':')[0]);
                const energyLevel = getEnergyLevel(day, hour);
                const eventsForSlot = getEventsForDay(day).filter(
                  event => event.time.includes(`${hour}:`)
                );
                
                return (
                  <div 
                    key={day.toString()} 
                    className="px-1 py-1 relative border-r"
                  >
                    {eventsForSlot.map(event => (
                      <Tooltip key={event.id}>
                        <TooltipTrigger asChild>
                          <div 
                            className={cn(
                              "text-xs p-1 mb-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity",
                              getActionTypeStyles(event.type)
                            )}
                            onClick={() => handleEventClick(event)}
                          >
                            <span className="font-medium">{event.title}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.time}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>
    </TooltipProvider>
  );
}
