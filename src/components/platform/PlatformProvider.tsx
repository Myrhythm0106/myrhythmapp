
import React, { createContext, useContext, useEffect, useState } from 'react';
import { PlatformType, detectPlatform } from '@/utils/platform/platformDetection';

interface PlatformContextType {
  platform: PlatformType;
  isMobile: boolean;
  isWeb: boolean;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [platform, setPlatform] = useState<PlatformType>('web');

  useEffect(() => {
    const detectedPlatform = detectPlatform();
    setPlatform(detectedPlatform);
    console.log(`Platform detected: ${detectedPlatform}`);
  }, []);

  const value = {
    platform,
    isMobile: platform === 'mobile',
    isWeb: platform === 'web'
  };

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
}
