import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function useSessionMonitor() {
  const { session, user } = useAuth();
  const navigate = useNavigate();
  const [isSessionExpiring, setIsSessionExpiring] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (!error && data.session) {
        setIsSessionExpiring(false);
        setIsSessionExpired(false);
        toast.success('Session refreshed successfully! 🔄');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to refresh session:', error);
      return false;
    }
  }, []);

  // Monitor session expiry
  useEffect(() => {
    if (!session?.expires_at) {
      setIsSessionExpired(!user);
      return;
    }

    const checkSession = () => {
      const expiresAt = session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = expiresAt - now;
      
      setTimeRemaining(timeLeft);

      // Session expired
      if (timeLeft <= 0) {
        setIsSessionExpired(true);
        setIsSessionExpiring(false);
        toast.error('Your session has expired. Please sign in again to continue recording.', {
          action: {
            label: 'Sign In',
            onClick: () => navigate('/auth')
          },
          duration: 10000
        });
        return;
      }

      // Warn 5 minutes before expiry
      if (timeLeft < 300 && timeLeft > 0 && !isSessionExpiring) {
        setIsSessionExpiring(true);
        toast.warning('Your session is about to expire. Activity will keep you signed in.', {
          action: {
            label: 'Stay Signed In',
            onClick: refreshSession
          },
          duration: 8000
        });
      }

      // Clear expiring warning if time increases (session was refreshed)
      if (timeLeft > 300 && isSessionExpiring) {
        setIsSessionExpiring(false);
      }
    };

    // Check immediately
    checkSession();

    // Check every 30 seconds
    const interval = setInterval(checkSession, 30000);

    return () => clearInterval(interval);
  }, [session, user, isSessionExpiring, navigate, refreshSession]);

  // Activity-based keepalive
  useEffect(() => {
    if (!session?.expires_at) return;

    let activityTimeout: NodeJS.Timeout;

    const handleActivity = () => {
      // Clear previous timeout
      if (activityTimeout) {
        clearTimeout(activityTimeout);
      }

      // Debounce: only check session 2 seconds after last activity
      activityTimeout = setTimeout(async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.expires_at) {
          const expiresAt = currentSession.expires_at;
          const now = Math.floor(Date.now() / 1000);
          const timeLeft = expiresAt - now;

          // Auto-refresh if less than 15 minutes left
          if (timeLeft < 900 && timeLeft > 0) {
            const refreshed = await refreshSession();
            if (refreshed) {
              console.log('✅ Session auto-refreshed due to activity');
            }
          }
        }
      }, 2000);
    };

    // Listen for user activity
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      if (activityTimeout) {
        clearTimeout(activityTimeout);
      }
    };
  }, [session, refreshSession]);

  const formatTimeRemaining = useCallback((seconds: number) => {
    if (seconds <= 0) return 'Expired';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 60) {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours}h ${remainingMins}m`;
    }
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  }, []);

  return {
    isSessionExpiring,
    isSessionExpired,
    timeRemaining,
    formatTimeRemaining: timeRemaining !== null ? formatTimeRemaining(timeRemaining) : 'Unknown',
    refreshSession
  };
}

