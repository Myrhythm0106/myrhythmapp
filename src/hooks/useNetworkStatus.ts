import { useState, useEffect } from 'react';
import { toast } from 'sonner';

/**
 * Hook to monitor network connectivity status
 * Shows toast notifications when going online/offline
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      
      // Only show "back online" toast if we were previously offline
      if (wasOffline) {
        toast.success("You're back online", {
          description: "Your connection has been restored",
          duration: 3000,
          className: "bg-gradient-to-r from-memory-emerald-50 to-clarity-teal-50 border-memory-emerald-200",
        });
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      
      toast.error("You're offline", {
        description: "Some features may not work without internet",
        duration: 5000,
        className: "bg-gradient-to-r from-red-50 to-orange-50 border-red-200",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return { isOnline };
}
