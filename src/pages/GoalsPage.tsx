
import React from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { BrainFriendlyGoalCreator } from '@/components/goals/BrainFriendlyGoalCreator';

export default function GoalsPage() {
  return (
    <PageLayout 
      title="Goals & Progress" 
      description="Set and track your personal goals with our brain-friendly approach"
    >
      <BrainFriendlyGoalCreator />
    </PageLayout>
  );
}
