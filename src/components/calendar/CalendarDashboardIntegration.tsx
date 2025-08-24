import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Activity, Users, CheckCircle, Brain, Target, Heart } from 'lucide-react';
import { useDailyActions } from '@/contexts/DailyActionsContext';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useMemoryBank } from '@/hooks/useMemoryBank';
import { useDashboard } from '@/contexts/DashboardContext';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface CalendarChip {
  id: string;
  title: string;
  type: 'action' | 'goal' | 'memory' | 'support';
  color: string;
  time?: string;
}

export function CalendarDashboardIntegration() {
  const { actions, goals, refreshActions } = useDailyActions();
  const { extractedActions } = useMemoryBridge();
  const { memories } = useMemoryBank();
  const { filters, interactionMode } = useDashboard();

  const handleSyncNow = async () => {
    await refreshActions();
  };

  // Generate calendar chips from multiple sources
  const generateCalendarChips = (): CalendarChip[] => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const chips: CalendarChip[] = [];

    // Add actions for today
    const todayActions = actions.filter(action => 
      action.start_time?.includes(today) || 
      format(new Date(action.created_at), 'yyyy-MM-dd') === today
    );

    todayActions.forEach(action => {
      chips.push({
        id: `action-${action.id}`,
        title: action.title,
        type: 'action',
        color: 'bg-blue-500',
        time: action.start_time
      });
    });

    // Add goals with today's target
    const activeGoals = goals.filter(goal => 
      goal.status === 'active' && 
      goal.target_date === today
    );

    activeGoals.forEach(goal => {
      chips.push({
        id: `goal-${goal.id}`,
        title: goal.title,
        type: 'goal',
        color: 'bg-purple-500'
      });
    });

    // Add memory bridge extracted actions (using action_type as title fallback)
    const todayExtracted = extractedActions.filter(action =>
      format(new Date(action.created_at), 'yyyy-MM-dd') === today
    );

    todayExtracted.forEach(action => {
      chips.push({
        id: `memory-${action.id}`,
        title: action.action_type || 'Memory Action',
        type: 'memory',
        color: 'bg-indigo-500'
      });
    });

    return chips.slice(0, 6); // Limit to 6 chips
  };

  const calendarChips = generateCalendarChips();
  const calendarLinkedActions = actions.filter(action => action.calendar_event_id);
  const manualActions = actions.filter(action => !action.calendar_event_id);

  const handleChipClick = (chip: CalendarChip) => {
    const routes = {
      action: interactionMode === 'guided' ? '/calendar?guided=true' : '/calendar',
      goal: interactionMode === 'guided' ? '/goals?guided=true' : '/goals',
      memory: '/memory-bridge',
      support: '/support-circle'
    };

    window.location.href = routes[chip.type];
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Today's Integrated View
          <Badge variant="secondary" className="text-xs bg-memory-emerald-100 text-memory-emerald-700">
            Memory First
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Multi-source calendar chips */}
        {calendarChips.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Brain className="h-4 w-4 text-memory-emerald-500" />
              Today's Memory-Linked Activities
            </h4>
            <div className="flex flex-wrap gap-2">
              {calendarChips.map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => handleChipClick(chip)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-white hover:opacity-80 transition-opacity ${chip.color}`}
                >
                  {chip.type === 'action' && <Activity className="h-3 w-3" />}
                  {chip.type === 'goal' && <Target className="h-3 w-3" />}
                  {chip.type === 'memory' && <Brain className="h-3 w-3" />}
                  {chip.type === 'support' && <Users className="h-3 w-3" />}
                  <span>{chip.title}</span>
                  {chip.time && <span className="opacity-75">{format(new Date(chip.time), 'HH:mm')}</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stats grid */}
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

        {/* Recent activities */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Recent Activities</h4>
          {actions.slice(0, 3).map(action => (
            <div key={action.id} className="flex items-center gap-3 p-2 bg-white rounded border">
              <CheckCircle className={`h-4 w-4 ${action.status === 'completed' ? 'text-green-500' : 'text-gray-400'}`} />
              <div className="flex-1">
                <div className="text-sm font-medium">{action.title}</div>
                <div className="text-xs text-gray-500">{action.start_time || 'No time set'}</div>
              </div>
              <Badge variant={action.status === 'completed' ? 'default' : 'secondary'}>
                {action.status}
              </Badge>
            </div>
          ))}
          
          {actions.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <Heart className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Your day awaits - create your first memory!</p>
              <p className="text-xs">Add activities to start building your memory-first day</p>
            </div>
          )}
        </div>

        <Button onClick={handleSyncNow} className="w-full" variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Sync & Refresh
        </Button>

        <div className="text-xs text-center text-gray-500">
          Integrating calendar, memory, goals, and support circle data
        </div>
      </CardContent>
    </Card>
  );
}