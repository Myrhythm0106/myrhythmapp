
import React from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { GratitudeDashboard } from '@/components/gratitude/GratitudeDashboard';

export default function GratitudePage() {
  return (
    <PageLayout 
      title="Gratitude Practice" 
      description="Cultivate appreciation and positive mindset through daily gratitude"
    >
      <GratitudeDashboard />
    </PageLayout>
  );
}
