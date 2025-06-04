
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Target, Calendar, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useDailyActions, type DailyAction } from "@/hooks/use-daily-actions";
import { useVictoryTracker } from "@/hooks/use-victory-tracker";

export function TodaysActions() {
  const navigate = useNavigate();
  const { actions, goals, loading, fetchActionsForDate, completeAction, ensureDailyWinExists } = useDailyActions();
  const { updateStreakForDailyWin, streak } = useVictoryTracker();
  const [completingAction, setCompletingAction] = useState<string | null>(null);

  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    fetchActionsForDate(today);
    ensureDailyWinExists(today);
  }, [today]);

  const handleActionComplete = async (action: DailyAction) => {
    try {
      setCompletingAction(action.id);
      await completeAction(action.id);
      
      // Update streak if it's a daily win
      if (action.is_daily_win) {
        await updateStreakForDailyWin(today);
      }
    } catch (error) {
      console.error("Failed to complete action:", error);
    } finally {
      setCompletingAction(null);
    }
  };

  const handleActionClick = (action: DailyAction) => {
    if (action.goal_id) {
      navigate(`/calendar/goal/${action.goal_id}`);
    } else {
      navigate(`/calendar?actionId=${action.id}`);
    }
  };

  const handleCardClick = () => {
    navigate("/calendar?view=goals");
  };

  const getActionTypeStyles = (type: string, isDailyWin: boolean) => {
    if (isDailyWin) {
      return "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border-amber-300";
    }
    
    switch (type) {
      case "goal_linked": return "bg-purple-100 text-purple-800 border-purple-300";
      case "routine": return "bg-blue-100 text-blue-800 border-blue-300";
      case "appointment": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getGoalTitle = (goalId?: string) => {
    const goal = goals.find(g => g.id === goalId);
    return goal?.title || "Unknown Goal";
  };

  const pendingActions = actions.filter(action => action.status === "pending");
  const completedActions = actions.filter(action => action.status === "completed");
  const dailyWins = pendingActions.filter(action => action.is_daily_win);
  const regularActions = pendingActions.filter(action => !action.is_daily_win);

  if (loading) {
    return (
      <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Do
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="hover:shadow-md transition-shadow border-l-4 border-l-primary cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Do
          </CardTitle>
          {streak && streak.current_streak > 0 && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              🔥 {streak.current_streak} day streak
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Your daily steps toward victory
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4" onClick={(e) => e.stopPropagation()}>
        {/* Daily Wins Section */}
        {dailyWins.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-amber-700 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Today's Victory (Required):
            </h4>
            {dailyWins.map((action) => (
              <div 
                key={action.id}
                className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-amber-200 rounded-lg cursor-pointer hover:from-yellow-100 hover:to-amber-100 transition-colors"
                onClick={() => handleActionClick(action)}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActionComplete(action);
                    }}
                    disabled={completingAction === action.id}
                    className="w-6 h-6 rounded border-2 border-amber-500 hover:bg-amber-500 hover:text-white transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    {completingAction === action.id ? (
                      <div className="w-3 h-3 border border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <p className="font-medium text-amber-900 text-sm">{action.title}</p>
                    
                    <div className="flex items-center gap-2 mt-1">
                      {action.start_time && (
                        <div className="flex items-center gap-1 text-xs text-amber-700">
                          <Clock className="h-3 w-3" />
                          {action.start_time}
                          {action.duration_minutes && ` (${action.duration_minutes} min)`}
                        </div>
                      )}
                    </div>
                    
                    {action.goal_id && (
                      <div className="flex items-center gap-1 mt-2 bg-amber-100 px-2 py-1 rounded text-xs">
                        <Target className="h-3 w-3 text-amber-600" />
                        <span className="text-amber-700 font-medium">
                          Goal: {getGoalTitle(action.goal_id)}
                        </span>
                      </div>
                    )}
                  </div>

                  <Badge className="bg-gradient-to-r from-yellow-200 to-amber-200 text-amber-800 border-amber-300" variant="outline">
                    Daily Win ⭐
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Regular Actions Section */}
        {regularActions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Additional Actions:</h4>
            {regularActions.map((action) => (
              <div 
                key={action.id}
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleActionClick(action)}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActionComplete(action);
                    }}
                    disabled={completingAction === action.id}
                    className="w-6 h-6 rounded border-2 border-primary hover:bg-primary hover:text-white transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    {completingAction === action.id ? (
                      <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{action.title}</p>
                    
                    <div className="flex items-center gap-2 mt-1">
                      {action.start_time && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="h-3 w-3" />
                          {action.start_time}
                          {action.duration_minutes && ` (${action.duration_minutes} min)`}
                        </div>
                      )}
                    </div>
                    
                    {action.goal_id && (
                      <div className="flex items-center gap-1 mt-2 bg-primary/10 px-2 py-1 rounded text-xs">
                        <Target className="h-3 w-3 text-primary" />
                        <span className="text-primary font-medium">
                          Goal: {getGoalTitle(action.goal_id)}
                        </span>
                      </div>
                    )}
                  </div>

                  <Badge className={cn("text-xs", getActionTypeStyles(action.action_type, action.is_daily_win))} variant="outline">
                    {action.action_type.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Actions Section */}
        {completedActions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-green-700">Completed Today:</h4>
            {completedActions.slice(0, 3).map((action) => (
              <div 
                key={action.id}
                className="p-3 bg-green-50 border border-green-200 rounded-lg opacity-75"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-green-500 text-white flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium text-green-900 text-sm line-through">{action.title}</p>
                    {action.is_daily_win && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-700 font-medium">Daily Victory Complete!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {completedActions.length > 3 && (
              <p className="text-xs text-green-600 text-center">
                +{completedActions.length - 3} more completed actions
              </p>
            )}
          </div>
        )}

        {actions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No actions for today yet</p>
            <p className="text-xs mt-1">We'll create your daily win automatically!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
