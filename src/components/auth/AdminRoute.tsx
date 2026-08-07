import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, LogOut, RefreshCw } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading, signOut } = useAuth();
  const { isAdmin, isLoading, error, retry } = useAdminRole();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
      </div>
    );
  }

  if (!user) {
    const requestedPath = `${location.pathname}${location.search}${location.hash}`;
    return (
      <Navigate
        to={`/auth?redirect=${encodeURIComponent(requestedPath)}`}
        state={{ from: location }}
        replace
      />
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-6">
        <section className="w-full max-w-lg text-center space-y-6" aria-labelledby="access-check-title">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" aria-hidden="true" />
          <div className="space-y-2">
            <h1 id="access-check-title" className="text-2xl font-bold text-foreground">We could not verify access</h1>
            <p className="text-muted-foreground">Your account is signed in, but the founder access check did not complete.</p>
          </div>
          <Button onClick={retry} variant="action" size="lg" className="w-full">
            <RefreshCw aria-hidden="true" />
            Try again
          </Button>
        </section>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-6">
        <section className="w-full max-w-lg text-center space-y-6" aria-labelledby="access-denied-title">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" aria-hidden="true" />
          <div className="space-y-2">
            <h1 id="access-denied-title" className="text-2xl font-bold text-foreground">Founder access required</h1>
            <p className="text-muted-foreground">This account does not have access to the Founder Playbook.</p>
            <p className="font-medium text-foreground break-all">Signed in as {user.email ?? 'this account'}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={() => navigate('/launch/home')} variant="outline" size="lg">
              <Home aria-hidden="true" />
              Return home
            </Button>
            <Button onClick={signOut} variant="action" size="lg">
              <LogOut aria-hidden="true" />
              Switch account
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
