import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, Plus, TrendingUp } from "lucide-react";
import { useDailyActions } from "@/contexts/DailyActionsContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function GoalsOverview() {
  const { goals } = useDailyActions();
  const navigate = useNavigate();

  const activeGoals = goals.filter(goal => goal.status === 'active').slice(0, 4);

  const getCategoryColor = (category?: string) => {
    switch(category) {
      case 'mobility': return 'text-blue-600';
      case 'cognitive': return 'text-purple-600';
      case 'health': return 'text-green-600';
      case 'personal': return 'text-orange-600';
      case 'social': return 'text-pink-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-white/40 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Target className="h-5 w-5 text-primary" />
          Active Goals
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {activeGoals.length} goals
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeGoals.length === 0 ? (
          <div className="text-center py-6">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground mb-4">No active goals yet</p>
            <Button 
              onClick={() => navigate('/goals')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Set Your First Goal
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {activeGoals.map((goal) => (
                <div 
                  key={goal.id}
                  className="p-3 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
                  onClick={() => navigate(`/goals?goalId=${goal.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground truncate">
                        {goal.title}
                      </h4>
                      {goal.category && (
                        <span className={cn("text-xs font-medium", getCategoryColor(goal.category))}>
                          {goal.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <TrendingUp className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-medium text-foreground">
                        {goal.progress_percentage}%
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={goal.progress_percentage} 
                    className="h-2"
                    indicatorClassName={getProgressColor(goal.progress_percentage)}
                  />
                </div>
              ))}
            </div>
            
            <div className="pt-2 border-t border-border">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate('/goals')}
              >
                View All Goals
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}