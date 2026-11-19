import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LaunchWaiting } from '@/components/launch/LaunchWaiting';
import { isPublicPath } from './publicPaths';

/**
 * App-wide gate: beyond the landing page (and sign-in, legal and invite pages)
 * a visitor must be signed in. Signed-out visitors go to sign-in and come back
 * to the page they asked for.
 */
export function SignedInOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (isPublicPath(location.pathname)) return <>{children}</>;

  if (loading) return <LaunchWaiting message="Checking you are signed in…" />;

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
