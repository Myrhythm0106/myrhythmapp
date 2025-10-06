import React from 'react';
import { MVPDashboard } from '@/components/mvp/MVPDashboard';
import { EmpowermentProvider } from '@/contexts/EmpowermentContext';

export default function MVPDashboardPage() {
  return (
    <EmpowermentProvider>
      <MVPDashboard />
    </EmpowermentProvider>
  );
}