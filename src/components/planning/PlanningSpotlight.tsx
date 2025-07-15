
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Heart,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlanningData } from "@/hooks/use-planning-data";
import { format } from "date-fns";

export function PlanningSpotlight() {
  const navigate = useNavigate();
  const { data: planningData, isLoading } = usePlanningData();

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!planningData) {
    return (
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
        <CardContent className="p-6 text-center">
          <Sparkles className="h-12 w-12 mx-auto text-primary/50 mb-3" />
          <p className="text-muted-foreground">Planning data will appear here once loaded</p>
        </CardContent>
      </Card>
    );
  }

  const completedToday = planningData.todayActions.filter(action => action.status === 'completed').length;
  const totalToday = planningData.todayActions.length;
  const progressPercentage = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
  
  const dailyWinsToday = planningData.todayActions.filter(action => action.is_daily_win);
  const completedDailyWins = dailyWinsToday.filter(action => action.status === 'completed').length;
  
  const nextEvent = planningData.upcomingEvents[0];
  const topGoal = planningData.weeklyGoals.sort((a, b) => (b.progress_percentage || 0) - (a.progress_percentage || 0))[0];

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-secondary/5 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Your Planning Command Center
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Every step forward is a victory worth celebrating
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Today's Progress Highlight */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Today's Momentum</span>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-300">
              {progressPercentage}% Complete
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-green-700 font-medium">{completedToday} of {totalToday} actions done</p>
              <p className="text-green-600">You're making great progress!</p>
            </div>
            <div>
              <p className="text-green-700 font-medium">{completedDailyWins} daily victory{completedDailyWins !== 1 ? 'ies' : 'y'}</p>
              <p className="text-green-600">Building your strength daily</p>
            </div>
          </div>
        </div>

        {/* Quick Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Next Priority */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Up Next</span>
            </div>
            {nextEvent ? (
              <div>
                <p className="text-sm font-medium text-blue-900">{nextEvent.title}</p>
                <p className="text-xs text-blue-700">
                  {format(new Date(`${nextEvent.date}T${nextEvent.time}`), 'h:mm a')}
                </p>
              </div>
            ) : (
              <p className="text-sm text-blue-700">No upcoming events</p>
            )}
          </div>

          {/* Top Goal */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-purple-800">Leading Goal</span>
            </div>
            {topGoal ? (
              <div>
                <p className="text-sm font-medium text-purple-900 line-clamp-1">{topGoal.title}</p>
                <p className="text-xs text-purple-700">{topGoal.progress_percentage || 0}% progress</p>
              </div>
            ) : (
              <p className="text-sm text-purple-700">Ready to set goals</p>
            )}
          </div>

          {/* Weekly Outlook */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-orange-800">This Week</span>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-900">
                {planningData.thisWeekActions.length} actions planned
              </p>
              <p className="text-xs text-orange-700">Building your rhythm</p>
            </div>
          </div>
        </div>

        {/* Empowering Message */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-5 w-5 text-pink-600" />
            <span className="font-semibold text-pink-800">Your Recovery Journey</span>
          </div>
          <p className="text-sm text-pink-700 mb-3">
            Every action you take is rebuilding your strength and independence. Your brain is remarkable at healing and adapting - trust the process.
          </p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => navigate("/calendar")}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Full Planning View
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/calendar?view=goals")}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <ArrowRight className="h-4 w-4 mr-1" />
              Manage Goals
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
