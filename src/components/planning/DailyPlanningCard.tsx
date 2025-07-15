
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, Plus, ArrowRight } from "lucide-react";
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

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-blue-600" />
          Today's Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's Summary */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div>
            <p className="font-medium text-blue-900">Today's Progress</p>
            <p className="text-sm text-blue-700">
              {completedToday} of {todayActions.length} completed
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {todayActions.length > 0 ? Math.round((completedToday / todayActions.length) * 100) : 0}%
          </div>
        </div>

        {/* Next Event */}
        {nextEvent && (
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="font-medium text-amber-900">Next Event</span>
            </div>
            <p className="text-sm text-amber-800">{nextEvent.title}</p>
            <p className="text-xs text-amber-600">
              {format(new Date(`${nextEvent.date}T${nextEvent.time}`), 'h:mm a')}
            </p>
          </div>
        )}

        {/* Today's Top Priorities */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Today's Priorities</h4>
          {todayActions.slice(0, 3).map((action, index) => (
            <div key={action.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <CheckCircle 
                className={`h-4 w-4 ${
                  action.status === 'completed' 
                    ? 'text-green-600' 
                    : 'text-gray-400'
                }`} 
              />
              <span className={`text-sm ${
                action.status === 'completed' 
                  ? 'line-through text-gray-500' 
                  : 'text-gray-900'
              }`}>
                {action.title}
              </span>
            </div>
          ))}
          {todayActions.length === 0 && (
            <p className="text-sm text-gray-500 italic">No tasks planned for today</p>
          )}
        </div>

        {/* Tomorrow Preview */}
        {tomorrowActions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Tomorrow Preview</h4>
            {tomorrowActions.slice(0, 2).map((action) => (
              <div key={action.id} className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                <div className="h-4 w-4 rounded-full bg-purple-200"></div>
                <span className="text-sm text-purple-900">{action.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="flex-1">
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
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
