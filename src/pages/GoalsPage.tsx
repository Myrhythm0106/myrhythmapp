
import React, { useState } from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { BrainFriendlyGoalCreator } from '@/components/goals/BrainFriendlyGoalCreator';
import { Button } from '@/components/ui/button';
import { Plus, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function GoalsPage() {
  const [showGoalCreator, setShowGoalCreator] = useState(false);

  const handleGoalCreated = (goal: any) => {
    console.log('Goal created:', goal);
    toast.success('Goal created successfully!');
    setShowGoalCreator(false);
    // TODO: Refresh goals list when implemented
  };

  return (
    <PageLayout 
      title="Goals & Progress" 
      description="Set and track your personal goals with our brain-friendly approach"
    >
      <div className="space-y-6">
        {/* Create Goal CTA */}
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

        {/* Educational Content */}
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
      </div>

      <BrainFriendlyGoalCreator
        open={showGoalCreator}
        onOpenChange={setShowGoalCreator}
        onGoalCreated={handleGoalCreated}
      />
    </PageLayout>
  );
}
