import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Star,
  Target,
  Zap,
  Trophy,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { useDailyActions } from "@/contexts/DailyActionsContext";
import { useNavigate } from "react-router-dom";
import { MonthlyTheme } from "./MonthlyTheme";
import { DailyIChooseWidget } from "./DailyIChooseWidget";

export function VisualDashboard() {
  const { actions } = useDailyActions();
  
  // Get today's actions
  const today = new Date().toISOString().split('T')[0];
  const todaysActions = actions.filter(action => action.date === today);
  const navigate = useNavigate();
  const [yesterdayData, setYesterdayData] = useState({
    carryover: 2,
    completed: 4,
    achievements: ["Morning routine", "Therapy session"]
  });
  
  // Calculate today's completion rate
  const completedActions = todaysActions.filter(action => action.status === 'completed').length;
  const totalActions = todaysActions.length;
  const completionRate = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;
  
  // Get today's top 3 priorities (first 3 uncompleted or most important)
  const topPriorities = todaysActions
    .filter(action => action.status !== 'completed')
    .slice(0, 3)
    .map(action => action.title);

  // Mock visual metrics for demo
  const visualMetrics = {
    mood: 8,
    energy: 75,
    streak: 5,
    weekWins: 12
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return "😊";
    if (mood >= 6) return "🙂";
    if (mood >= 4) return "😐";
    return "😟";
  };

  const getTrendIcon = (value: number, threshold: number = 70) => {
    return value >= threshold ? (
      <TrendingUp className="h-4 w-4 text-emerald-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-amber-500" />
    );
  };

  return (
    <div className="space-y-6">

      {/* Enhanced Plan on a Page */}
      <Card className="bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60 border-2 border-purple-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              Your Command Center
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Yesterday's Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-amber-50/60 to-orange-50/40 border border-amber-200/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Yesterday's Carryover
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{yesterdayData.carryover}</div>
                <p className="text-xs text-amber-600">Tasks to complete today</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-emerald-50/60 to-teal-50/40 border border-emerald-200/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Yesterday's Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{yesterdayData.completed}</div>
                <p className="text-xs text-emerald-600">Actions completed</p>
                <div className="mt-2 space-y-1">
                  {yesterdayData.achievements.map((achievement, index) => (
                    <div key={index} className="text-xs text-emerald-600 flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {achievement}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Focus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-purple-50/60 to-blue-50/40 border border-purple-200/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Today's Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
                <p className="text-xs text-purple-600">Completion rate</p>
                <Progress value={completionRate} className="mt-2 h-2" />
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-teal-50/60 to-cyan-50/40 border border-teal-200/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-teal-700 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Top 3 Priorities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topPriorities.length > 0 ? (
                    topPriorities.map((priority, index) => (
                      <div key={index} className="text-xs text-teal-600 flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-teal-300 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        {priority}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-teal-600">All priorities complete! 🎉</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* High-Level Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-lg">{getMoodEmoji(visualMetrics.mood)}</span>
              </div>
              <p className="text-xs font-medium">Mood</p>
              <p className="text-xs text-muted-foreground">{visualMetrics.energy}% Energy</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-lg font-bold text-emerald-600">{visualMetrics.streak}</span>
              </div>
              <p className="text-xs font-medium">Streak</p>
              <p className="text-xs text-muted-foreground">Days</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-lg font-bold text-amber-600">{visualMetrics.weekWins}</span>
              </div>
              <p className="text-xs font-medium">Week Wins</p>
              <p className="text-xs text-muted-foreground">Achievements</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-lg font-bold text-blue-600">5</span>
              </div>
              <p className="text-xs font-medium">Upcoming</p>
              <p className="text-xs text-muted-foreground">Events</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Visual Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60 border-purple-200/50"
          onClick={() => navigate("/calendar")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">Need to Know NOW</h3>
                <p className="text-sm text-purple-600">3 upcoming actions</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-3 flex items-center text-xs text-purple-600">
              <span>View Calendar</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60 border-purple-200/50"
          onClick={() => navigate("/analytics")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">Overall Progress</h3>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-blue-600">Score: 85</span>
                  {getTrendIcon(85, 80)}
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-3 flex items-center text-xs text-blue-600">
              <span>View Analytics</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60 border-purple-200/50"
          onClick={() => navigate("/calendar")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">Quick Actions</h3>
                <p className="text-sm text-teal-600">Add new task</p>
              </div>
              <Zap className="w-8 h-8 text-teal-500" />
            </div>
            <div className="mt-3 flex items-center text-xs text-teal-600">
              <span>Open Calendar</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Progress Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60 border-purple-200/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Today's Focus
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm text-muted-foreground">{completedActions}/{totalActions}</span>
              </div>
              <Progress value={completionRate} className="h-3" />
              <p className="text-sm text-purple-600 font-medium">
                {completionRate >= 80 ? "Excellent progress! You're empowered and in control! 🔥" :
                 completionRate >= 50 ? "Great momentum! Your strength is showing! 💪" :
                 "Every step builds your power. You've got this! 🌟"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60 border-purple-200/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-teal-600" />
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Mood & Energy
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-4xl">{getMoodEmoji(visualMetrics.mood)}</span>
                <span className="text-sm text-muted-foreground">{visualMetrics.energy}% Energy</span>
              </div>
              <Progress value={visualMetrics.energy} className="h-3" />
              <p className="text-sm text-teal-600 font-medium">
                {visualMetrics.energy >= 80 ? "High energy day! You're unstoppable! ⚡" :
                 visualMetrics.energy >= 50 ? "Steady energy. You're in your flow. 🎯" :
                 "Honoring your energy. You're wise and self-aware. 🤗"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}