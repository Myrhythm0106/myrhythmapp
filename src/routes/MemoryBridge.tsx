import React from 'react';
import MemoryBridgeSimple from './MemoryBridgeSimple';
import { EmpowermentProvider } from '@/contexts/EmpowermentContext';

const MemoryBridge = () => {
  return (
    <EmpowermentProvider>
      <MemoryBridgeSimple />
    </EmpowermentProvider>
  );
};

export default MemoryBridge;