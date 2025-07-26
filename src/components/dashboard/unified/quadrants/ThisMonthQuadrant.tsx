import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Star, Calendar, Sparkles } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";

export function ThisMonthQuadrant() {
  const [monthlyTheme, setMonthlyTheme] = useState("");
  const { data: metrics } = useDashboardMetrics();

  useEffect(() => {
    // Load monthly theme from localStorage
    const savedTheme = localStorage.getItem("myrhythm_monthly_theme");
    if (savedTheme) {
      setMonthlyTheme(savedTheme);
    }
  }, []);

  const monthlyMetrics = metrics?.monthlyMetrics || {
    activeDays: 0,
    totalDays: 30,
    streakDays: 0,
    completedGoals: 0
  };

  const monthProgress = monthlyMetrics.totalDays > 0 
    ? (monthlyMetrics.activeDays / monthlyMetrics.totalDays) * 100 
    : 0;

  return (
    <div className="space-y-4">
      {/* Monthly Theme */}
      {monthlyTheme && (
        <div className="text-center p-3 bg-white/80 rounded-lg border border-teal-200">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-teal-600" />
            <span className="text-xs font-medium text-teal-700">Month of</span>
          </div>
          <div className="text-lg font-black text-teal-800">{monthlyTheme}</div>
        </div>
      )}

      {/* Monthly Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-teal-700">Month Progress</span>
          <span className="text-sm text-teal-600">{Math.round(monthProgress)}%</span>
        </div>
        <Progress value={monthProgress} className="h-3" />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center p-2 bg-white/60 rounded border border-teal-200">
          <div className="text-lg font-bold text-teal-600">{monthlyMetrics.activeDays}</div>
          <div className="text-xs text-teal-700">Active Days</div>
        </div>
        <div className="text-center p-2 bg-white/60 rounded border border-teal-200">
          <div className="text-lg font-bold text-teal-600">{monthlyMetrics.streakDays}</div>
          <div className="text-xs text-teal-700">Current Streak</div>
        </div>
      </div>

      {/* Monthly Achievements */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-teal-600" />
          <span className="text-sm font-medium text-teal-700">This Month's Wins</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 p-2 bg-white/60 rounded border border-teal-200">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-teal-800">Completed brain training goals</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white/60 rounded border border-teal-200">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-teal-800">5-day gratitude streak achieved</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white/60 rounded border border-teal-200">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-teal-800">Daily reflection habit building</span>
          </div>
        </div>
      </div>

      {/* Days Remaining */}
      <div className="pt-2 border-t border-teal-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-teal-600">
            <Calendar className="h-4 w-4" />
            <span>Days remaining</span>
          </div>
          <Badge variant="secondary" className="bg-teal-100 text-teal-700">
            {monthlyMetrics.totalDays - new Date().getDate()} days
          </Badge>
        </div>
      </div>
    </div>
  );
}