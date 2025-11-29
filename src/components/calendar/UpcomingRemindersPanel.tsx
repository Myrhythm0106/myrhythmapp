import React from 'react';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useSmartReminders } from '@/hooks/useSmartReminders';

interface UpcomingRemindersPanelProps {
  selectedDate: Date;
}

export function UpcomingRemindersPanel({ selectedDate }: UpcomingRemindersPanelProps) {
  const { upcomingReminders, isLoading } = useSmartReminders();

  const getPriorityColor = (reminderTime: string) => {
    // Map reminder urgency to priority colors
    if (reminderTime.includes('5_minutes') || reminderTime.includes('15_minutes')) {
      return 'bg-red-100 text-red-700 border-red-200';
    }
    if (reminderTime.includes('30_minutes') || reminderTime.includes('1_hour')) {
      return 'bg-sunrise-amber-100 text-sunrise-amber-700 border-sunrise-amber-200';
    }
    return 'bg-brain-health-100 text-brain-health-700 border-brain-health-200';
  };

  const getPriorityIcon = (reminderTime: string) => {
    if (reminderTime.includes('5_minutes') || reminderTime.includes('15_minutes')) {
      return <AlertCircle className="h-3 w-3" />;
    }
    if (reminderTime.includes('30_minutes') || reminderTime.includes('1_hour')) {
      return <Clock className="h-3 w-3" />;
    }
    return <Bell className="h-3 w-3" />;
  };

  const formatReminderTime = (reminderTime: string) => {
    const timeMap: Record<string, string> = {
      '5_minutes_before': '5 min before',
      '15_minutes_before': '15 min before',
      '30_minutes_before': '30 min before',
      '1_hour_before': '1 hour before',
      '1_day_before': '1 day before',
      'morning_of': 'Morning of'
    };
    return timeMap[reminderTime] || reminderTime;
  };

  if (isLoading) {
    return (
      <SurfaceCard variant="subtle" padding="lg" className="h-full">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard variant="subtle" padding="lg" className="h-full">
      <div className="flex flex-col h-full">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-clarity-teal-600" />
            <h3 className="font-semibold text-foreground">Coming Up</h3>
          </div>
          <Badge variant="secondary" className="bg-clarity-teal-100 text-clarity-teal-700">
            {upcomingReminders.length} reminders
          </Badge>
        </div>

        {/* Reminders List */}
        <div className="flex-1 space-y-3 overflow-y-auto">
          {upcomingReminders.map((reminder) => (
            <div 
              key={reminder.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border/30 bg-card/50 hover:bg-card transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">
                <div className={`p-1 rounded ${getPriorityColor(reminder.reminder_time)}`}>
                  {getPriorityIcon(reminder.reminder_time)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground mb-1 truncate">
                  {reminder.calendar_event?.title || 'Reminder'}
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {reminder.calendar_event?.date && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(parseISO(reminder.calendar_event.date), 'MMM d')}
                    </div>
                  )}
                  {reminder.calendar_event?.time && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {reminder.calendar_event.time}
                    </div>
                  )}
                </div>
              </div>

              <Badge 
                variant="outline" 
                className="text-xs bg-clarity-teal-50 text-clarity-teal-700 border-clarity-teal-200 whitespace-nowrap"
              >
                {formatReminderTime(reminder.reminder_time)}
              </Badge>
            </div>
          ))}

          {upcomingReminders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/50 mb-3" />
              <h4 className="font-medium text-muted-foreground mb-1">No upcoming reminders</h4>
              <p className="text-xs text-muted-foreground/80">
                Schedule an action to get reminders
              </p>
            </div>
          )}
        </div>
      </div>
    </SurfaceCard>
  );
}
