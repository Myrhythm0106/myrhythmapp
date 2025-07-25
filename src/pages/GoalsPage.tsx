
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { BrainFriendlyGoalCreator } from '@/components/goals/BrainFriendlyGoalCreator';
import { Button } from '@/components/ui/button';
import { Plus, Target, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useDailyActions } from '@/contexts/DailyActionsContext';

export default function GoalsPage() {
  const [showGoalCreator, setShowGoalCreator] = useState(false);
  const { goals, fetchGoals } = useDailyActions();

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleGoalCreated = (goal: any) => {
    console.log('Goal created:', goal);
    toast.success('Goal created successfully!');
    setShowGoalCreator(false);
    fetchGoals(); // Refresh the goals list
  };

  return (
    <PageLayout 
      title="Goals & Progress" 
      description="Set and track your personal goals with our brain-friendly approach"
    >
      <div className="space-y-6">
        {/* Header with Create Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Your Goals</h2>
            <p className="text-muted-foreground">Track your progress and stay motivated</p>
          </div>
          <Button
            onClick={() => setShowGoalCreator(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Goal
          </Button>
        </div>

        {/* Goals List */}
        {goals.length > 0 ? (
          <div className="grid gap-4">
            {goals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        {goal.description && (
                          <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                        {goal.status === 'completed' ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            {goal.status}
                          </>
                        )}
                      </Badge>
                      {goal.category && (
                        <Badge variant="outline" className="capitalize">
                          {goal.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress_percentage}%</span>
                    </div>
                    <Progress value={goal.progress_percentage} className="h-2" />
                    {goal.target_date && (
                      <p className="text-xs text-muted-foreground">
                        Target: {new Date(goal.target_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Ready to Create Your First Goal?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our brain-friendly approach breaks down goals into manageable steps that build lasting habits and neural pathways.
              </p>
              <Button
                onClick={() => setShowGoalCreator(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Your Goal
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Educational Content */}
        {goals.length === 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Why Our Approach Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Breaks complex goals into brain-friendly steps</li>
                  <li>• Reduces cognitive overwhelm</li>
                  <li>• Builds on neuroplasticity principles</li>
                  <li>• Celebrates small wins to maintain motivation</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Memory1st Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Strengthens memory formation</li>
                  <li>• Improves executive function</li>
                  <li>• Builds confidence through achievable steps</li>
                  <li>• Creates lasting behavioral changes</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <BrainFriendlyGoalCreator
        open={showGoalCreator}
        onOpenChange={setShowGoalCreator}
        onGoalCreated={handleGoalCreated}
      />
    </PageLayout>
  );
}
