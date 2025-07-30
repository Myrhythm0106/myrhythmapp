import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, Zap, Target, Brain } from "lucide-react";
import { useDailyActions } from "@/contexts/DailyActionsContext";
import { QuickDecisionWidget } from "@/components/decisions/QuickDecisionWidget";

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
      {/* Quick Stats - Compact */}
      <div className="flex gap-4 justify-center">
        <div className="text-center">
          <div className="text-xl font-bold text-blue-600">{completedActions}</div>
          <div className="text-xs text-blue-700">Done</div>
        </div>
        <div className="w-px bg-blue-200"></div>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-600">{totalActions - completedActions}</div>
          <div className="text-xs text-blue-700">Left</div>
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

      {/* Top Priorities - Compact */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Next Up</span>
        </div>
        {topPriorities.length > 0 ? (
          <div className="space-y-1">
            {topPriorities.slice(0, 2).map((action, index) => (
              <div key={action.id} className="flex items-center gap-2 p-1.5 bg-white/60 rounded text-xs">
                <div className="text-xs font-bold text-blue-600 w-3 h-3 rounded-full bg-blue-100 flex items-center justify-center text-[10px]">
                  {index + 1}
                </div>
                <span className="text-blue-800 flex-1 truncate">{action.title}</span>
              </div>
            ))}
            {topPriorities.length > 2 && (
              <div className="text-xs text-blue-600 text-center">+{topPriorities.length - 2} more</div>
            )}
          </div>
        ) : (
          <div className="text-center py-2">
            <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-1" />
            <p className="text-xs text-blue-700">All done! 🎉</p>
          </div>
        )}
      </div>

      {/* Decision Widget */}
      <div className="pt-2 border-t border-blue-200">
        <QuickDecisionWidget />
      </div>

      {/* Encouragement - Compact */}
      <div className="pt-2 border-t border-blue-200">
        <div className="flex items-center justify-center gap-2 text-xs text-blue-600">
          <Zap className="h-3 w-3" />
          <span>Keep going! 💪</span>
        </div>
      </div>
    </div>
  );
}