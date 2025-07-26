import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, Calendar, Target } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";

export function ThisYearQuadrant() {
  const { data: metrics } = useDashboardMetrics();

  const yearlyMetrics = metrics?.yearlyMetrics || {
    daysCompleted: 0,
    totalDays: 365,
    majorGoalsCompleted: 0,
    totalMajorGoals: 0,
    longestStreak: 0,
    currentYear: new Date().getFullYear()
  };

  const yearProgress = yearlyMetrics.totalDays > 0 
    ? (yearlyMetrics.daysCompleted / yearlyMetrics.totalDays) * 100 
    : 0;
  const goalProgress = yearlyMetrics.totalMajorGoals > 0 
    ? (yearlyMetrics.majorGoalsCompleted / yearlyMetrics.totalMajorGoals) * 100 
    : 0;

  return (
    <div className="space-y-4">
      {/* Year Header */}
      <div className="text-center p-3 bg-white/80 rounded-lg border border-amber-200">
        <div className="text-2xl font-black text-amber-700">{yearlyMetrics.currentYear}</div>
        <div className="text-xs text-amber-600">Your Year of Growth</div>
      </div>

      {/* Year Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-amber-700">Year Progress</span>
          <span className="text-sm text-amber-600">{Math.round(yearProgress)}%</span>
        </div>
        <Progress value={yearProgress} className="h-3" />
      </div>

      {/* Major Goals Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">Major Goals</span>
          </div>
          <span className="text-sm text-amber-600">{yearlyMetrics.majorGoalsCompleted}/{yearlyMetrics.totalMajorGoals}</span>
        </div>
        <Progress value={goalProgress} className="h-2" />
      </div>

      {/* Key Yearly Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center p-2 bg-white/60 rounded border border-amber-200">
          <div className="text-lg font-bold text-amber-600">{yearlyMetrics.longestStreak}</div>
          <div className="text-xs text-amber-700">Longest Streak</div>
        </div>
        <div className="text-center p-2 bg-white/60 rounded border border-amber-200">
          <div className="text-lg font-bold text-amber-600">{yearlyMetrics.daysCompleted}</div>
          <div className="text-xs text-amber-700">Days Active</div>
        </div>
      </div>

      {/* Yearly Achievements */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-700">Major Milestones</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 p-2 bg-white/60 rounded border border-amber-200">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-amber-800">6-month recovery milestone</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white/60 rounded border border-amber-200">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-amber-800">100+ brain training sessions</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white/60 rounded border border-amber-200">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-amber-800">Building daily habits</span>
          </div>
        </div>
      </div>

      {/* Days Remaining */}
      <div className="pt-2 border-t border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-amber-600">
            <Calendar className="h-4 w-4" />
            <span>Days remaining</span>
          </div>
          <Badge variant="secondary" className="bg-amber-100 text-amber-700">
            {yearlyMetrics.totalDays - yearlyMetrics.daysCompleted} days
          </Badge>
        </div>
      </div>
    </div>
  );
}