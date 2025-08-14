
export type PlatformType = 'mobile' | 'web';

export function detectPlatform(): PlatformType {
  // Check if we're in a Capacitor environment (mobile app)
  if (typeof window !== 'undefined' && (window as any).Capacitor) {
    return 'mobile';
  }
  
  // Check for mobile user agents as fallback
  if (typeof window !== 'undefined' && window.navigator) {
    const userAgent = window.navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    if (mobileRegex.test(userAgent)) {
      return 'mobile';
    }
  }
  
  return 'web';
}

export function isPlatform(platform: PlatformType): boolean {
  return detectPlatform() === platform;
}

export function getOnboardingRoute(): string {
  return '/onboarding';
}

export function getDashboardRoute(): string {
  return '/dashboard';
}
