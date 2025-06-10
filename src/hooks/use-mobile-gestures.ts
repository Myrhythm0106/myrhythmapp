
import { useEffect, useCallback } from 'react';
import { useIsMobile } from './use-mobile';
import { toast } from 'sonner';

interface MobileGestureOptions {
  enableEdgeSwipe?: boolean;
  enableBackGesture?: boolean;
  enableShakeToRefresh?: boolean;
}

export function useMobileGestures(options: MobileGestureOptions = {}) {
  const isMobile = useIsMobile();
  const {
    enableEdgeSwipe = true,
    enableBackGesture = true,
    enableShakeToRefresh = false
  } = options;

  // Edge swipe detection for navigation
  const handleEdgeSwipe = useCallback((event: TouchEvent) => {
    if (!isMobile || !enableEdgeSwipe) return;

    const touch = event.touches[0];
    const screenWidth = window.innerWidth;
    const edgeThreshold = 20;

    // Left edge swipe
    if (touch.clientX < edgeThreshold) {
      // Could trigger sidebar open
      toast.info("Edge swipe detected", { duration: 1000 });
    }

    // Right edge swipe (back gesture)
    if (touch.clientX > screenWidth - edgeThreshold && enableBackGesture) {
      // Could trigger back navigation
      toast.info("Back gesture detected", { duration: 1000 });
    }
  }, [isMobile, enableEdgeSwipe, enableBackGesture]);

  // Shake to refresh detection
  const handleShake = useCallback((event: DeviceMotionEvent) => {
    if (!isMobile || !enableShakeToRefresh) return;

    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    const threshold = 15;
    const shake = Math.abs(acceleration.x!) + Math.abs(acceleration.y!) + Math.abs(acceleration.z!);

    if (shake > threshold) {
      toast.success("Shake to refresh triggered!", { duration: 2000 });
      // Trigger refresh action
      window.location.reload();
    }
  }, [isMobile, enableShakeToRefresh]);

  // Haptic feedback utility
  const triggerHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator && isMobile) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50]
      };
      navigator.vibrate(patterns[type]);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;

    // Add touch event listeners
    if (enableEdgeSwipe || enableBackGesture) {
      document.addEventListener('touchstart', handleEdgeSwipe, { passive: true });
    }

    // Add motion event listeners
    if (enableShakeToRefresh) {
      window.addEventListener('devicemotion', handleShake, { passive: true });
    }

    return () => {
      document.removeEventListener('touchstart', handleEdgeSwipe);
      window.removeEventListener('devicemotion', handleShake);
    };
  }, [isMobile, handleEdgeSwipe, handleShake, enableEdgeSwipe, enableBackGesture, enableShakeToRefresh]);

  return {
    triggerHapticFeedback,
    isMobileGesturesEnabled: isMobile
  };
}
