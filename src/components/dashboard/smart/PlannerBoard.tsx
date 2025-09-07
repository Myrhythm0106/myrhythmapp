import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Target, StickyNote, ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TimeFrame, useDateRanges } from "@/hooks/useDateRanges";

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
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg gradient-text-brand flex items-center gap-2">
            <Target className="h-5 w-5" />
            {label} Planner
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewInCalendar}
            className="text-brain-health-600 border-brain-health-200 hover:bg-brain-health-50"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Edit in Calendar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Priorities Section */}
        <div className="space-y-3">
          <h4 className="font-medium text-brain-health-800 flex items-center gap-2">
            <Target className="h-4 w-4 text-memory-emerald-600" />
            Top Priorities
          </h4>
          <div className="space-y-2">
            {priorities.map(priority => (
              <div key={priority.id} className="flex items-center gap-3 p-2 rounded-lg bg-brain-health-50">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  priority.completed 
                    ? 'bg-memory-emerald-500 border-memory-emerald-500' 
                    : 'border-brain-health-300'
                }`}>
                  {priority.completed && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`text-sm ${
                  priority.completed 
                    ? 'text-brain-health-600 line-through' 
                    : 'text-brain-health-800'
                }`}>
                  {priority.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Section */}
        <div className="space-y-3">
          <h4 className="font-medium text-brain-health-800 flex items-center gap-2">
            <Clock className="h-4 w-4 text-clarity-teal-600" />
            {label} Schedule
          </h4>
          <div className="space-y-2">
            {scheduleItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-clarity-teal-50">
                <span className="text-xs font-medium text-clarity-teal-700 min-w-16">
                  {item.time}
                </span>
                <span className="text-sm text-brain-health-800 flex-1">
                  {item.title}
                </span>
                <div className={`px-2 py-1 text-xs rounded ${
                  item.type === 'capture' ? 'bg-memory-emerald-100 text-memory-emerald-700' :
                  item.type === 'review' ? 'bg-brain-health-100 text-brain-health-700' :
                  'bg-sunrise-amber-100 text-sunrise-amber-700'
                }`}>
                  {item.type}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div className="space-y-3">
          <h4 className="font-medium text-brain-health-800 flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-sunrise-amber-600" />
            Quick Notes
          </h4>
          <div className="space-y-2">
            {notes.map((note, index) => (
              <div key={index} className="p-2 rounded-lg bg-sunrise-amber-50 border-l-2 border-sunrise-amber-300">
                <p className="text-sm text-brain-health-700">{note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Carry Over Section */}
        {carryOverItems.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-brain-health-800 flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-brain-health-500" />
              Carry Over
            </h4>
            <div className="space-y-2">
              {carryOverItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-brain-health-100">
                  <div className="w-2 h-2 rounded-full bg-brain-health-400"></div>
                  <span className="text-sm text-brain-health-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}