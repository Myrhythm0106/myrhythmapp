
import React from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { RevenueAnalyticsDashboard } from '@/components/analytics/RevenueAnalyticsDashboard';

export default function RevenueAnalyticsPage() {
  return (
    <PageLayout 
      title="Revenue Analytics" 
      description="Comprehensive analytics dashboard for tracking MyRhythm's growth and revenue metrics"
    >
      <RevenueAnalyticsDashboard />
    </PageLayout>
  );
}
