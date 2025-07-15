
import React from "react";
import { MemoryEffectsContainer } from "@/components/ui/memory-effects";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          <div className="mb-6 flex justify-between items-center">
            <Tabs value={view} onValueChange={(v) => onViewChange(v as typeof view)}>
              <TabsList className="bg-white border border-memory-emerald-200">
                <TabsTrigger 
                  value="day" 
                  className="data-[state=active]:bg-memory-emerald-100 data-[state=active]:text-memory-emerald-700"
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Day
                </TabsTrigger>
                <TabsTrigger 
                  value="week"
                  className="data-[state=active]:bg-memory-emerald-100 data-[state=active]:text-memory-emerald-700"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Week
                </TabsTrigger>
                <TabsTrigger 
                  value="month"
                  className="data-[state=active]:bg-memory-emerald-100 data-[state=active]:text-memory-emerald-700"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Month
                </TabsTrigger>
                <TabsTrigger 
                  value="year"
                  className="data-[state=active]:bg-memory-emerald-100 data-[state=active]:text-memory-emerald-700"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Year
                </TabsTrigger>
                <TabsTrigger 
                  value="goals"
                  className="data-[state=active]:bg-clarity-teal-100 data-[state=active]:text-clarity-teal-700"
                >
                  <Target className="h-4 w-4 mr-1" />
                  Goals
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {view === "goals" && (
              <Button 
                size="sm"
                onClick={onNewGoal}
                className="bg-gradient-to-r from-clarity-teal-500 to-clarity-teal-600 hover:from-clarity-teal-600 hover:to-clarity-teal-700"
              >
                <Target className="h-4 w-4 mr-1" />
                New Goal
              </Button>
            )}
          </div>
          
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
            
            {view === "day" && selectedDate && (
              <DayView date={selectedDate} events={[]} />
            )}
            
            {view === "week" && selectedDate && (
              <WeekView date={selectedDate} events={[]} />
            )}

            {view === "year" && selectedDate && (
              <YearView 
                currentDate={selectedDate} 
                events={[]} 
                onDayClick={(clickedDate) => {
                  setSelectedDate(clickedDate);
                  onDateSelect(clickedDate);
                  onViewChange("day");
                }}
                onMonthClick={handleMonthClick}
              />
            )}

            {view === "goals" && (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-clarity-teal-400 to-brain-health-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-memory-pulse">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-brain-xl font-semibold bg-gradient-to-r from-clarity-teal-600 to-brain-health-600 bg-clip-text text-transparent mb-2">
                    Your Goal Journey
                  </h3>
                  <p className="text-brain-base text-gray-600 mb-4">
                    Every small step builds new neural pathways. Your brain is constantly growing and adapting.
                  </p>
                  <Badge className="bg-brain-health-100 text-brain-health-700 border-brain-health-200">
                    Memory1st Goal Planning
                  </Badge>
                </div>
                <GoalsView />
              </div>
            )}

            {/* Interactive Calendar Actions for all calendar views */}
            {view !== "goals" && (
              <InteractiveCalendarActions
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onActionCreate={handleActionCreate}
                view={view}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </MemoryEffectsContainer>
  );
}
