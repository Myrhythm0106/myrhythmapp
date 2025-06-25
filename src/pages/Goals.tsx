
import React from 'react';
import { EnhancedGoalCreationWizard } from '@/components/goals/EnhancedGoalCreationWizard';

export default function Goals() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Goals</h1>
        <p className="text-muted-foreground">Set and track your personal goals</p>
      </div>
      <EnhancedGoalCreationWizard />
    </div>
  );
}
