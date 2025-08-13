
import React from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { GratitudeDashboard } from '@/components/gratitude/GratitudeDashboard';

export default function GratitudePage() {
  return (
    <PageLayout 
      title="Gratitude for Brain Health" 
      description="Strengthen neural pathways through evidence-based gratitude practice with deep 'why' reflection"
    >
      <GratitudeDashboard />
    </PageLayout>
  );
}
