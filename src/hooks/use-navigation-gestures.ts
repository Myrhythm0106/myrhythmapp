
import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from './use-mobile';
import { toast } from 'sonner';

interface NavigationGestureOptions {
  enableBackGesture?: boolean;
  enableSidebarSwipe?: boolean;
  customSwipeActions?: {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
  };
}

export function useNavigationGestures(options: NavigationGestureOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const {
    enableBackGesture = true,
    enableSidebarSwipe = true,
    customSwipeActions
  } = options;

  // Track navigation history for back gesture
  const canGoBack = window.history.length > 1;

  // Handle edge swipe for navigation
  const handleEdgeSwipe = useCallback((event: TouchEvent) => {
    if (!isMobile) return;

    const touch = event.touches[0];
    const screenWidth = window.innerWidth;
    const edgeThreshold = 20;

    // Right edge swipe - back navigation
    if (touch.clientX > screenWidth - edgeThreshold && enableBackGesture && canGoBack) {
      event.preventDefault();
      navigate(-1);
      toast.success("Navigated back", { duration: 1000 });
      return;
    }

    // Left edge swipe - sidebar toggle
    if (touch.clientX < edgeThreshold && enableSidebarSwipe) {
      // Trigger sidebar toggle
      const sidebarToggle = document.querySelector('[data-sidebar-toggle]') as HTMLElement;
      if (sidebarToggle) {
        sidebarToggle.click();
        toast.info("Sidebar toggled", { duration: 1000 });
      }
      return;
    }
  }, [isMobile, navigate, enableBackGesture, enableSidebarSwipe, canGoBack]);

  // Handle full-screen swipe gestures
  const handleSwipeGesture = useCallback((event: TouchEvent) => {
    if (!isMobile || !customSwipeActions) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Only trigger if horizontal swipe is more significant than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
        if (deltaX > 0 && customSwipeActions.onSwipeRight) {
          customSwipeActions.onSwipeRight();
        } else if (deltaX < 0 && customSwipeActions.onSwipeLeft) {
          customSwipeActions.onSwipeLeft();
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, customSwipeActions]);

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

  // Navigation helpers
  const navigateWithGesture = useCallback((path: string, options?: { replace?: boolean }) => {
    navigate(path, options);
    triggerHapticFeedback('light');
    toast.success(`Navigated to ${path}`, { duration: 1000 });
  }, [navigate, triggerHapticFeedback]);

  const goBackWithGesture = useCallback(() => {
    if (canGoBack) {
      navigate(-1);
      triggerHapticFeedback('medium');
      toast.success("Navigated back", { duration: 1000 });
    } else {
      toast.info("No previous page", { duration: 1000 });
    }
  }, [navigate, canGoBack, triggerHapticFeedback]);

  useEffect(() => {
    if (!isMobile) return;

    // Add edge swipe listeners
    document.addEventListener('touchstart', handleEdgeSwipe, { passive: false });

    // Add custom swipe gesture listeners
    const cleanupSwipeGesture = handleSwipeGesture(new TouchEvent('touchstart'));

    return () => {
      document.removeEventListener('touchstart', handleEdgeSwipe);
      if (cleanupSwipeGesture) cleanupSwipeGesture();
    };
  }, [isMobile, handleEdgeSwipe, handleSwipeGesture]);

  return {
    triggerHapticFeedback,
    navigateWithGesture,
    goBackWithGesture,
    canGoBack,
    currentPath: location.pathname,
    isMobileGesturesEnabled: isMobile
  };
}
