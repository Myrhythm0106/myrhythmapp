import React from "react";
import { MemoryEffectsContainer } from "@/components/ui/memory-effects";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, Clock, Brain } from "lucide-react";
import { GoalsView } from "./views/GoalsView";
import { DayView } from "./views/DayView";
import { WeekView } from "./views/WeekView";
import { YearView } from "./views/YearView";
import { InteractiveCalendarActions } from "./InteractiveCalendarActions";

interface BrainHealthCalendarViewProps {
  view: "day" | "week" | "month" | "year" | "goals";
  onViewChange: (view: "day" | "week" | "month" | "year" | "goals") => void;
  date?: Date;
  onDateSelect: (date: Date | undefined) => void;
  onNewGoal: () => void;
}

export function BrainHealthCalendarView({
  view,
  onViewChange,
  date,
  onDateSelect,
  onNewGoal
}: BrainHealthCalendarViewProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
  const [selectedTime, setSelectedTime] = React.useState<string>();

  const handleMonthClick = (monthDate: Date) => {
    onDateSelect(monthDate);
    onViewChange("month");
  };

  const handleDateClick = (clickedDate: Date | undefined) => {
    setSelectedDate(clickedDate);
    onDateSelect(clickedDate);
  };

  const handleActionCreate = (actionData: any) => {
    console.log("New action created:", actionData);
    // TODO: Integrate with action creation system
  };

  return (
    <MemoryEffectsContainer nodeCount={6} className="relative">
      <Card className="border-memory-emerald-200 bg-gradient-to-br from-memory-emerald-50/30 to-white">
        <CardContent className="pt-6">
          {/* View Selector Buttons */}
          <div className="mb-6 flex justify-center">
            <div className="flex bg-white border border-memory-emerald-200 rounded-lg p-1">
              <Button
                variant={view === "day" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange("day")}
                className="flex items-center gap-1"
              >
                <Clock className="h-4 w-4" />
                Day
              </Button>
              <Button
                variant={view === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange("week")}
                className="flex items-center gap-1"
              >
                <Calendar className="h-4 w-4" />
                Week
              </Button>
              <Button
                variant={view === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange("month")}
                className="flex items-center gap-1"
              >
                <Calendar className="h-4 w-4" />
                Month
              </Button>
              <Button
                variant={view === "year" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange("year")}
                className="flex items-center gap-1"
              >
                <Calendar className="h-4 w-4" />
                Year
              </Button>
              <Button
                variant={view === "goals" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange("goals")}
                className="flex items-center gap-1"
              >
                <Target className="h-4 w-4" />
                Goals
              </Button>
            </div>
          </div>

          {/* Current View Indicator */}
          <div className="text-center mb-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              Current View: {view.toUpperCase()}
            </Badge>
          </div>
          
          {/* Calendar Content */}
          <div className="min-h-[400px] relative">
            {view === "month" && (
              <div className="flex justify-center">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateClick}
                  className="rounded-md border border-memory-emerald-200 bg-white/80 backdrop-blur-sm"
                />
              </div>
            )}
            
            {view === "day" && (
              <div className="animate-in fade-in-50 duration-200">
                <DayView date={selectedDate || new Date()} />
              </div>
            )}
            
            {view === "week" && (
              <div className="animate-in fade-in-50 duration-200">
                <WeekView 
                  date={selectedDate || new Date()} 
                />
              </div>
            )}

            {view === "year" && (
              <div className="text-center p-8">
                <h3 className="text-xl font-semibold mb-4">Year View</h3>
                <p className="text-muted-foreground mb-4">
                  Year: {selectedDate?.getFullYear() || new Date().getFullYear()}
                </p>
                <YearView 
                  currentDate={selectedDate || new Date()} 
                  events={[]} 
                  onDayClick={(clickedDate) => {
                    setSelectedDate(clickedDate);
                    onDateSelect(clickedDate);
                    onViewChange("day");
                  }}
                  onMonthClick={handleMonthClick}
                />
              </div>
            )}

            {view === "goals" && (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-clarity-teal-400 to-clarity-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-clarity-teal-600 to-clarity-teal-700 bg-clip-text text-transparent mb-2">
                    Your Goal Journey
                  </h3>
                  <p className="text-base text-gray-600 mb-4">
                    Every small step builds new neural pathways. Your brain is constantly growing and adapting.
                  </p>
                  <Button onClick={onNewGoal} className="mt-4">
                    <Target className="h-4 w-4 mr-2" />
                    Create New Goal
                  </Button>
                </div>
                <GoalsView />
              </div>
            )}
          </div>

          {/* Interactive Calendar Actions for all calendar views */}
          {view !== "goals" && (
            <>
              <InteractiveCalendarActions
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onActionCreate={handleActionCreate}
                view={view}
              />
              
              {/* Enhanced Day View with Event Details and Watchers */}
              {view === "day" && selectedDate && (
                <div className="mt-4 p-4 bg-gradient-to-r from-memory-emerald-50 to-clarity-teal-50 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-2">
                    Day Details - {selectedDate.toLocaleDateString()}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add events, set reminders, and invite watchers from your accountability circle
                  </p>
                  
                  {/* Quick Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleActionCreate({ 
                        type: 'event', 
                        date: selectedDate,
                        watchers: [] 
                      })}
                    >
                      Add Event
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleActionCreate({ 
                        type: 'reminder', 
                        date: selectedDate,
                        watchers: [] 
                      })}
                    >
                      Set Reminder
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleActionCreate({ 
                        type: 'task', 
                        date: selectedDate,
                        watchers: [] 
                      })}
                    >
                      Add Task
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </MemoryEffectsContainer>
  );
}