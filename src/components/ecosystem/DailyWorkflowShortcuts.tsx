import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  Calendar, 
  MessageCircle, 
  Target,
  Coffee,
  Moon,
  Heart,
  TrendingUp
} from 'lucide-react';

interface DailyWorkflowShortcutsProps {
  timeOfDay: 'morning' | 'afternoon' | 'evening';
}

export function DailyWorkflowShortcuts({ timeOfDay }: DailyWorkflowShortcutsProps) {
  const navigate = useNavigate();

  const getTimeBasedActions = () => {
    switch (timeOfDay) {
      case 'morning':
        return {
          title: 'Morning Startup',
          icon: Coffee,
          actions: [
            {
              title: 'Record Family Planning',
              description: 'Capture breakfast conversation about today\'s goals',
              icon: Mic,
              action: () => navigate('/memory-bridge'),
              color: 'bg-memory-emerald-100 text-memory-emerald-700 border-memory-emerald-200'
            },
            {
              title: 'Review Today\'s Calendar',
              description: 'Check scheduled actions and add new ones',
              icon: Calendar,
              action: () => navigate('/calendar'),
              color: 'bg-brain-health-100 text-brain-health-700 border-brain-health-200'
            },
            {
              title: 'Check Support Messages',
              description: 'See encouraging messages from your partner',
              icon: MessageCircle,
              action: () => navigate('/support-circle'),
              color: 'bg-sunrise-amber-100 text-sunrise-amber-700 border-sunrise-amber-200'
            }
          ]
        };
      
      case 'afternoon':
        return {
          title: 'Midday Momentum',
          icon: TrendingUp,
          actions: [
            {
              title: 'Quick Progress Update',
              description: 'Record how morning actions went',
              icon: Mic,
              action: () => navigate('/memory-bridge'),
              color: 'bg-memory-emerald-100 text-memory-emerald-700 border-memory-emerald-200'
            },
            {
              title: 'Adjust Evening Plans',
              description: 'Update calendar based on progress',
              icon: Calendar,
              action: () => navigate('/calendar'),
              color: 'bg-brain-health-100 text-brain-health-700 border-brain-health-200'
            },
            {
              title: 'Send Partner Update',
              description: 'Share wins and challenges',
              icon: Heart,
              action: () => navigate('/support-circle'),
              color: 'bg-sunrise-amber-100 text-sunrise-amber-700 border-sunrise-amber-200'
            }
          ]
        };
      
      case 'evening':
        return {
          title: 'Evening Reflection',
          icon: Moon,
          actions: [
            {
              title: 'Record Day Review',
              description: 'Capture family discussion about today\'s wins',
              icon: Mic,
              action: () => navigate('/memory-bridge'),
              color: 'bg-memory-emerald-100 text-memory-emerald-700 border-memory-emerald-200'
            },
            {
              title: 'Plan Tomorrow',
              description: 'Schedule tomorrow\'s actions',
              icon: Target,
              action: () => navigate('/calendar'),
              color: 'bg-brain-health-100 text-brain-health-700 border-brain-health-200'
            },
            {
              title: 'Family Check-in',
              description: 'Review support circle and celebrate progress',
              icon: Heart,
              action: () => navigate('/support-circle'),
              color: 'bg-sunrise-amber-100 text-sunrise-amber-700 border-sunrise-amber-200'
            }
          ]
        };
      
      default:
        return {
          title: 'Daily Actions',
          icon: Target,
          actions: []
        };
    }
  };

  const { title, icon: TimeIcon, actions } = getTimeBasedActions();

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { time: 'morning', emoji: '☀️' };
    if (hour < 17) return { time: 'afternoon', emoji: '🌤️' };
    return { time: 'evening', emoji: '🌙' };
  };

  const { time, emoji } = getTimeOfDayGreeting();

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TimeIcon className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {emoji} {time}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => {
          const ActionIcon = action.icon;
          return (
            <div key={index} className="space-y-2">
              <Button
                variant="outline"
                className={`w-full justify-start h-auto p-4 ${action.color}`}
                onClick={action.action}
              >
                <div className="flex items-start space-x-3">
                  <ActionIcon className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div className="text-left space-y-1">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm opacity-80">{action.description}</p>
                  </div>
                </div>
              </Button>
            </div>
          );
        })}
        
        {actions.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-4">
            No specific actions for this time. Check other times of day!
          </p>
        )}
      </CardContent>
    </Card>
  );
}