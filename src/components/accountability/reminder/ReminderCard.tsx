
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Clock, Calendar, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { AccountabilityReminder } from '@/hooks/use-accountability-system';

interface ReminderCardProps {
  reminder: AccountabilityReminder;
}

export function ReminderCard({ reminder }: ReminderCardProps) {
  const getFrequencyDisplay = (reminder: AccountabilityReminder) => {
    switch (reminder.frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return `Weekly${reminder.reminder_days && reminder.reminder_days.length > 0 
          ? ` (${reminder.reminder_days.map((d: number) => 
              ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]
            ).join(', ')})` 
          : ''}`;
      case 'monthly':
        return 'Monthly';
      case 'once':
        return 'Once';
      default:
        return reminder.frequency;
    }
  };

  const getReminderTypeColor = (type: string) => {
    switch (type) {
      case 'medication': return 'bg-red-100 text-red-800';
      case 'appointment': return 'bg-blue-100 text-blue-800';
      case 'activity': return 'bg-green-100 text-green-800';
      case 'safety': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">{reminder.title}</h3>
              {reminder.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {reminder.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getReminderTypeColor(reminder.reminder_type)}>
                  {reminder.reminder_type}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {reminder.reminder_time} • {getFrequencyDisplay(reminder)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {reminder.escalation_enabled && (
              <Badge variant="outline" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Escalation
              </Badge>
            )}
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(reminder.start_date), 'MMM d')}
              {reminder.end_date && ` - ${format(new Date(reminder.end_date), 'MMM d')}`}
            </div>

            <Switch
              checked={reminder.is_active}
              onCheckedChange={(checked) => {
                // Handle toggle active state
                toast.info('Reminder status updated');
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
