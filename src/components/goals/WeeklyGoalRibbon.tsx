import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Target, Sparkles } from 'lucide-react';
import { useWeeklyGoal, DEFAULT_GOALS } from '@/contexts/WeeklyGoalContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function WeeklyGoalRibbon() {
  const { currentGoal, setCurrentGoal } = useWeeklyGoal();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentGoal) return null;

  const getCategoryColor = (category: string) => {
    const colors = {
      memory: 'from-memory-emerald-500 to-brain-health-500',
      rhythm: 'from-brain-health-500 to-clarity-teal-500', 
      health: 'from-clarity-teal-500 to-sunrise-amber-500',
      connections: 'from-sunrise-amber-500 to-memory-emerald-500'
    };
    return colors[category as keyof typeof colors] || colors.memory;
  };

  return (
    <Card className="border-memory-emerald-200 bg-gradient-to-r from-memory-emerald-50/50 to-brain-health-50/30 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className={`p-2 rounded-full bg-gradient-to-r ${getCategoryColor(currentGoal.category)}`}>
              <Target className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-brain-health-900 text-sm">
                  This Week: {currentGoal.title}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {currentGoal.theme}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Progress 
                  value={currentGoal.progress} 
                  className="h-2 flex-1 bg-memory-emerald-100"
                />
                <span className="text-xs font-medium text-memory-emerald-600">
                  {currentGoal.progress}%
                </span>
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-brain-health-600 hover:bg-brain-health-50"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-memory-emerald-200">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-brain-health-700">
                <Sparkles className="h-4 w-4" />
                <span>Choose your weekly focus:</span>
              </div>
              <Select
                value={currentGoal.id}
                onValueChange={(value) => {
                  const goal = DEFAULT_GOALS.find(g => g.id === value);
                  if (goal) setCurrentGoal(goal);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_GOALS.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      <div className="flex items-center gap-2">
                        <span>{goal.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {goal.theme}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}