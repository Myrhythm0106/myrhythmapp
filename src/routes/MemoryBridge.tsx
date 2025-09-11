import React from 'react';
import { EnhancedMemoryBridgeDashboard } from '@/components/memoryBridge/EnhancedMemoryBridgeDashboard';
import { EmpowermentProvider } from '@/contexts/EmpowermentContext';

const MemoryBridge = () => {
  return (
    <EmpowermentProvider>
      <EnhancedMemoryBridgeDashboard />
    </EmpowermentProvider>
  );
};

export default MemoryBridge;