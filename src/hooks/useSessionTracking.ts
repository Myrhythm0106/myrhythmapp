import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useSessionTracking() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Track session start for check-in timing
      const sessionStart = localStorage.getItem('myrhythm_session_start');
      if (!sessionStart) {
        localStorage.setItem('myrhythm_session_start', Date.now().toString());
      }
    }
  }, [user]);

  const resetSession = () => {
    localStorage.removeItem('myrhythm_session_start');
  };

  return { resetSession };
}