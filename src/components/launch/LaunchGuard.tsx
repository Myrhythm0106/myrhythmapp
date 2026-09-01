import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * Gate for signed-in-only /launch/* surfaces.
 * Signed-out visitors are sent to sign-in and returned to where they were headed.
 */
export function LaunchGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60svh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-launch-ink/50" />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/launch/signin"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <>{children}</>;
}
