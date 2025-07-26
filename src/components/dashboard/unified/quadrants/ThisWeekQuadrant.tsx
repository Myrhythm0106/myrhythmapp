import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, Target, Sparkles } from "lucide-react";

export function ThisWeekQuadrant() {
  const [weeklyGoals, setWeeklyGoals] = useState<any[]>([]);
  const [weekName, setWeekName] = useState("");

  useEffect(() => {
    // Load week name from localStorage
    const savedWeekName = localStorage.getItem("myrhythm_week_name");
    if (savedWeekName) {
      setWeekName(savedWeekName);
    }

    // Mock weekly goals data - in real app, this would come from hooks
    setWeeklyGoals([
      { id: 1, title: "Complete 3 brain training sessions", progress: 67, target: 3, current: 2 },
      { id: 2, title: "Daily morning walks", progress: 57, target: 7, current: 4 },
      { id: 3, title: "Gratitude journaling", progress: 43, target: 7, current: 3 }
    ]);
  }, []);

  const weekProgress = weeklyGoals.length > 0 
    ? weeklyGoals.reduce((acc, goal) => acc + goal.progress, 0) / weeklyGoals.length 
    : 0;

  return (
    <div className="space-y-4">
      {/* Week Theme */}
      {weekName && (
        <div className="text-center p-3 bg-white/80 rounded-lg border border-purple-200">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-700">This Week's Theme</span>
          </div>
          <div className="text-sm font-bold text-purple-800">{weekName}</div>
        </div>
      )}

      {/* Week Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-purple-700">Week Progress</span>
          <span className="text-sm text-purple-600">{Math.round(weekProgress)}%</span>
        </div>
        <Progress value={weekProgress} className="h-3" />
      </div>

      {/* Weekly Goals */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-700">Active Goals</span>
        </div>
        <div className="space-y-2">
          {weeklyGoals.map((goal) => (
            <div key={goal.id} className="p-2 bg-white/60 rounded border border-purple-200">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-purple-800 font-medium truncate">{goal.title}</span>
                <span className="text-xs text-purple-600">{goal.current}/{goal.target}</span>
              </div>
              <Progress value={goal.progress} className="h-1.5" />
            </div>
          ))}
        </div>
      </div>

      {/* Days Remaining */}
      <div className="pt-2 border-t border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-purple-600">
            <Calendar className="h-4 w-4" />
            <span>Days remaining</span>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {7 - new Date().getDay()} days
          </Badge>
        </div>
      </div>
    </div>
  );
}