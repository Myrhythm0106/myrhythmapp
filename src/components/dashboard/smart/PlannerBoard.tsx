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
    <Card className="h-fit bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-orange-600 uppercase tracking-wider">
              {label.toUpperCase()} FOCUS
            </p>
            <CardTitle className="text-xl font-bold text-gray-900">
              Your Priorities & Schedule
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewInCalendar}
            className="text-orange-700 border-orange-200 hover:bg-orange-50 rounded-xl"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Edit in Calendar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8 p-8">
        {/* Priorities Section */}
        <div className="space-y-4">
          <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <span className="text-orange-500 text-sm font-medium uppercase tracking-wider">TOP 3 PRIORITIES</span>
          </h4>
          <div className="space-y-3">
            {priorities.map(priority => (
              <div key={priority.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  priority.completed 
                    ? 'bg-orange-500 border-orange-500' 
                    : 'border-gray-300'
                }`}>
                  {priority.completed && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`text-base ${
                  priority.completed 
                    ? 'text-gray-500 line-through' 
                    : 'text-gray-900 font-medium'
                }`}>
                  {priority.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Section */}
        <div className="space-y-4">
          <h4 className="font-bold text-gray-900 text-lg">
            <span className="text-orange-500 text-sm font-medium uppercase tracking-wider block">Hourly Schedule</span>
          </h4>
          <div className="space-y-3">
            {scheduleItems.map((item, index) => (
              <div key={index} className="flex items-center gap-6 p-4 rounded-2xl bg-orange-50 border border-orange-100">
                <span className="text-sm font-bold text-gray-900 min-w-20 font-mono">
                  {item.time}
                </span>
                <span className="text-base text-gray-800 flex-1 font-medium">
                  {item.title}
                </span>
                <div className={`px-3 py-1 text-xs rounded-full font-medium uppercase tracking-wide ${
                  item.type === 'capture' ? 'bg-green-100 text-green-700' :
                  item.type === 'review' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {item.type}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div className="space-y-4">
          <h4 className="font-bold text-gray-900 text-lg">
            <span className="text-orange-500 text-sm font-medium uppercase tracking-wider block">Notes | To-Dos</span>
          </h4>
          <div className="space-y-3">
            {notes.map((note, index) => (
              <div key={index} className="p-4 rounded-2xl bg-amber-50 border-l-4 border-amber-400">
                <p className="text-base text-gray-800 font-medium">{note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Carry Over Section */}
        {carryOverItems.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <span className="text-orange-500 text-sm font-medium uppercase tracking-wider">CARRY OVER</span>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold">
                +{carryOverItems.length}
              </span>
            </h4>
            <div className="space-y-3">
              {carryOverItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-rose-50 border border-rose-100">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <span className="text-base text-gray-800 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}