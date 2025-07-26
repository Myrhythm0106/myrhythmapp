import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, Zap, Target } from "lucide-react";
import { useDailyActions } from "@/contexts/DailyActionsContext";

export function TodayQuadrant() {
  const { actions } = useDailyActions();
  
  // Calculate today's metrics
  const completedActions = actions.filter(action => action.status === 'completed').length;
  const totalActions = actions.length;
  const completionRate = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;
  
  // Get top 3 priorities for today
  const topPriorities = actions
    .filter(action => action.status === 'pending')
    .slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-white/80 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{completedActions}</div>
          <div className="text-xs text-blue-700">Completed</div>
        </div>
        <div className="text-center p-3 bg-white/80 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{totalActions - completedActions}</div>
          <div className="text-xs text-blue-700">Remaining</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-blue-700">Today's Progress</span>
          <span className="text-sm text-blue-600">{Math.round(completionRate)}%</span>
        </div>
        <Progress value={completionRate} className="h-3" />
      </div>

      {/* Top Priorities */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Top Priorities</span>
        </div>
        {topPriorities.length > 0 ? (
          <div className="space-y-1">
            {topPriorities.map((action, index) => (
              <div key={action.id} className="flex items-center gap-2 p-2 bg-white/60 rounded border border-blue-200">
                <div className="text-xs font-bold text-blue-600 w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                  {index + 1}
                </div>
                <span className="text-sm text-blue-800 flex-1 truncate">{action.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 text-center">
            <div>
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-blue-700">All done for today! 🎉</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action */}
      <div className="pt-2 border-t border-blue-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
            <Zap className="h-4 w-4" />
            <span>Take action now to build momentum</span>
          </div>
        </div>
      </div>
    </div>
  );
}