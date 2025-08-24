import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, Circle } from "lucide-react";
import { format, isToday } from "date-fns";
import { useNavigate } from "react-router-dom";

export function TodayStrip() {
  const navigate = useNavigate();
  const today = new Date();

  // Mock today's tasks - replace with actual data
  const todaysTasks = [
    { id: 1, title: "Morning gratitude", completed: true, time: "09:00" },
    { id: 2, title: "Memory capture", completed: false, time: "14:00" },
    { id: 3, title: "Brain training", completed: false, time: "16:00" }
  ];

  const completedCount = todaysTasks.filter(task => task.completed).length;
  const upcomingTask = todaysTasks.find(task => !task.completed);

  return (
    <Card 
      className="premium-card border-0 bg-gradient-to-r from-clarity-teal-50/60 to-brain-health-50/40 cursor-pointer hover:shadow-md transition-all duration-300"
      onClick={() => navigate("/calendar")}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Left: Date & Progress */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-clarity-teal-500 to-brain-health-500 text-white">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-clarity-teal-700">
                {format(today, 'EEEE, MMM d')}
              </h3>
              <div className="flex items-center gap-2 text-xs text-clarity-teal-600">
                <CheckCircle className="h-3 w-3" />
                <span>{completedCount} of {todaysTasks.length} completed</span>
              </div>
            </div>
          </div>

          {/* Right: Next Task */}
          <div className="text-right">
            {upcomingTask ? (
              <div className="space-y-1">
                <Badge variant="outline" className="text-xs border-clarity-teal-300 text-clarity-teal-700">
                  <Clock className="h-3 w-3 mr-1" />
                  {upcomingTask.time}
                </Badge>
                <p className="text-xs text-clarity-teal-600 max-w-20 truncate">
                  {upcomingTask.title}
                </p>
              </div>
            ) : (
              <div className="text-xs text-memory-emerald-600 font-medium">
                ✨ All done!
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full bg-clarity-teal-100 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-clarity-teal-500 to-memory-emerald-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / todaysTasks.length) * 100}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}