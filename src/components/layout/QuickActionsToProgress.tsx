import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Star, 
  ChevronRight, 
  Target,
  Trophy,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserProgress } from '@/hooks/useUserProgress';

interface QuickActionsProps {
  className?: string;
}

export function QuickActionsToProgress({ className }: QuickActionsProps) {
  const { metrics, trackActionCompletion, trackFeatureUse, getNextUnlock } = useUserProgress();
  const nextUnlock = getNextUnlock();

  const quickActions = [
    {
      id: 'daily-check-in',
      label: 'Daily Check-in',
      points: 5,
      description: 'Log your mood and energy',
      action: () => {
        trackFeatureUse('mood-tracking');
        trackActionCompletion();
      }
    },
    {
      id: 'set-goal',
      label: 'Set a Goal',
      points: 10,
      description: 'Create a new personal goal',
      action: () => {
        trackFeatureUse('goals');
        trackActionCompletion();
      }
    },
    {
      id: 'gratitude-entry',
      label: 'Gratitude Entry',
      points: 8,
      description: 'Write what you\'re grateful for',
      action: () => {
        trackFeatureUse('gratitude');
        trackActionCompletion();
      }
    },
    {
      id: 'brain-training',
      label: 'Brain Training',
      points: 12,
      description: 'Complete a cognitive exercise',
      action: () => {
        trackFeatureUse('brain-games');
        trackActionCompletion();
      }
    }
  ];

  return (
    <Card className={cn("bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200", className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">Quick Actions</span>
          <Badge variant="outline" className="ml-auto text-xs bg-amber-100 text-amber-700">
            +{metrics.readinessScore % 5 === 0 ? 5 : metrics.readinessScore % 5} pts to next level
          </Badge>
        </div>

        <div className="space-y-2 mb-3">
          {quickActions.slice(0, 2).map((action) => (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              className="w-full justify-between h-auto p-2 bg-white/80 hover:bg-white border-amber-200"
              onClick={action.action}
            >
              <div className="text-left">
                <div className="text-xs font-medium">{action.label}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-500" />
                <span className="text-xs font-medium">+{action.points}</span>
              </div>
            </Button>
          ))}
        </div>

        {nextUnlock && (
          <div className="text-center p-2 bg-white/60 rounded border border-amber-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="h-3 w-3 text-amber-600" />
              <span className="text-xs font-medium text-amber-800">Next Unlock</span>
            </div>
            <div className="text-xs text-amber-700">{nextUnlock.description}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}