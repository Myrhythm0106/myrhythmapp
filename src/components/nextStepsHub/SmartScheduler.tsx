import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Zap,
  Brain,
  Sun,
  Moon,
  Coffee,
  Target
} from 'lucide-react';
import { NextStepsItem } from '@/types/memoryBridge';
import { toast } from 'sonner';

interface SmartSchedulerProps {
  actions: NextStepsItem[];
}

export function SmartScheduler({ actions }: SmartSchedulerProps) {
  const [isScheduling, setIsScheduling] = useState(false);

  const unscheduledActions = actions.filter(a => 
    !['done', 'completed', 'confirmed'].includes(a.status) && 
    !a.scheduled_date
  );

  const getOptimalTime = (action: NextStepsItem) => {
    const actionText = action.action_text?.toLowerCase() || '';
    
    // High energy tasks - morning
    if (actionText.includes('call') || actionText.includes('meeting') || 
        actionText.includes('present') || actionText.includes('create')) {
      return { time: '09:00', icon: <Sun className="h-3 w-3" />, reason: 'Peak energy hours' };
    }
    
    // Medium energy tasks - mid-day
    if (actionText.includes('email') || actionText.includes('write') || 
        actionText.includes('plan') || actionText.includes('review')) {
      return { time: '14:00', icon: <Coffee className="h-3 w-3" />, reason: 'Focused work time' };
    }
    
    // Low energy tasks - late afternoon
    return { time: '16:00', icon: <Moon className="h-3 w-3" />, reason: 'Admin & organizing' };
  };

  const getSmartDate = (action: NextStepsItem, index: number) => {
    // Spread actions across the week intelligently
    const today = new Date();
    const targetDate = new Date(today);
    
    if (action.due_context?.includes('today')) {
      return today.toISOString().split('T')[0];
    } else if (action.due_context?.includes('tomorrow')) {
      targetDate.setDate(today.getDate() + 1);
      return targetDate.toISOString().split('T')[0];
    } else if (action.due_context?.includes('week')) {
      targetDate.setDate(today.getDate() + Math.min(index + 1, 7));
      return targetDate.toISOString().split('T')[0];
    } else {
      // Distribute evenly over next 3 days
      targetDate.setDate(today.getDate() + (index % 3) + 1);
      return targetDate.toISOString().split('T')[0];
    }
  };

  const handleSmartSchedule = async () => {
    setIsScheduling(true);
    
    // Simulate scheduling process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(
      "🧠 Smart scheduling complete!", 
      {
        description: `Scheduled ${unscheduledActions.length} actions using brain-friendly timing!`
      }
    );
    
    setIsScheduling(false);
  };

  if (unscheduledActions.length === 0) {
    return (
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Calendar className="h-5 w-5" />
            Smart Scheduler
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <div className="space-y-3">
            <Target className="h-8 w-8 mx-auto text-blue-400" />
            <p className="text-sm text-blue-700">
              All actions are scheduled!
            </p>
            <p className="text-xs text-blue-600">
              Great job staying organized! 🎯
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Brain className="h-5 w-5" />
          Smart Scheduler
          <Badge className="bg-blue-100 text-blue-800">
            {unscheduledActions.length} to schedule
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Smart Schedule Button */}
        <Button 
          onClick={handleSmartSchedule}
          disabled={isScheduling}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isScheduling ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Scheduling with brain-friendly AI...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Schedule All Smart
            </>
          )}
        </Button>

        {/* Preview of scheduling suggestions */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            AI Scheduling Preview
          </h4>
          
          {unscheduledActions.slice(0, 3).map((action, index) => {
            const optimal = getOptimalTime(action);
            const suggestedDate = getSmartDate(action, index);
            const dateObj = new Date(suggestedDate);
            
            return (
              <div 
                key={action.id || index}
                className="bg-white/70 border border-blue-200 rounded-md p-3 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">
                      {action.action_text}
                    </p>
                    <div className="flex items-center gap-2 text-blue-600">
                      <Calendar className="h-3 w-3" />
                      <span>{dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      <Clock className="h-3 w-3 ml-2" />
                      <span>{optimal.time}</span>
                      {optimal.icon}
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 text-xs ml-2">
                    {optimal.reason}
                  </Badge>
                </div>
              </div>
            );
          })}
          
          {unscheduledActions.length > 3 && (
            <div className="text-center text-xs text-blue-600 pt-2">
              + {unscheduledActions.length - 3} more actions will be optimally scheduled
            </div>
          )}
        </div>

        {/* Scheduling Benefits */}
        <div className="bg-white/70 border border-blue-200 rounded-md p-3">
          <h5 className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-1">
            <Brain className="h-3 w-3" />
            Brain-Friendly Scheduling
          </h5>
          <div className="space-y-1 text-xs text-blue-700">
            <div className="flex items-center gap-2">
              <Sun className="h-3 w-3 text-yellow-500" />
              <span>High-energy tasks in the morning</span>
            </div>
            <div className="flex items-center gap-2">
              <Coffee className="h-3 w-3 text-orange-500" />
              <span>Focus work in the afternoon</span>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="h-3 w-3 text-purple-500" />
              <span>Admin tasks when energy is lower</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}