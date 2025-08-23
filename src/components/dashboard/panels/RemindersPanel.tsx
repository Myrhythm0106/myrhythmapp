import React from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Reminder {
  id: string;
  title: string;
  time: string;
  type: 'medication' | 'appointment' | 'break' | 'hydration' | 'exercise';
  priority: 'high' | 'medium' | 'low';
  isOverdue?: boolean;
}

// Mock reminders data
const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'Take morning supplements',
    time: '9:00 AM',
    type: 'medication',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Physical therapy session',
    time: '2:30 PM',
    type: 'appointment',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Cognitive break - 5 minutes',
    time: '3:15 PM',
    type: 'break',
    priority: 'medium'
  },
  {
    id: '4',
    title: 'Drink water',
    time: '4:00 PM',
    type: 'hydration',
    priority: 'low'
  },
  {
    id: '5',
    title: 'Evening walk',
    time: '6:30 PM',
    type: 'exercise',
    priority: 'medium'
  }
];

export function RemindersPanel() {
  const { filters } = useDashboard();

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-sunrise-amber-500" />;
      default:
        return <Info className="h-4 w-4 text-brain-health-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-sunrise-amber-200 bg-sunrise-amber-50';
      default:
        return 'border-brain-health-200 bg-brain-health-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medication':
        return 'bg-red-100 text-red-700';
      case 'appointment':
        return 'bg-brain-health-100 text-brain-health-700';
      case 'break':
        return 'bg-clarity-teal-100 text-clarity-teal-700';
      case 'hydration':
        return 'bg-blue-100 text-blue-700';
      case 'exercise':
        return 'bg-memory-emerald-100 text-memory-emerald-700';
      default:
        return 'bg-brain-health-100 text-brain-health-700';
    }
  };

  // Filter reminders by priority if filter is set
  const filteredReminders = filters.priorityFilter === 'all' 
    ? mockReminders 
    : mockReminders.filter(r => r.priority === filters.priorityFilter);

  const upcomingReminders = filteredReminders.slice(0, 5);

  return (
    <div className="h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-brain-health-500" />
          <h4 className="font-medium text-sm">Coming Up</h4>
          <Badge variant="secondary" className="text-xs">
            {upcomingReminders.length}
          </Badge>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {upcomingReminders.length > 0 ? (
          upcomingReminders.map((reminder) => (
            <div
              key={reminder.id}
              className={cn(
                "p-3 rounded-lg border transition-all hover:shadow-sm",
                getPriorityColor(reminder.priority)
              )}
            >
              <div className="flex items-center gap-3">
                {getPriorityIcon(reminder.priority)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium text-sm truncate">
                      {reminder.title}
                    </h5>
                    <Badge 
                      variant="secondary"
                      className={cn("text-xs", getTypeColor(reminder.type))}
                    >
                      {reminder.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {reminder.time}
                    {reminder.isOverdue && (
                      <span className="text-destructive font-medium">Overdue</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No upcoming reminders</p>
          </div>
        )}
      </div>

      {/* Filter Options */}
      <div className="pt-3 border-t border-border/30">
        <div className="flex items-center gap-1">
          <Button
            variant={filters.priorityFilter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {/* Update filter */}}
            className="text-xs h-6"
          >
            All
          </Button>
          <Button
            variant={filters.priorityFilter === 'high' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {/* Update filter */}}
            className="text-xs h-6"
          >
            High
          </Button>
          <Button
            variant={filters.priorityFilter === 'medium' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {/* Update filter */}}
            className="text-xs h-6"
          >
            Medium
          </Button>
        </div>
      </div>
    </div>
  );
}