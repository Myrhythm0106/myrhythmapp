
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Calendar, ArrowRight } from "lucide-react";
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

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-green-600" />
          This Week's Focus
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Week Overview */}
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700 mb-1">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
          </p>
          <div className="flex items-center justify-center gap-4">
            <div>
              <p className="text-2xl font-bold text-green-600">{completedThisWeek}</p>
              <p className="text-xs text-green-700">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{totalThisWeek}</p>
              <p className="text-xs text-green-700">Total Tasks</p>
            </div>
          </div>
        </div>

        {/* Active Goals */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Active Goals</h4>
          {weeklyGoals.slice(0, 3).map((goal) => (
            <div key={goal.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{goal.title}</span>
                <Badge variant="outline" className="text-xs">
                  {goal.progress_percentage || 0}%
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${goal.progress_percentage || 0}%` }}
                ></div>
              </div>
            </div>
          ))}
          {weeklyGoals.length === 0 && (
            <p className="text-sm text-gray-500 italic">No active goals set</p>
          )}
        </div>

        {/* Weekly Rhythm */}
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-purple-900">Weekly Rhythm</span>
          </div>
          <p className="text-sm text-purple-800">
            {totalThisWeek > 0 
              ? `Averaging ${Math.round(totalThisWeek / 7)} tasks per day this week`
              : "Ready to plan your week ahead"
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="flex-1">
            <Target className="h-4 w-4 mr-1" />
            New Goal
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
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
