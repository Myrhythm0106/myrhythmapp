import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePriorities, TimeScope } from '@/contexts/PriorityContext';
import { ArrowRight, Target, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface PriorityAlignmentCardProps {
  currentTimeframe: TimeScope;
  className?: string;
}

export function PriorityAlignmentCard({ currentTimeframe, className }: PriorityAlignmentCardProps) {
  const navigate = useNavigate();
  const {
    getPrioritiesByScope,
    yearlyPriorities,
    hasAnyPriorities
  } = usePriorities();

  const currentPriorities = getPrioritiesByScope(currentTimeframe);
  const hasCurrentPriorities = hasAnyPriorities(currentPriorities);
  const hasYearlyGoal = hasAnyPriorities(yearlyPriorities);

  if (!hasCurrentPriorities && !hasYearlyGoal) {
    return null;
  }

  const scopeConfig = {
    daily: {
      label: "Today's Priority",
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-50 to-green-50'
    },
    weekly: {
      label: "This Week's Priority",
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50'
    },
    monthly: {
      label: "This Month's Priority",
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    yearly: {
      label: "This Year's Vision",
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-50'
    }
  };

  const config = scopeConfig[currentTimeframe];

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className={cn("h-1 bg-gradient-to-r", config.gradient)} />
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Priority Alignment
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/calendar')}
            className="text-xs"
          >
            <Calendar className="h-3 w-3 mr-1" />
            View Calendar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current timeframe priority */}
        {hasCurrentPriorities && (
          <div className={cn("rounded-lg p-4 bg-gradient-to-br", config.bgGradient)}>
            <Badge variant="secondary" className="mb-2">
              {config.label}
            </Badge>
            <div className="space-y-2">
              {currentPriorities.p1 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">P1 - Top Priority</p>
                  <p className="font-medium text-foreground">{currentPriorities.p1}</p>
                </div>
              )}
              {currentPriorities.p2 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">P2</p>
                  <p className="text-sm text-foreground/80">{currentPriorities.p2}</p>
                </div>
              )}
              {currentPriorities.p3 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">P3</p>
                  <p className="text-sm text-foreground/70">{currentPriorities.p3}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Connection to yearly goal */}
        {hasYearlyGoal && currentTimeframe !== 'yearly' && (
          <>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="rounded-lg p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
              <Badge variant="secondary" className="mb-2 bg-amber-100 text-amber-800">
                Supporting Your Yearly Vision
              </Badge>
              <div className="space-y-2">
                {yearlyPriorities.p1 && (
                  <div>
                    <p className="text-xs font-medium text-amber-700 mb-1">Ultimate Goal</p>
                    <p className="font-medium text-amber-900">{yearlyPriorities.p1}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <p className="text-sm font-medium text-primary">
                Each {currentTimeframe} win gets you closer to your yearly vision! 🎯
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
