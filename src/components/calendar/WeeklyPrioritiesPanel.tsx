import React from 'react';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, ChevronRight } from 'lucide-react';
import { useWeeklyGoal } from '@/contexts/WeeklyGoalContext';

interface WeeklyPrioritiesPanelProps {
  onImplementPlan: () => void;
}

export function WeeklyPrioritiesPanel({ onImplementPlan }: WeeklyPrioritiesPanelProps) {
  const { currentGoal, goalProgress } = useWeeklyGoal();

  // Mock priorities data - in a real app, this would come from a context or API
  const priorities = [
    { id: 1, title: "Complete brain health assessment", category: "Health", completed: true },
    { id: 2, title: "Practice mindfulness daily", category: "Wellness", completed: false },
    { id: 3, title: "Organize workspace for focus", category: "Productivity", completed: true },
    { id: 4, title: "Plan healthy meals", category: "Health", completed: false }
  ];

  const completedPriorities = priorities.filter(p => p.completed).length;

  return (
    <SurfaceCard variant="subtle" padding="lg" className="h-full">
      <div className="flex flex-col h-full">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-brain-health-600" />
            <h3 className="font-semibold text-foreground">Weekly Focus</h3>
          </div>
          <Badge variant="secondary" className="bg-brain-health-100 text-brain-health-700">
            {completedPriorities}/{priorities.length}
          </Badge>
        </div>

        {/* Current Goal */}
        {currentGoal && (
          <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 border border-brain-health-200/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-brain-health-600" />
              <span className="text-sm font-medium text-brain-health-700">Current Goal</span>
            </div>
            <h4 className="font-medium text-sm text-foreground mb-2">{currentGoal.title}</h4>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{goalProgress}% complete</span>
              <div className="w-20 h-1.5 bg-brain-health-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 transition-all duration-300"
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Priorities List */}
        <div className="flex-1 space-y-2 mb-4">
          {priorities.map((priority) => (
            <div 
              key={priority.id}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className={`w-2 h-2 rounded-full ${
                priority.completed 
                  ? 'bg-memory-emerald-500' 
                  : 'bg-muted-foreground/30'
              }`} />
              <span className={`flex-1 text-sm ${
                priority.completed 
                  ? 'line-through text-muted-foreground' 
                  : 'text-foreground'
              }`}>
                {priority.title}
              </span>
              <Badge 
                variant="outline" 
                className="text-xs"
              >
                {priority.category}
              </Badge>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <Button
          onClick={onImplementPlan}
          className="w-full bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600 text-white"
        >
          Implement My Plan
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </SurfaceCard>
  );
}