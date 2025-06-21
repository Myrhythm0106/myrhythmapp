
import React, { createContext, useContext, useEffect } from "react";
import { useNavigationGestures } from "@/hooks/use-navigation-gestures";
import { useMobileGestures } from "@/hooks/use-mobile-gestures";
import { useIsMobile } from "@/hooks/use-mobile";

interface SwipeContextType {
  triggerHapticFeedback: (type?: 'light' | 'medium' | 'heavy') => void;
  navigateWithGesture: (path: string, options?: { replace?: boolean }) => void;
  goBackWithGesture: () => void;
  isSwipeEnabled: boolean;
}

const SwipeContext = createContext<SwipeContextType | undefined>(undefined);

export function useSwipeContext() {
  const context = useContext(SwipeContext);
  if (!context) {
    throw new Error('useSwipeContext must be used within a SwipeProvider');
  }
  return context;
}

interface SwipeProviderProps {
  children: React.ReactNode;
  enableGlobalGestures?: boolean;
}

export function SwipeProvider({ children, enableGlobalGestures = true }: SwipeProviderProps) {
  const isMobile = useIsMobile();
  
  const {
    triggerHapticFeedback,
    navigateWithGesture,
    goBackWithGesture
  } = useNavigationGestures({
    enableBackGesture: enableGlobalGestures,
    enableSidebarSwipe: enableGlobalGestures
  });

  // Initialize mobile gestures for global interactions
  useMobileGestures({
    enableEdgeSwipe: enableGlobalGestures,
    enableBackGesture: enableGlobalGestures,
    enableShakeToRefresh: false // Disabled by default for stability
  });

  const contextValue: SwipeContextType = {
    triggerHapticFeedback,
    navigateWithGesture,
    goBackWithGesture,
    isSwipeEnabled: isMobile && enableGlobalGestures
  };

  return (
    <SwipeContext.Provider value={contextValue}>
      {children}
    </SwipeContext.Provider>
  );
}

// Global gesture setup component
export function GlobalSwipeManager() {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;

    // Add global styles for better touch interactions
    document.body.style.touchAction = 'pan-x pan-y';
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    // Prevent default touch behaviors on certain elements
    const preventDefaults = (e: TouchEvent) => {
      // Only prevent defaults on specific gestures, not all touches
      if (e.touches.length > 1) {
        e.preventDefault(); // Prevent zoom
      }
    };

    document.addEventListener('touchstart', preventDefaults, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventDefaults);
      document.body.style.touchAction = '';
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, [isMobile]);

  return null; // This component only sets up global gesture handling
}
