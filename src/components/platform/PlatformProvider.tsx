
import React, { createContext, useContext, useEffect, useState } from 'react';
import { PlatformType, DeviceType, detectPlatform, detectDeviceType, getDeviceLabel, isTabletDevice, isMobileDevice } from '@/utils/platform/platformDetection';

interface PlatformContextType {
  platform: PlatformType;
  deviceType: DeviceType;
  deviceLabel: string;
  isMobile: boolean;
  isTablet: boolean;
  isWatch: boolean;
  isWeb: boolean;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [platform, setPlatform] = useState<PlatformType>('web');
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    const detectedPlatform = detectPlatform();
    const detectedDeviceType = detectDeviceType();
    setPlatform(detectedPlatform);
    setDeviceType(detectedDeviceType);
    console.log(`Platform detected: ${detectedPlatform}, Device: ${detectedDeviceType}`);
  }, []);

  const value = {
    platform,
    deviceType,
    deviceLabel: getDeviceLabel(),
    isMobile: isMobileDevice(),
    isTablet: isTabletDevice(),
    isWatch: platform === 'watch',
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
