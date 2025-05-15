
import React, { useState } from "react";
import { format, startOfWeek, addDays, isSameDay, subWeeks, addWeeks, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CheckCircle, Clock, Target, Calendar as CalendarIcon } from "lucide-react";
import { Action } from "@/components/calendar/ActionItem";
import { getActionTypeStyles } from "@/components/calendar/utils/actionStyles";
import { actions } from "@/components/calendar/data/actionsData";

interface WeekViewProps {
  date: Date;
  events?: any[]; // In a real app, we'd type this properly
}

type ViewType = "grid" | "timeline";

export function WeekView({ date, events = [] }: WeekViewProps) {
  const [currentDate, setCurrentDate] = useState(date);
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [showEnergyOverlay, setShowEnergyOverlay] = useState(false);
  
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 }); // 0 = Sunday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  // Time slots for the grid view (7 AM to 9 PM)
  const timeSlots = Array.from({ length: 15 }, (_, i) => `${i + 7}:00`);
  
  const navigatePreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const navigateNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const navigateToday = () => setCurrentDate(new Date());
  
  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    const dayStr = format(day, "yyyy-MM-dd");
    return actions.filter(action => action.date === dayStr);
  };
  
  // Generate mock energy levels for visualization
  const getEnergyLevel = (day: Date, hour: number) => {
    // This would come from user data in a real app
    const dayOfWeek = day.getDay();
    if (hour < 10) return "high"; // Morning - high energy
    if (hour > 15) return dayOfWeek < 5 ? "low" : "medium"; // Evening - low on weekdays, medium on weekends
    return "medium"; // Mid-day - medium energy
  };
  
  // Function to check if routines are completed for a day
  const getRoutineStatus = (day: Date) => {
    // In a real app, this would check actual user data
    return {
      medication: Math.random() > 0.3, // 70% chance of completion
      exercise: Math.random() > 0.5, // 50% chance of completion
      brainGames: Math.random() > 0.4, // 60% chance of completion
    };
  };

  return (
    <div className="space-y-4">
      {/* Week navigation and controls */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={navigatePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={navigateToday}>Today</Button>
          <Button variant="outline" size="sm" onClick={navigateNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <h2 className="text-lg font-semibold">
          {format(startDate, "MMMM d")} - {format(addDays(startDate, 6), "MMMM d, yyyy")}
        </h2>
        
        <div className="flex space-x-2">
          <Button 
            variant={viewType === "grid" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setViewType("grid")}
          >
            Grid
          </Button>
          <Button 
            variant={viewType === "timeline" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setViewType("timeline")}
          >
            Timeline
          </Button>
          <Button 
            variant={showEnergyOverlay ? "default" : "outline"} 
            size="sm" 
            onClick={() => setShowEnergyOverlay(!showEnergyOverlay)}
          >
            Energy
          </Button>
        </div>
      </div>
      
      {/* Grid View */}
      {viewType === "grid" && (
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
                
                {/* Routine indicators */}
                <div className="flex justify-center space-x-1 mt-1">
                  {Object.entries(getRoutineStatus(day)).map(([routine, completed], i) => (
                    <div 
                      key={routine} 
                      className={cn(
                        "w-2 h-2 rounded-full",
                        completed ? "bg-green-500" : "bg-gray-300"
                      )}
                      title={`${routine}: ${completed ? "Completed" : "Not completed"}`}
                    />
                  ))}
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
                      className={cn(
                        "px-1 py-1 relative border-r",
                        showEnergyOverlay && (
                          energyLevel === "high" ? "bg-green-50" : 
                          energyLevel === "medium" ? "bg-yellow-50" : 
                          "bg-red-50"
                        )
                      )}
                    >
                      {eventsForSlot.map(event => (
                        <div 
                          key={event.id}
                          className={cn(
                            "text-xs p-1 mb-1 rounded truncate",
                            getActionTypeStyles(event.type).replace("text-", "").replace("bg-", "bg-")
                          )}
                        >
                          <span className="font-medium">{event.title}</span>
                          <div className="text-[10px]">{event.time}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {/* Timeline View */}
      {viewType === "timeline" && (
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
                        <Badge 
                          key={routine}
                          variant={completed ? "default" : "outline"}
                          className={cn("text-[10px]", completed && "bg-green-100 text-green-800 hover:bg-green-100")}
                        >
                          <CheckCircle className={cn(
                            "h-3 w-3 mr-1",
                            completed ? "text-green-600" : "text-gray-400"
                          )}/>
                          {routine}
                        </Badge>
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
                        <div
                          key={event.id}
                          className={cn(
                            "p-2 rounded-md border-l-4",
                            getActionTypeStyles(event.type).replace("text-", "text-").replace("bg-", "bg-"),
                            "hover:shadow-md transition-shadow cursor-pointer"
                          )}
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
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
