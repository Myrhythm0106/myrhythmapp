
import React from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { TestingSuite } from '@/components/testing/TestingSuite';

export default function TestingSuitePage() {
  return (
    <PageLayout 
      title="Testing Suite" 
      description="Comprehensive testing dashboard for MyRhythm application quality assurance"
    >
      <TestingSuite />
    </PageLayout>
  );
}
