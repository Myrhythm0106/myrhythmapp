import React from 'react';
import { MemoryBridgeStarterDashboard } from '@/components/memoryBridge/MemoryBridgeStarterDashboard';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';

const MemoryBridge = () => {
  const { extractedActions } = useMemoryBridge();
  
  // For Apple/Nike level experience: start with simplified dashboard
  // Users can unlock full features through engagement
  return <MemoryBridgeStarterDashboard />;
};

export default MemoryBridge;