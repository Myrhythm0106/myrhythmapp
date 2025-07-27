import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Activity, Users, CheckCircle } from 'lucide-react';
import { useDailyActions } from '@/contexts/DailyActionsContext';
import { Badge } from '@/components/ui/badge';

export function CalendarDashboardIntegration() {
  const { actions, refreshActions } = useDailyActions();

  const calendarLinkedActions = actions.filter(action => action.calendar_event_id);
  const manualActions = actions.filter(action => !action.calendar_event_id);

  const handleSyncNow = async () => {
    await refreshActions();
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Calendar Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">From Calendar</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {calendarLinkedActions.length}
            </div>
            <div className="text-xs text-blue-500">activities</div>
          </div>
          
          <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Manual Entry</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {manualActions.length}
            </div>
            <div className="text-xs text-purple-500">activities</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Recent Calendar Activities</h4>
          {calendarLinkedActions.slice(0, 3).map(action => (
            <div key={action.id} className="flex items-center gap-3 p-2 bg-white rounded border">
              <CheckCircle className={`h-4 w-4 ${action.status === 'completed' ? 'text-green-500' : 'text-gray-400'}`} />
              <div className="flex-1">
                <div className="text-sm font-medium">{action.title}</div>
                <div className="text-xs text-gray-500">{action.start_time}</div>
              </div>
              <Badge variant={action.status === 'completed' ? 'default' : 'secondary'}>
                {action.status}
              </Badge>
            </div>
          ))}
          
          {calendarLinkedActions.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No calendar events synced yet</p>
              <p className="text-xs">Add events to your calendar to see them here</p>
            </div>
          )}
        </div>

        <Button onClick={handleSyncNow} className="w-full" variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Sync Calendar Now
        </Button>

        <div className="text-xs text-center text-gray-500">
          Calendar events automatically appear as dashboard activities
        </div>
      </CardContent>
    </Card>
  );
}