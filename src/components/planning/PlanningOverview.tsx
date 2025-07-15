
import React from "react";
import { usePlanningData } from "@/hooks/use-planning-data";
import { DailyPlanningCard } from "./DailyPlanningCard";
import { WeeklyPlanningCard } from "./WeeklyPlanningCard";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Target } from "lucide-react";

export function PlanningOverview() {
  const { data: planningData, isLoading } = usePlanningData();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gradient-to-br from-blue-50 to-blue-100 animate-pulse rounded-lg flex items-center justify-center">
              <Calendar className="h-8 w-8 text-blue-300" />
            </div>
            <div className="h-80 bg-gradient-to-br from-green-50 to-green-100 animate-pulse rounded-lg flex items-center justify-center">
              <Target className="h-8 w-8 text-green-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!planningData) {
    return (
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Planning overview will appear once data is loaded</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/2 via-white to-secondary/2">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-primary mb-1">Your Planning Overview</h3>
          <p className="text-sm text-muted-foreground">Daily actions and weekly goals working together</p>
        </div>
        
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
      </CardContent>
    </Card>
  );
}
