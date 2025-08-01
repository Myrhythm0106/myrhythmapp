import React from 'react';
import { MemoryBridgeMainDashboard } from '@/components/memoryBridge/MemoryBridgeMainDashboard';
import { MobileMemoryBridge } from '@/components/memoryBridge/MobileMemoryBridge';
import { useIsMobile } from '@/hooks/use-mobile';

const MemoryBridge = () => {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileMemoryBridge /> : <MemoryBridgeMainDashboard />;
};

export default MemoryBridge;