import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, Award, TrendingUp, ChevronRight, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";

export function BrainFriendlyMonthView() {
  const navigate = useNavigate();
  const { data: metrics } = useDashboardMetrics();

  const monthlyMetrics = {
    activeDays: metrics?.monthlyMetrics?.activeDays || 0,
    totalDays: new Date().getDate(),
    currentStreak: metrics?.monthlyMetrics?.streakDays || 0,
    completedGoals: metrics?.monthlyMetrics?.completedGoals || 0,
    totalGoals: 5
  };

  const monthProgress = monthlyMetrics.totalDays > 0 
    ? (monthlyMetrics.activeDays / monthlyMetrics.totalDays) * 100 
    : 0;

  const getCurrentMonth = () => {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const generateMonthCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay() + 1); // Start on Monday
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) { // 6 weeks × 7 days
      if (days.length >= 35 && currentDate.getMonth() !== month) break;
      
      const dayData = {
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === today.toDateString(),
        hasActions: Math.random() > 0.3, // Mock data
        completionRate: Math.floor(Math.random() * 100)
      };
      
      days.push(dayData);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateMonthCalendar();
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return "bg-memory-emerald-400";
    if (rate >= 60) return "bg-brain-health-400";
    if (rate >= 40) return "bg-clarity-teal-300";
    return "bg-gray-200";
  };

  const monthlyAchievements = [
    { title: "5-Day Streak Achieved", date: "Week 2", color: "memory-emerald" },
    { title: "All Weekly Goals Met", date: "Week 3", color: "brain-health" },
    { title: "Energy Optimization", date: "Week 4", color: "clarity-teal" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Month Overview Header */}
      <Card 
        className="premium-card cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        onClick={() => navigate("/calendar?view=month")}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="gradient-text-brand flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {getCurrentMonth()}
            </CardTitle>
            <ChevronRight className="h-5 w-5 text-brain-health-400" />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Month Progress</span>
            <span>{Math.round(monthProgress)}%</span>
          </div>
          <Progress value={monthProgress} className="h-3" />
        </CardHeader>
      </Card>

      {/* Month Calendar Grid */}
      <Card 
        className="premium-card cursor-pointer hover:shadow-lg transition-all duration-300"
        onClick={() => navigate("/calendar?view=month")}
      >
        <CardHeader>
          <CardTitle className="gradient-text-brand text-lg">Calendar Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`aspect-square flex flex-col items-center justify-center p-1 rounded text-xs transition-all hover:bg-brain-health-50 ${
                  day.isCurrentMonth 
                    ? day.isToday 
                      ? "bg-brain-health-100 ring-2 ring-brain-health-400 text-brain-health-800 font-bold" 
                      : "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <span className="mb-1">{day.date.getDate()}</span>
                {day.hasActions && day.isCurrentMonth && (
                  <div className={`w-2 h-2 rounded-full ${getCompletionColor(day.completionRate)}`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-xs text-muted-foreground text-center">
            Click to view full calendar and make edits
          </div>
        </CardContent>
      </Card>

      {/* Monthly Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card 
          className="premium-card cursor-pointer hover:shadow-md transition-all duration-300"
          onClick={() => navigate("/analytics?view=month&metric=active-days")}
        >
          <CardContent className="p-4 text-center space-y-2">
            <TrendingUp className="h-8 w-8 mx-auto text-brain-health-500" />
            <div className="text-2xl font-bold text-brain-health-800">
              {monthlyMetrics.activeDays}
            </div>
            <div className="text-sm text-muted-foreground">Active Days</div>
          </CardContent>
        </Card>

        <Card 
          className="premium-card cursor-pointer hover:shadow-md transition-all duration-300"
          onClick={() => navigate("/analytics?view=month&metric=streak")}
        >
          <CardContent className="p-4 text-center space-y-2">
            <div className="h-8 w-8 mx-auto bg-gradient-to-r from-memory-emerald-400 to-clarity-teal-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">🔥</span>
            </div>
            <div className="text-2xl font-bold text-memory-emerald-800">
              {monthlyMetrics.currentStreak}
            </div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </CardContent>
        </Card>

        <Card 
          className="premium-card cursor-pointer hover:shadow-md transition-all duration-300"
          onClick={() => navigate("/goals?view=monthly")}
        >
          <CardContent className="p-4 text-center space-y-2">
            <Target className="h-8 w-8 mx-auto text-clarity-teal-500" />
            <div className="text-2xl font-bold text-clarity-teal-800">
              {monthlyMetrics.completedGoals}/{monthlyMetrics.totalGoals}
            </div>
            <div className="text-sm text-muted-foreground">Goals Met</div>
          </CardContent>
        </Card>

        <Card 
          className="premium-card cursor-pointer hover:shadow-md transition-all duration-300"
          onClick={() => navigate("/analytics?view=month&metric=completion")}
        >
          <CardContent className="p-4 text-center space-y-2">
            <Trophy className="h-8 w-8 mx-auto text-sunrise-amber-500" />
            <div className="text-2xl font-bold text-sunrise-amber-800">
              {Math.round(monthProgress)}%
            </div>
            <div className="text-sm text-muted-foreground">Completion</div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Achievements */}
      <Card 
        className="premium-card cursor-pointer hover:shadow-lg transition-all duration-300"
        onClick={() => navigate("/achievements?view=monthly")}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="gradient-text-brand flex items-center gap-2">
              <Award className="h-5 w-5" />
              This Month's Wins
            </CardTitle>
            <ChevronRight className="h-5 w-5 text-brain-health-400" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {monthlyAchievements.map((achievement, index) => (
            <div key={index} className={`p-3 bg-${achievement.color}-50 border border-${achievement.color}-200 rounded-lg`}>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className={`text-sm font-medium text-${achievement.color}-800`}>
                    {achievement.title}
                  </div>
                  <div className={`text-xs text-${achievement.color}-600`}>
                    {achievement.date}
                  </div>
                </div>
                <div className={`w-8 h-8 bg-gradient-to-r from-${achievement.color}-400 to-${achievement.color}-500 rounded-full flex items-center justify-center`}>
                  <span className="text-white text-lg">✓</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}