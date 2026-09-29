import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LaunchWaiting } from '@/components/launch/LaunchWaiting';

/**
 * Gate for signed-in-only /launch/* surfaces.
 * Signed-out visitors are sent to sign-in and returned to where they were headed.
 */
export function LaunchGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <LaunchWaiting message="Checking you are signed in…" />
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
