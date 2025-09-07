import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Target, StickyNote, ArrowRight, Clock, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TimeFrame, useDateRanges } from "@/hooks/useDateRanges";
import { cn } from "@/lib/utils";

interface PlannerBoardProps {
  timeFrame: TimeFrame;
}

export function PlannerBoard({ timeFrame }: PlannerBoardProps) {
  const navigate = useNavigate();
  const { label } = useDateRanges(timeFrame);

  const handleViewInCalendar = () => {
    navigate(`/calendar?view=${timeFrame}`);
  };

  // Mock data - in real implementation, this would come from your calendar/planning system
  const priorities = [
    { id: 1, text: "Complete morning capture session", completed: true },
    { id: 2, text: "Review and act on yesterday's notes", completed: false },
    { id: 3, text: "Focus on memory consolidation exercises", completed: false }
  ];

  const scheduleItems = [
    { time: "9:00 AM", title: "Morning Reflection", type: "capture" },
    { time: "2:00 PM", title: "Afternoon Check-in", type: "review" },
    { time: "8:00 PM", title: "Evening Gratitude", type: "reflection" }
  ];

  const notes = [
    "Remember to focus on small wins today",
    "Energy feels good this morning - use it wisely",
    "Calendar is the source of truth for all planning"
  ];

  const carryOverItems = [
    "Call support person about weekly check-in",
    "Complete brain game from yesterday"
  ];

  return (
    <Card className="h-fit bg-gradient-to-br from-white to-brand-teal-50/30 border-brand-teal-200/60 shadow-sm">
      <CardHeader className="pb-4 bg-gradient-to-r from-brand-teal-500 to-brand-emerald-500 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider opacity-90">
              {label.toUpperCase()} FOCUS
            </div>
            <CardTitle className="text-lg font-bold">
              Your Priorities & Schedule
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewInCalendar}
            className="border-white/20 text-white hover:bg-white/10"
          >
            View in Calendar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* TOP 3 PRIORITIES */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-brand-orange-600 uppercase tracking-wider">
            TOP 3 PRIORITIES
          </h3>
          <div className="space-y-2">
            {priorities.map((priority, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 flex-shrink-0",
                  priority.completed 
                    ? "bg-brand-emerald-500 border-brand-emerald-500" 
                    : "border-gray-300"
                )}>
                  {priority.completed && (
                    <Check className="w-2.5 h-2.5 text-white m-0.5" />
                  )}
                </div>
                <span className={cn(
                  "text-sm",
                  priority.completed 
                    ? "line-through text-gray-500" 
                    : "text-gray-700"
                )}>
                  {priority.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Schedule */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-brand-orange-600 uppercase tracking-wider">
            Hourly Schedule
          </h3>
          <div className="space-y-2">
            {scheduleItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 font-mono w-12 flex-shrink-0">
                  {item.time}
                </span>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    item.type === "capture" && "bg-brand-emerald-400",
                    item.type === "review" && "bg-brand-teal-400",
                    item.type === "reflection" && "bg-brand-blue-400"
                  )} />
                  <span className="text-sm text-gray-700">{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes | To-Dos */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-brand-orange-600 uppercase tracking-wider">
            Notes | To-Dos
          </h3>
          <div className="space-y-2">
            {notes.map((note, index) => (
              <div key={index} className="flex items-start gap-2">
                <StickyNote className="w-3 h-3 text-brand-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CARRY OVER */}
        {carryOverItems.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-brand-orange-600 uppercase tracking-wider flex items-center gap-2">
              CARRY OVER
              <span className="bg-brand-orange-100 text-brand-orange-700 text-xs px-2 py-0.5 rounded-full">
                {carryOverItems.length}
              </span>
            </h3>
            <div className="space-y-2">
              {carryOverItems.map((item, index) => (
                <div key={index} className="flex items-start gap-2 bg-brand-orange-50 p-2 rounded-md">
                  <ArrowRight className="w-3 h-3 text-brand-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}