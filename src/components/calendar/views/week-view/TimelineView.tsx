
import React from "react";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, MapPin, Target } from "lucide-react";
import { Action } from "@/components/calendar/ActionItem";
import { getActionTypeStyles } from "@/components/calendar/utils/actionStyles";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface TimelineViewProps {
  weekDays: Date[];
  showEnergyOverlay: boolean;
  getEventsForDay: (day: Date) => Action[];
  getRoutineStatus: (day: Date) => Record<string, boolean>;
  handleEventClick: (event: any) => void;
}

export function TimelineView({
  weekDays,
  showEnergyOverlay,
  getEventsForDay,
  getRoutineStatus,
  handleEventClick
}: TimelineViewProps) {
  return (
    <TooltipProvider>
      <Card className="border overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 text-center py-2 border-b bg-muted/10">
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
        
        {/* Timeline content */}
        <div className="grid grid-cols-7 gap-1 p-2">
          {weekDays.map((day) => {
            const eventsForDay = getEventsForDay(day);
            const routines = getRoutineStatus(day);
            
            return (
              <div key={day.toString()} className="space-y-2">
                {/* Routines section */}
                <div className="bg-muted/20 p-2 rounded-md">
                  <h4 className="text-xs font-medium mb-1">Daily Routines</h4>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(routines).map(([routine, completed]) => (
                      <Tooltip key={routine}>
                        <TooltipTrigger asChild>
                          <Badge 
                            variant={completed ? "default" : "outline"}
                            className={cn(
                              "text-[10px] cursor-help",
                              completed ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
                            )}
                          >
                            <CheckCircle className={cn(
                              "h-3 w-3 mr-1",
                              completed ? "text-green-600" : "text-gray-400"
                            )}/>
                            {routine}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="text-xs">{completed ? "Completed" : "Not yet completed"}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
                
                {/* Events timeline */}
                <div className={cn(
                  "space-y-2 p-2 rounded-md min-h-[400px]",
                  showEnergyOverlay && "bg-gradient-to-b from-green-50 via-yellow-50 to-red-50"
                )}>
                  {eventsForDay.length === 0 ? (
                    <div className="text-xs text-center text-muted-foreground py-2">
                      No events
                    </div>
                  ) : (
                    eventsForDay.map(event => (
                      <HoverCard key={event.id}>
                        <HoverCardTrigger asChild>
                          <div
                            className={cn(
                              "p-2 rounded-md border-l-4",
                              getActionTypeStyles(event.type),
                              "hover:shadow-md transition-shadow cursor-pointer"
                            )}
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{event.title}</span>
                              {event.linkedGoal && (
                                <Target className="h-3 w-3 text-primary" />
                              )}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {event.time}
                            </div>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 p-0">
                          <div className="bg-popover rounded-md shadow-md">
                            <div className={cn(
                              "p-3 rounded-t-md",
                              getActionTypeStyles(event.type)
                            )}>
                              <p className="font-semibold">{event.title}</p>
                              <div className="flex items-center text-xs mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{event.time}</span>
                              </div>
                            </div>
                            <div className="p-3 space-y-2">
                              {event.location && (
                                <div className="flex items-center text-sm">
                                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                              {event.linkedGoal && (
                                <div className="mt-2 pt-2 border-t">
                                  <div className="flex items-center text-sm">
                                    <Target className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                                    <div>
                                      <p className="font-medium">Linked Goal:</p>
                                      <p className="text-sm text-muted-foreground">{event.linkedGoal.title}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="text-xs text-center text-muted-foreground mt-2 pt-2 border-t">
                                Click to view details
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </TooltipProvider>
  );
}
