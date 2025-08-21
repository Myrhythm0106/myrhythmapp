import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Focus, Target, Sparkles } from 'lucide-react';
import { useWeeklyGoal } from '@/contexts/WeeklyGoalContext';

export function TodaysFocusBanner() {
  const { currentGoal } = useWeeklyGoal();

  if (!currentGoal) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'memory': return Focus;
      case 'rhythm': return Target;
      case 'health': return Sparkles;
      case 'connections': return Target;
      default: return Focus;
    }
  };

  const getCategoryGradient = (category: string) => {
    const gradients = {
      memory: 'from-memory-emerald-500/10 to-brain-health-500/10',
      rhythm: 'from-brain-health-500/10 to-clarity-teal-500/10',
      health: 'from-clarity-teal-500/10 to-sunrise-amber-500/10',
      connections: 'from-sunrise-amber-500/10 to-memory-emerald-500/10'
    };
    return gradients[category as keyof typeof gradients] || gradients.memory;
  };

  const Icon = getCategoryIcon(currentGoal.category);

  return (
    <Card className={`border-memory-emerald-200/50 bg-gradient-to-r ${getCategoryGradient(currentGoal.category)} shadow-sm`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-500">
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-brain-health-900">
              Today's Focus: <span className="text-memory-emerald-700">{currentGoal.theme}</span>
            </p>
            <p className="text-xs text-brain-health-600">
              This supports your weekly goal: "{currentGoal.title}"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}