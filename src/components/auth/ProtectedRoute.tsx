
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getOnboardingRoute } from '@/utils/platform/platformDetection';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user && requireAuth) {
      // Log page access for security monitoring
      console.log(`Protected route accessed: ${location.pathname}`, {
        userId: user.id,
        timestamp: new Date().toISOString(),
        path: location.pathname
      });
    }
  }, [user, location.pathname, requireAuth]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if auth is required and user is not authenticated
  if (requireAuth && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }


  // Check if user needs onboarding (only for dashboard route)
  if (requireAuth && user && location.pathname === '/dashboard') {
    const onboardingComplete = localStorage.getItem('myrhythm_onboarding_complete') === 'true';
    if (!onboardingComplete) {
      return <Navigate to={getOnboardingRoute()} replace />;
    }
  }

  return <>{children}</>;
}
