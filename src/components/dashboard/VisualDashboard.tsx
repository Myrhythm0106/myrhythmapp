import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Heart, Clock, Trophy, ArrowRight, CheckCircle, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDailyActions } from "@/contexts/DailyActionsContext";
import { useUserProgress } from "@/hooks/useUserProgress";

export function VisualDashboard() {
  const navigate = useNavigate();
  const { actions } = useDailyActions();
  const { metrics } = useUserProgress();
  
  // Calculate today's metrics
  const today = new Date().toISOString().split('T')[0];
  const todayActions = actions.filter(action => action.date === today);
  const completedActions = todayActions.filter(action => action.status === 'completed');
  const completionRate = todayActions.length > 0 ? Math.round((completedActions.length / todayActions.length) * 100) : 0;
  
  // Mock data for visual demo - in real app, these would come from actual user data
  const visualMetrics = {
    mood: 8, // out of 10
    energy: 75, // percentage
    focusStreak: 3, // days
    weeklyWins: 12,
    upcomingCount: todayActions.filter(a => a.status === 'pending').length,
    progressScore: metrics.readinessScore || 65
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return "😊";
    if (mood >= 6) return "🙂";
    if (mood >= 4) return "😐";
    return "😟";
  };

  const getTrendIcon = (value: number, threshold: number = 70) => {
    return value >= threshold ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-amber-500" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Plan on a Page - Visual Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl font-bold text-purple-800">Plan on a Page</h2>
            <p className="text-purple-600">Your day at a glance</p>
          </div>
          
          {/* Key Numbers Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Today's Progress */}
            <div className="text-center space-y-2">
              <div className="relative">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{completionRate}%</span>
                </div>
                {getTrendIcon(completionRate)}
              </div>
              <p className="text-sm font-medium text-green-700">Today's Focus</p>
            </div>
            
            {/* Mood & Energy */}
            <div className="text-center space-y-2">
              <div className="relative">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                  <span className="text-2xl">{getMoodEmoji(visualMetrics.mood)}</span>
                </div>
                <Badge className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-white text-orange-600 text-xs">
                  {visualMetrics.energy}%
                </Badge>
              </div>
              <p className="text-sm font-medium text-orange-700">Mood & Energy</p>
            </div>
            
            {/* Streak Counter */}
            <div className="text-center space-y-2">
              <div className="relative">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{visualMetrics.focusStreak}</span>
                </div>
                <Zap className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
              </div>
              <p className="text-sm font-medium text-purple-700">Focus Streak</p>
            </div>
            
            {/* Weekly Wins */}
            <div className="text-center space-y-2">
              <div className="relative">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{visualMetrics.weeklyWins}</span>
                </div>
                <Trophy className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
              </div>
              <p className="text-sm font-medium text-blue-700">This Week's Wins</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Visual Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Need to Know NOW */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-red-200 bg-red-50"
          onClick={() => navigate("/calendar")}
        >
          <CardContent className="p-4 text-center space-y-3">
            <div className="flex items-center justify-between">
              <Clock className="h-5 w-5 text-red-600" />
              <Badge className="bg-red-100 text-red-700">{visualMetrics.upcomingCount}</Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700">{visualMetrics.upcomingCount}</p>
              <p className="text-sm text-red-600">Need Attention NOW</p>
            </div>
            <ArrowRight className="h-4 w-4 text-red-500 mx-auto" />
          </CardContent>
        </Card>

        {/* Overall Progress */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-blue-200 bg-blue-50"
          onClick={() => navigate("/analytics")}
        >
          <CardContent className="p-4 text-center space-y-3">
            <div className="flex items-center justify-between">
              <Target className="h-5 w-5 text-blue-600" />
              {getTrendIcon(visualMetrics.progressScore)}
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">{visualMetrics.progressScore}</p>
              <p className="text-sm text-blue-600">Progress Score</p>
            </div>
            <Progress value={visualMetrics.progressScore} className="h-2" />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-green-200 bg-green-50"
          onClick={() => navigate("/calendar")}
        >
          <CardContent className="p-4 text-center space-y-3">
            <div className="flex items-center justify-between">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <Badge className="bg-green-100 text-green-700">Quick</Badge>
            </div>
            <div>
              <p className="text-lg font-bold text-green-700">Add Action</p>
              <p className="text-sm text-green-600">What needs doing?</p>
            </div>
            <ArrowRight className="h-4 w-4 text-green-500 mx-auto" />
          </CardContent>
        </Card>
      </div>

      {/* Visual Progress Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Focus Visual */}
        <Card className="border-l-4 border-l-green-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-green-700">Today's Focus</h3>
              <span className="text-2xl font-bold text-green-600">{completedActions.length}/{todayActions.length}</span>
            </div>
            <Progress value={completionRate} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">
              {completionRate >= 70 ? "🎉 Great progress!" : 
               completionRate >= 40 ? "💪 Keep going!" : 
               "🌱 Just getting started"}
            </p>
          </CardContent>
        </Card>

        {/* Mood & Energy Visual */}
        <Card className="border-l-4 border-l-orange-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-orange-700">Mood & Energy</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getMoodEmoji(visualMetrics.mood)}</span>
                <span className="text-lg font-bold text-orange-600">{visualMetrics.energy}%</span>
              </div>
            </div>
            <Progress value={visualMetrics.energy} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">
              {visualMetrics.energy >= 70 ? "⚡ High energy day!" : 
               visualMetrics.energy >= 40 ? "🔋 Moderate energy" : 
               "🌙 Low energy - be gentle"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}