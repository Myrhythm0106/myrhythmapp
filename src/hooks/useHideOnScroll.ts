import { useState, useEffect } from 'react';

interface UseHideOnScrollOptions {
  threshold?: number; // Minimum scroll distance before hiding (px)
  disable?: boolean;  // Disable hide-on-scroll behavior
}

/**
 * Hook to hide/show navbar based on scroll direction
 * 
 * @param options - Configuration options
 * @returns isVisible - Whether navbar should be visible
 */
export function useHideOnScroll(options: UseHideOnScrollOptions = {}) {
  const { threshold = 10, disable = false } = options;
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (disable) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navbar at top of page
      if (currentScrollY < 10) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Check scroll direction
      const scrollingDown = currentScrollY > lastScrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);

      // Only update if scroll delta exceeds threshold
      if (scrollDelta > threshold) {
        setIsVisible(!scrollingDown);
        setLastScrollY(currentScrollY);
      }
    };

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, threshold, disable]);

  return { isVisible };
}
