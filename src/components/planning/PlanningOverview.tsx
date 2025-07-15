
import React from "react";
import { usePlanningData } from "@/hooks/use-planning-data";
import { DailyPlanningCard } from "./DailyPlanningCard";
import { WeeklyPlanningCard } from "./WeeklyPlanningCard";
import { useNavigate } from "react-router-dom";

export function PlanningOverview() {
  const { data: planningData, isLoading } = usePlanningData();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>
        <div className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  if (!planningData) {
    return (
      <div className="text-center p-6 text-gray-500">
        <p>Unable to load planning data</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DailyPlanningCard
        todayActions={planningData.todayActions}
        tomorrowActions={planningData.tomorrowActions}
        upcomingEvents={planningData.upcomingEvents}
        onViewCalendar={() => navigate('/calendar')}
      />
      <WeeklyPlanningCard
        weeklyGoals={planningData.weeklyGoals}
        thisWeekActions={planningData.thisWeekActions}
        onViewGoals={() => navigate('/goals')}
      />
    </div>
  );
}
