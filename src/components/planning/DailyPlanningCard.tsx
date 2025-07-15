
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, Plus, ArrowRight, Star, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface DailyPlanningCardProps {
  todayActions: any[];
  tomorrowActions: any[];
  upcomingEvents: any[];
  onViewCalendar: () => void;
}

export function DailyPlanningCard({ 
  todayActions, 
  tomorrowActions, 
  upcomingEvents, 
  onViewCalendar 
}: DailyPlanningCardProps) {
  const completedToday = todayActions.filter(action => action.status === 'completed').length;
  const nextEvent = upcomingEvents[0];
  const dailyWinsToday = todayActions.filter(action => action.is_daily_win);
  const completedDailyWins = dailyWinsToday.filter(action => action.status === 'completed').length;

  return (
    <Card className="h-full border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-white shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-100/30 to-blue-50/30">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          Today's Journey
        </CardTitle>
        <p className="text-sm text-blue-700 font-medium">Every action builds your strength</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Today's Progress Celebration */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg border border-blue-200">
          <div>
            <p className="font-semibold text-blue-900">Today's Progress</p>
            <p className="text-sm text-blue-700">
              {completedToday} of {todayActions.length} actions completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {todayActions.length > 0 ? Math.round((completedToday / todayActions.length) * 100) : 0}%
            </div>
            {completedDailyWins > 0 && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 mt-1">
                <Star className="h-3 w-3 mr-1" />
                {completedDailyWins} victory{completedDailyWins !== 1 ? 'ies' : 'y'}!
              </Badge>
            )}
          </div>
        </div>

        {/* Next Event Highlight */}
        {nextEvent && (
          <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="font-medium text-amber-900">Coming Up Next</span>
            </div>
            <p className="text-sm font-medium text-amber-800">{nextEvent.title}</p>
            <p className="text-xs text-amber-600">
              {format(new Date(`${nextEvent.date}T${nextEvent.time}`), 'h:mm a')}
            </p>
          </div>
        )}

        {/* Today's Key Actions */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            Today's Key Actions
          </h4>
          {todayActions.slice(0, 3).map((action, index) => (
            <div key={action.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
              <CheckCircle 
                className={`h-4 w-4 flex-shrink-0 ${
                  action.status === 'completed' 
                    ? 'text-green-600' 
                    : 'text-gray-400'
                }`} 
              />
              <div className="flex-1 min-w-0">
                <span className={`text-sm block truncate ${
                  action.status === 'completed' 
                    ? 'line-through text-gray-500' 
                    : 'text-gray-900'
                }`}>
                  {action.title}
                </span>
                {action.is_daily_win && (
                  <Badge className="bg-yellow-100 text-yellow-700 text-xs mt-1">
                    Daily Victory
                  </Badge>
                )}
              </div>
            </div>
          ))}
          {todayActions.length === 0 && (
            <p className="text-sm text-gray-500 italic text-center py-2">
              Ready to plan your day
            </p>
          )}
        </div>

        {/* Tomorrow Preview */}
        {tomorrowActions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 text-sm">Tomorrow's Preview</h4>
            {tomorrowActions.slice(0, 2).map((action) => (
              <div key={action.id} className="flex items-center gap-2 p-2 bg-purple-50 rounded border border-purple-200">
                <div className="h-4 w-4 rounded-full bg-purple-200 flex-shrink-0"></div>
                <span className="text-sm text-purple-900 truncate">{action.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-gray-200">
          <Button variant="outline" size="sm" className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50">
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            onClick={onViewCalendar}
          >
            <ArrowRight className="h-4 w-4 mr-1" />
            Full Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
