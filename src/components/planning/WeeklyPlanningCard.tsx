
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Calendar, ArrowRight, Trophy, Heart } from "lucide-react";
import { format, startOfWeek, endOfWeek } from "date-fns";

interface WeeklyPlanningCardProps {
  weeklyGoals: any[];
  thisWeekActions: any[];
  onViewGoals: () => void;
}

export function WeeklyPlanningCard({ 
  weeklyGoals, 
  thisWeekActions, 
  onViewGoals 
}: WeeklyPlanningCardProps) {
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const completedThisWeek = thisWeekActions.filter(action => action.status === 'completed').length;
  const totalThisWeek = thisWeekActions.length;

  // Sort goals by progress to highlight top performers
  const sortedGoals = [...weeklyGoals].sort((a, b) => (b.progress_percentage || 0) - (a.progress_percentage || 0));

  return (
    <Card className="h-full border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-white shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4 bg-gradient-to-r from-green-100/30 to-emerald-50/30">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
            <Target className="h-4 w-4 text-white" />
          </div>
          This Week's Focus
        </CardTitle>
        <p className="text-sm text-green-700 font-medium">Building your future, step by step</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Week Overview */}
        <div className="text-center p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200">
          <p className="text-sm text-green-700 mb-2 font-medium">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
          </p>
          <div className="flex items-center justify-center gap-6">
            <div>
              <p className="text-2xl font-bold text-green-600">{completedThisWeek}</p>
              <p className="text-xs text-green-700">Completed</p>
            </div>
            <div className="w-px h-8 bg-green-300"></div>
            <div>
              <p className="text-2xl font-bold text-green-600">{totalThisWeek}</p>
              <p className="text-xs text-green-700">Total Tasks</p>
            </div>
          </div>
        </div>

        {/* Leading Goals */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-green-500" />
            Your Leading Goals
          </h4>
          {sortedGoals.slice(0, 3).map((goal) => (
            <div key={goal.id} className="p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 text-sm truncate flex-1">{goal.title}</span>
                <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                  {goal.progress_percentage || 0}%
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    (goal.progress_percentage || 0) >= 75 ? 'bg-green-500' :
                    (goal.progress_percentage || 0) >= 50 ? 'bg-blue-500' :
                    (goal.progress_percentage || 0) >= 25 ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${goal.progress_percentage || 0}%` }}
                ></div>
              </div>
              {(goal.progress_percentage || 0) >= 75 && (
                <p className="text-xs text-green-600 font-medium">Almost there! 🌟</p>
              )}
            </div>
          ))}
          {weeklyGoals.length === 0 && (
            <div className="text-center py-4">
              <Target className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500 italic">Ready to set meaningful goals</p>
            </div>
          )}
        </div>

        {/* Weekly Rhythm Insight */}
        <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-purple-900">Your Recovery Rhythm</span>
          </div>
          <p className="text-sm text-purple-800">
            {totalThisWeek > 0 
              ? `You're building consistency with ${Math.round(totalThisWeek / 7)} daily actions on average`
              : "Ready to create your healing routine"
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-gray-200">
          <Button variant="outline" size="sm" className="flex-1 border-green-300 text-green-700 hover:bg-green-50">
            <Target className="h-4 w-4 mr-1" />
            New Goal
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            onClick={onViewGoals}
          >
            <ArrowRight className="h-4 w-4 mr-1" />
            View Goals
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
