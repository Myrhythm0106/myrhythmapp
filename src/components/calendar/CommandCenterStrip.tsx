import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Bell, ChevronRight, Calendar, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { useDailyActions } from '@/contexts/DailyActionsContext';

interface CommandCenterStripProps {
  selectedDate?: Date;
  onImplementPlan?: () => void;
  onTakeAction?: () => void;
  onViewAll?: (type: 'schedule' | 'priorities' | 'reminders') => void;
}

export function CommandCenterStrip({ 
  selectedDate, 
  onImplementPlan, 
  onTakeAction, 
  onViewAll 
}: CommandCenterStripProps) {
  const { actions } = useDailyActions();
  const today = selectedDate || new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  // Filter today's actions
  const todaysActions = actions.filter(action => action.date === todayStr);
  const upcomingActions = todaysActions
    .filter(action => action.start_time && action.status === 'pending')
    .slice(0, 3);

  // Mock data for priorities and reminders (replace with actual data later)
  const weeklyPriorities = [
    { id: '1', title: 'Complete cognitive exercises', priority: 'high' },
    { id: '2', title: 'Family dinner planning', priority: 'medium' },
    { id: '3', title: 'Weekly review session', priority: 'high' }
  ];

  const upcomingReminders = [
    { id: '1', title: 'Take medication', time: '09:00', type: 'health' },
    { id: '2', title: 'Therapy session prep', time: '14:00', type: 'appointment' },
    { id: '3', title: 'Evening wind-down', time: '20:00', type: 'wellness' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Today's Schedule */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800">Today's Schedule</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onViewAll?.('schedule')}
              className="text-blue-600 hover:bg-blue-100/50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingActions.length > 0 ? (
            upcomingActions.map((action) => (
              <div key={action.id} className="flex items-center gap-3 p-2 bg-white/50 rounded-md">
                <Clock className="h-4 w-4 text-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900 truncate">{action.title}</p>
                  <p className="text-xs text-blue-600">{action.start_time}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-blue-600 mb-2">Your day is open!</p>
              <Button 
                size="sm" 
                onClick={onTakeAction}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Zap className="h-3 w-3 mr-1" />
                Plan Your Day
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Priorities */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span className="text-purple-800">Weekly Priorities</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onViewAll?.('priorities')}
              className="text-purple-600 hover:bg-purple-100/50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weeklyPriorities.map((priority) => (
            <div key={priority.id} className="flex items-center gap-3 p-2 bg-white/50 rounded-md">
              <Badge 
                variant={priority.priority === 'high' ? 'destructive' : 'secondary'}
                className="text-xs px-2 py-0.5"
              >
                {priority.priority}
              </Badge>
              <p className="text-sm font-medium text-purple-900 flex-1 truncate">
                {priority.title}
              </p>
            </div>
          ))}
          <Button 
            size="sm" 
            variant="outline"
            onClick={onImplementPlan}
            className="w-full mt-2 border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            Implement My Plan
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Reminders */}
      <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-green-600" />
              <span className="text-green-800">Upcoming Reminders</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onViewAll?.('reminders')}
              className="text-green-600 hover:bg-green-100/50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingReminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center gap-3 p-2 bg-white/50 rounded-md">
              <Bell className="h-4 w-4 text-green-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-900 truncate">{reminder.title}</p>
                <p className="text-xs text-green-600">{reminder.time}</p>
              </div>
              <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                {reminder.type}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}