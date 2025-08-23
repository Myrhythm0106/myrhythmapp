import React from 'react';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, Clock, AlertCircle } from 'lucide-react';
import { format, addHours, addDays } from 'date-fns';

interface UpcomingRemindersPanelProps {
  selectedDate: Date;
}

export function UpcomingRemindersPanel({ selectedDate }: UpcomingRemindersPanelProps) {
  // Mock reminders data - in a real app, this would come from a context or API
  const reminders = [
    {
      id: 1,
      title: "Take brain health supplement",
      time: addHours(new Date(), 2),
      type: "Health",
      priority: "high" as const
    },
    {
      id: 2,
      title: "Hydration checkpoint",
      time: addHours(new Date(), 4),
      type: "Wellness", 
      priority: "medium" as const
    },
    {
      id: 3,
      title: "Evening reflection",
      time: addHours(new Date(), 8),
      type: "Mindfulness",
      priority: "medium" as const
    },
    {
      id: 4,
      title: "Weekly goal review",
      time: addDays(new Date(), 1),
      type: "Planning",
      priority: "low" as const
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-sunrise-amber-100 text-sunrise-amber-700 border-sunrise-amber-200';
      case 'low': return 'bg-brain-health-100 text-brain-health-700 border-brain-health-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-3 w-3" />;
      case 'medium': return <Clock className="h-3 w-3" />;
      case 'low': return <Bell className="h-3 w-3" />;
      default: return <Bell className="h-3 w-3" />;
    }
  };

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
            {reminders.length} reminders
          </Badge>
        </div>

        {/* Reminders List */}
        <div className="flex-1 space-y-3">
          {reminders.map((reminder) => (
            <div 
              key={reminder.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border/30 bg-card/50 hover:bg-card transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">
                <div className={`p-1 rounded ${getPriorityColor(reminder.priority)}`}>
                  {getPriorityIcon(reminder.priority)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground mb-1">
                  {reminder.title}
                </h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(reminder.time, 'MMM d')}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(reminder.time, 'h:mm a')}
                  </div>
                </div>
              </div>

              <Badge 
                variant="outline" 
                className="text-xs bg-clarity-teal-50 text-clarity-teal-700 border-clarity-teal-200"
              >
                {reminder.type}
              </Badge>
            </div>
          ))}

          {reminders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/50 mb-3" />
              <h4 className="font-medium text-muted-foreground mb-1">No upcoming reminders</h4>
              <p className="text-xs text-muted-foreground/80">
                You're all caught up for now
              </p>
            </div>
          )}
        </div>
      </div>
    </SurfaceCard>
  );
}