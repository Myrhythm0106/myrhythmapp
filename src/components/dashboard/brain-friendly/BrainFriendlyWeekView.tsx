import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, Clock, TrendingUp, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";

export function BrainFriendlyWeekView() {
  const navigate = useNavigate();
  const { data: metrics } = useDashboardMetrics();

  const getCurrentWeekDays = () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        fullDate: date,
        isToday: date.toDateString() === new Date().toDateString()
      });
    }
    return days;
  };

  const weekDays = getCurrentWeekDays();
  const weeklyGoals = metrics?.weeklyGoals || [];
  const weekProgress = weeklyGoals.length > 0 
    ? weeklyGoals.reduce((acc, goal) => acc + goal.progress_percentage, 0) / weeklyGoals.length 
    : 0;

  const mockDayData = [
    { energy: "high", actions: 5, completed: 4 },
    { energy: "medium", actions: 3, completed: 2 },
    { energy: "high", actions: 4, completed: 4 },
    { energy: "medium", actions: 6, completed: 3 },
    { energy: "low", actions: 2, completed: 1 },
    { energy: "medium", actions: 3, completed: 0 },
    { energy: "high", actions: 4, completed: 0 }
  ];

  const getEnergyColor = (energy: string) => {
    switch (energy) {
      case "high": return "bg-memory-emerald-100 border-memory-emerald-300 text-memory-emerald-800";
      case "medium": return "bg-brain-health-100 border-brain-health-300 text-brain-health-800";
      case "low": return "bg-clarity-teal-100 border-clarity-teal-300 text-clarity-teal-800";
      default: return "bg-brain-health-100 border-brain-health-300 text-brain-health-800";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Week Overview Header */}
      <Card 
        className="premium-card cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        onClick={() => navigate("/calendar?view=week")}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="gradient-text-brand flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              This Week
            </CardTitle>
            <ChevronRight className="h-5 w-5 text-brain-health-400" />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Week Progress</span>
            <span>{Math.round(weekProgress)}%</span>
          </div>
          <Progress value={weekProgress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Days Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {weekDays.map((day, index) => {
          const dayData = mockDayData[index];
          const completionRate = dayData.actions > 0 ? (dayData.completed / dayData.actions) * 100 : 0;
          
          return (
            <Card
              key={index}
              className={`cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-105 ${
                day.isToday 
                  ? "ring-2 ring-brain-health-400 bg-gradient-to-br from-brain-health-50 to-clarity-teal-50" 
                  : "premium-card"
              }`}
              onClick={() => navigate(`/calendar?view=day&date=${day.fullDate.toISOString()}`)}
            >
              <CardContent className="p-4 space-y-3">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    {day.name}
                  </div>
                  <div className="text-2xl font-bold text-brain-health-800">
                    {day.date}
                  </div>
                  {day.isToday && (
                    <Badge variant="secondary" className="bg-brain-health-500 text-white text-xs">
                      Today
                    </Badge>
                  )}
                </div>

                {/* Energy Level */}
                <div className={`text-center p-2 rounded-lg border ${getEnergyColor(dayData.energy)}`}>
                  <div className="text-xs font-medium capitalize">
                    {dayData.energy} Energy
                  </div>
                </div>

                {/* Actions Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Actions</span>
                    <span>{dayData.completed}/{dayData.actions}</span>
                  </div>
                  {dayData.actions > 0 && (
                    <Progress value={completionRate} className="h-1.5" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weekly Goals */}
      <Card 
        className="premium-card cursor-pointer hover:shadow-lg transition-all duration-300"
        onClick={() => navigate("/goals?view=weekly")}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="gradient-text-brand flex items-center gap-2">
              <Target className="h-5 w-5" />
              Active Weekly Goals
            </CardTitle>
            <ChevronRight className="h-5 w-5 text-brain-health-400" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {weeklyGoals.slice(0, 3).map((goal) => (
            <div key={goal.id} className="p-3 bg-brain-health-50 rounded-lg border border-brain-health-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-brain-health-800 truncate">
                  {goal.title}
                </span>
                <span className="text-xs text-brain-health-600">
                  {Math.round(goal.progress_percentage)}%
                </span>
              </div>
              <Progress value={goal.progress_percentage} className="h-2" />
            </div>
          ))}
          {weeklyGoals.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <div className="text-sm">No weekly goals set</div>
              <div className="text-xs">Click to create your first weekly goal</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* This Week Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card 
          className="premium-card cursor-pointer hover:shadow-md transition-all duration-300"
          onClick={() => navigate("/analytics?view=week")}
        >
          <CardContent className="p-4 text-center space-y-2">
            <TrendingUp className="h-8 w-8 mx-auto text-brain-health-500" />
            <div className="text-2xl font-bold text-brain-health-800">85%</div>
            <div className="text-sm text-muted-foreground">Week Completion</div>
          </CardContent>
        </Card>

        <Card 
          className="premium-card cursor-pointer hover:shadow-md transition-all duration-300"
          onClick={() => navigate("/calendar?view=week&focus=energy")}
        >
          <CardContent className="p-4 text-center space-y-2">
            <div className="h-8 w-8 mx-auto bg-gradient-to-r from-memory-emerald-400 to-clarity-teal-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚡</span>
            </div>
            <div className="text-2xl font-bold text-memory-emerald-800">High</div>
            <div className="text-sm text-muted-foreground">Avg Energy</div>
          </CardContent>
        </Card>

        <Card 
          className="premium-card cursor-pointer hover:shadow-md transition-all duration-300"
          onClick={() => navigate("/calendar?view=week&focus=streak")}
        >
          <CardContent className="p-4 text-center space-y-2">
            <Clock className="h-8 w-8 mx-auto text-clarity-teal-500" />
            <div className="text-2xl font-bold text-clarity-teal-800">5</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}