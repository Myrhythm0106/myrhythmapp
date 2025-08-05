
export type PlatformType = 'mobile' | 'tablet' | 'watch' | 'web';
export type DeviceType = 'phone' | 'ipad' | 'tablet' | 'watch' | 'laptop' | 'desktop';

export function detectPlatform(): PlatformType {
  if (typeof window === 'undefined') return 'web';
  
  // Check if we're in a Capacitor environment (mobile app)
  if ((window as any).Capacitor) {
    return 'mobile';
  }
  
  const userAgent = window.navigator.userAgent;
  
  // Check for watch
  if (/Watch|WatchOS/i.test(userAgent)) {
    return 'watch';
  }
  
  // Check for iPad specifically
  if (/iPad/i.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return 'tablet';
  }
  
  // Check for other mobile devices
  if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return 'mobile';
  }
  
  return 'web';
}

export function detectDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop';
  
  const userAgent = window.navigator.userAgent;
  
  // Check for watch
  if (/Watch|WatchOS/i.test(userAgent)) {
    return 'watch';
  }
  
  // Check for iPad
  if (/iPad/i.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return 'ipad';
  }
  
  // Check for other tablets
  if (/Android.*Tablet|Android.*Tab/i.test(userAgent)) {
    return 'tablet';
  }
  
  // Check for phone
  if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return 'phone';
  }
  
  // Check for laptop vs desktop based on touch capability and screen size
  if (navigator.maxTouchPoints > 0 && window.screen.width < 1366) {
    return 'laptop';
  }
  
  return 'desktop';
}

export function isPlatform(platform: PlatformType): boolean {
  return detectPlatform() === platform;
}

export function getOnboardingRoute(): string {
  const platform = detectPlatform();
  if (platform === 'mobile') return '/onboarding';
  if (platform === 'watch') return '/watch';
  return '/web-onboarding';
}

export function getDashboardRoute(): string {
  return '/dashboard';
}

export function getDeviceLabel(): string {
  const deviceType = detectDeviceType();
  switch (deviceType) {
    case 'watch': return 'Apple Watch';
    case 'ipad': return 'iPad';
    case 'tablet': return 'Tablet';
    case 'phone': return 'Phone';
    case 'laptop': return 'Laptop';
    case 'desktop': return 'Desktop';
    default: return 'Device';
  }
}

export function isTabletDevice(): boolean {
  const deviceType = detectDeviceType();
  return deviceType === 'ipad' || deviceType === 'tablet';
}

export function isMobileDevice(): boolean {
  const deviceType = detectDeviceType();
  return deviceType === 'phone' || deviceType === 'watch';
}
