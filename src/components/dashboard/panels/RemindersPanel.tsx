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

// Enhanced reminders with empowering language
const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'Nourish your body with supplements',
    time: '9:00 AM',
    type: 'medication',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Strengthen & restore session',
    time: '2:30 PM',
    type: 'appointment',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Mental reset & recharge',
    time: '3:15 PM',
    type: 'break',
    priority: 'medium'
  },
  {
    id: '4',
    title: 'Hydrate for peak performance',
    time: '4:00 PM',
    type: 'hydration',
    priority: 'low'
  },
  {
    id: '5',
    title: 'Evening energy boost walk',
    time: '6:30 PM',
    type: 'exercise',
    priority: 'medium'
  },
  {
    id: '6',
    title: 'Mindful breathing practice',
    time: '7:00 PM',
    type: 'break',
    priority: 'medium'
  }
];

export function RemindersPanel() {
  const { filters } = useDashboard();

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'medication': return '💊';
      case 'appointment': return '🏥';
      case 'break': return '🧘';
      case 'hydration': return '💧';
      case 'exercise': return '🏃';
      default: return '⏰';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-sunrise-amber-600 neural-pulse" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-brain-health-500" />;
      default:
        return <Info className="h-4 w-4 text-clarity-teal-500" />;
    }
  };

  const getPriorityGradient = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-sunrise-amber-50/80 to-beacon-50/60 border-sunrise-amber-200/60';
      case 'medium':
        return 'bg-gradient-to-r from-brain-health-50/80 to-clarity-teal-50/60 border-brain-health-200/60';
      default:
        return 'bg-gradient-to-r from-clarity-teal-50/60 to-brain-health-50/40 border-clarity-teal-200/40';
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      medication: 'bg-sunrise-amber-100/80 text-sunrise-amber-700 border-sunrise-amber-200',
      appointment: 'bg-beacon-100/80 text-beacon-700 border-beacon-200',
      break: 'bg-clarity-teal-100/80 text-clarity-teal-700 border-clarity-teal-200',
      hydration: 'bg-brain-health-100/80 text-brain-health-700 border-brain-health-200',
      exercise: 'bg-memory-emerald-100/80 text-memory-emerald-700 border-memory-emerald-200',
    };
    return colors[type as keyof typeof colors] || colors.appointment;
  };

  // Filter reminders by priority if filter is set  
  const filteredReminders = mockReminders.slice(0, 6);
  const upcomingReminders = filteredReminders.slice(0, 5);
  const nextReminder = upcomingReminders[0];

  return (
    <div className="h-full space-y-5 relative overflow-hidden">
      {/* Hero Next Reminder */}
      {nextReminder && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brain-health-500/20 to-clarity-teal-500/20 flex items-center justify-center neural-pulse">
              <Bell className="h-5 w-5 text-brain-health-600" />
            </div>
            <div>
              <h4 className="font-semibold text-sm therapeutic-accent">Next Up</h4>
              <p className="text-xs text-muted-foreground/80">Stay on track</p>
            </div>
          </div>
          
          <div className={cn(
            "relative p-4 rounded-xl border neural-pathway-effect hover-scale transition-all duration-300",
            getPriorityGradient(nextReminder.priority)
          )}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-xl" />
            <div className="relative flex items-start gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl" role="img" aria-label={nextReminder.type}>
                  {getTypeEmoji(nextReminder.type)}
                </span>
                {getPriorityIcon(nextReminder.priority)}
              </div>
              
              <div className="flex-1">
                <h5 className="font-semibold text-sm mb-2 therapeutic-accent">
                  {nextReminder.title}
                </h5>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    <span className="font-medium">{nextReminder.time}</span>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={cn("text-xs border", getTypeColor(nextReminder.type))}
                  >
                    {nextReminder.type}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Queue */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-brain-health-400 to-clarity-teal-400" />
          <h4 className="font-semibold text-sm therapeutic-accent">Your Support System</h4>
          <Badge variant="secondary" className="text-xs bg-white/60">
            {upcomingReminders.length - 1} more
          </Badge>
        </div>
        
        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
          {upcomingReminders.slice(1).map((reminder, index) => (
            <div
              key={reminder.id}
              className={cn(
                "group flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover-scale",
                getPriorityGradient(reminder.priority),
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg" role="img" aria-label={reminder.type}>
                  {getTypeEmoji(reminder.type)}
                </span>
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-brain-health-300 to-clarity-teal-300" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate therapeutic-accent">
                  {reminder.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground font-medium">
                    {reminder.time}
                  </span>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full bg-white/60",
                    reminder.priority === 'high' ? "text-sunrise-amber-600" : "text-brain-health-600"
                  )}>
                    {reminder.priority} priority
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Insights */}
      <div className="pt-4 border-t border-border/20">
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-memory-emerald-50/60 to-brain-health-50/40 border border-memory-emerald-200/40">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-memory-emerald-400 to-brain-health-400 animate-pulse" />
            <span className="text-sm font-medium text-memory-emerald-700">Perfect timing for peak performance</span>
          </div>
        </div>
      </div>

      {/* Floating motivation element */}
      <div className="absolute top-2 right-2 opacity-20 pointer-events-none">
        <div className="text-3xl animate-pulse">🔔</div>
      </div>
    </div>
  );
}