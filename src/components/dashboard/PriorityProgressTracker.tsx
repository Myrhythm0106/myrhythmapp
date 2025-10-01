import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { usePriorities } from '@/contexts/PriorityContext';
import { Target, TrendingUp, Calendar, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriorityProgressTrackerProps {
  className?: string;
}

export function PriorityProgressTracker({ className }: PriorityProgressTrackerProps) {
  const {
    dailyPriorities,
    weeklyPriorities,
    monthlyPriorities,
    yearlyPriorities,
    getDailyProgress,
    getWeeklyProgress,
    getMonthlyProgress,
    getYearlyProgress,
    hasAnyPriorities
  } = usePriorities();

  const dailyProgress = getDailyProgress();
  const weeklyProgress = getWeeklyProgress();
  const monthlyProgress = getMonthlyProgress();
  const yearlyProgress = getYearlyProgress();

  const progressLevels = [
    {
      label: 'Today',
      scope: 'daily' as const,
      icon: Target,
      priorities: dailyPriorities,
      progress: dailyProgress,
      gradient: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-50 to-green-50',
      textColor: 'text-emerald-700',
      iconColor: 'text-emerald-600'
    },
    {
      label: 'This Week',
      scope: 'weekly' as const,
      icon: Calendar,
      priorities: weeklyPriorities,
      progress: weeklyProgress,
      gradient: 'from-blue-500 to-indigo-500',
      bgGradient: 'from-blue-50 to-indigo-50',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600'
    },
    {
      label: 'This Month',
      scope: 'monthly' as const,
      icon: TrendingUp,
      priorities: monthlyPriorities,
      progress: monthlyProgress,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      textColor: 'text-purple-700',
      iconColor: 'text-purple-600'
    },
    {
      label: 'This Year',
      scope: 'yearly' as const,
      icon: Star,
      priorities: yearlyPriorities,
      progress: yearlyProgress,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-600'
    }
  ];

  const anyPrioritiesSet = progressLevels.some(level => hasAnyPriorities(level.priorities));

  if (!anyPrioritiesSet) {
    return (
      <Card className={cn("bg-gradient-to-br from-muted/30 to-muted/10 border-dashed", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Target className="h-5 w-5" />
            Priority Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            Set your priorities in the Calendar to track your progress here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-gradient-to-br from-background to-muted/20", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Your Path to Success
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          How today's wins build your yearly vision
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {progressLevels.map((level, index) => {
          const Icon = level.icon;
          const hasPriorities = hasAnyPriorities(level.priorities);
          
          if (!hasPriorities) return null;

          return (
            <div key={level.scope} className="relative">
              {/* Connector line to next level */}
              {index < progressLevels.length - 1 && (
                <div className="absolute left-4 top-12 w-0.5 h-8 bg-gradient-to-b from-muted to-transparent" />
              )}
              
              <div className={cn(
                "rounded-lg p-4 transition-all hover:shadow-md",
                `bg-gradient-to-br ${level.bgGradient}`
              )}>
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "rounded-full p-2 bg-white shadow-sm",
                    level.iconColor
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={cn("font-medium", level.textColor)}>
                        {level.label}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {level.progress.completed}/{level.progress.total}
                      </span>
                    </div>
                    
                    <Progress 
                      value={level.progress.percentage} 
                      className="h-2"
                    />
                    
                    {level.priorities.p1 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground/90">
                          P1: {level.priorities.p1}
                        </p>
                        {level.progress.percentage > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {level.progress.percentage}% complete - Keep going! 🎯
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Motivational message */}
        {yearlyProgress.percentage > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
            <p className="text-sm font-medium text-foreground">
              🌟 Every daily win is {Math.round((dailyProgress.percentage / 365) * 100)}% closer to your yearly vision!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
