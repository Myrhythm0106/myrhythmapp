import React from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useWeeklyGoal } from '@/contexts/WeeklyGoalContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle, Circle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GoalsPanel() {
  const { filters } = useDashboard();
  const { currentGoal, goalProgress } = useWeeklyGoal();

  // Enhanced priorities with more inspiring content
  const priorities = [
    { id: '1', title: 'Morning mindfulness ritual', category: 'health', completed: false, impact: 'High', emoji: '🧘' },
    { id: '2', title: 'Cognitive enhancement session', category: 'cognitive', completed: true, impact: 'High', emoji: '🧠' },
    { id: '3', title: 'Energizing movement break', category: 'health', completed: false, impact: 'Medium', emoji: '💪' },
    { id: '4', title: 'Creative problem solving', category: 'cognitive', completed: false, impact: 'High', emoji: '💡' }
  ];
  const completedPriorities = priorities.filter(p => p.completed).length;

  return (
    <div className="h-full space-y-5 relative overflow-hidden">
      {/* Hero Goal Section */}
      {currentGoal ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-beacon-500/20 to-memory-emerald-500/20 flex items-center justify-center neural-pulse">
                <Target className="h-5 w-5 text-beacon-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm therapeutic-accent">Your North Star</h4>
                <p className="text-xs text-muted-foreground/80">Guiding your journey</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold therapeutic-accent">{Math.round(goalProgress)}%</div>
              <div className="text-xs text-muted-foreground">complete</div>
            </div>
          </div>
          
          <div className="relative p-4 rounded-xl bg-gradient-to-br from-beacon-50/80 via-memory-emerald-50/60 to-brain-health-50/40 border border-beacon-200/40 neural-pathway-effect hover-scale transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-xl" />
            <div className="relative">
              <h5 className="font-semibold text-base mb-3 therapeutic-accent">{currentGoal.title}</h5>
              <div className="space-y-2">
                <Progress 
                  value={goalProgress} 
                  className="h-3 therapeutic-progress"
                />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Weekly Progress</span>
                  <span className="font-medium text-beacon-600">{completedPriorities}/{priorities.length} milestones</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-4">
          <div className="relative">
            <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-beacon-100 to-memory-emerald-100 flex items-center justify-center mb-4 neural-pulse">
              <Target className="h-8 w-8 text-beacon-500" />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-beacon-500/20 to-memory-emerald-500/20 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold therapeutic-accent">Ready to Achieve Greatness?</h4>
            <p className="text-sm text-muted-foreground">Set your first goal and watch yourself soar</p>
          </div>
          <Button size="sm" className="therapeutic-button">
            <Plus className="h-4 w-4 mr-2" />
            Create Your Goal
          </Button>
        </div>
      )}

      {/* Priority Actions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-sunrise-amber-400 to-memory-emerald-400" />
          <h4 className="font-semibold text-sm therapeutic-accent">Today's Power Moves</h4>
        </div>
        
        <div className="space-y-3">
          {priorities.map((priority, index) => (
            <div
              key={priority.id}
              className={cn(
                "group flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover-scale",
                priority.completed 
                  ? "bg-gradient-to-r from-memory-emerald-50/80 to-brain-health-50/40 border border-memory-emerald-200/60"
                  : "bg-gradient-to-r from-brain-health-50/60 to-clarity-teal-50/40 border border-brain-health-200/40 hover:border-brain-health-300/60",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="relative">
                  {priority.completed ? (
                    <CheckCircle className="h-5 w-5 text-memory-emerald-600 neural-pulse" />
                  ) : (
                    <Circle className="h-5 w-5 text-brain-health-400 group-hover:text-brain-health-600 transition-colors" />
                  )}
                </div>
                
                <span className="text-lg" role="img" aria-label={priority.title}>
                  {priority.emoji}
                </span>
                
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium text-sm truncate transition-all",
                    priority.completed ? "line-through text-muted-foreground" : "therapeutic-accent"
                  )}>
                    {priority.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/60 text-muted-foreground">
                      {priority.category}
                    </span>
                    <span className={cn(
                      "text-xs font-medium",
                      priority.impact === 'High' ? "text-beacon-600" : "text-brain-health-500"
                    )}>
                      {priority.impact} Impact
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Connection Insight */}
      <div className="pt-4 border-t border-border/20">
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-clarity-teal-50/60 to-brain-health-50/40 border border-clarity-teal-200/40">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-clarity-teal-400 to-brain-health-400 animate-pulse" />
            <span className="text-sm font-medium text-clarity-teal-700">Connected Actions</span>
          </div>
          <Button variant="ghost" size="sm" className="text-xs h-auto py-1 px-2 hover:bg-white/60">
            View Network
          </Button>
        </div>
      </div>

      {/* Floating motivation element */}
      <div className="absolute top-2 right-2 opacity-20 pointer-events-none">
        <div className="text-4xl animate-pulse">🎯</div>
      </div>
    </div>
  );
}