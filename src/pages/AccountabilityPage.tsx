
import React from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { AccountabilityDashboard } from '@/components/accountability/AccountabilityDashboard';

export default function AccountabilityPage() {
  return (
    <PageLayout 
      title="Accountability Hub" 
      description="Stay on track with reminders, alerts, and support circle check-ins"
    >
      <AccountabilityDashboard />
    </PageLayout>
  );
}
