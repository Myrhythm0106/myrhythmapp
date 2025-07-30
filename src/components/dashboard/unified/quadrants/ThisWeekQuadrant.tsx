import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, Target, Sparkles } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";

export function ThisWeekQuadrant() {
  const [weekName, setWeekName] = useState("");
  const { data: metrics } = useDashboardMetrics();

  useEffect(() => {
    // Load week name from localStorage
    const savedWeekName = localStorage.getItem("myrhythm_week_name");
    if (savedWeekName) {
      setWeekName(savedWeekName);
    }
  }, []);

  const weeklyGoals = metrics?.weeklyGoals || [];

  const weekProgress = weeklyGoals.length > 0 
    ? weeklyGoals.reduce((acc, goal) => acc + goal.progress_percentage, 0) / weeklyGoals.length 
    : 0;

  return (
    <div className="space-y-4">

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
          {weeklyGoals.slice(0, 3).map((goal) => (
            <div key={goal.id} className="p-2 bg-white/60 rounded border border-purple-200">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-purple-800 font-medium truncate">{goal.title}</span>
                <span className="text-xs text-purple-600">{Math.round(goal.progress_percentage)}%</span>
              </div>
              <Progress value={goal.progress_percentage} className="h-1.5" />
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