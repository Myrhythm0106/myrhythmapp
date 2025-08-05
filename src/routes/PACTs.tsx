import React from 'react';
import { PACTDashboard } from '@/components/pacts/PACTDashboard';
import { MainLayout } from '@/components/layout/MainLayout';

const PACTs = () => {
  return (
    <MainLayout>
      <PACTDashboard />
    </MainLayout>
  );
};

export default PACTs;