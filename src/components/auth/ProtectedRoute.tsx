
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSupportMemberRole } from '@/hooks/use-support-member-role';
import { getOnboardingRoute } from '@/utils/platform/platformDetection';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { isSupportMember, isLoading: supportRoleLoading } = useSupportMemberRole();
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

  // Show loading spinner while checking auth and support role
  if (loading || supportRoleLoading) {
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

  // If user is authenticated and is a support member, redirect to support dashboard
  if (user && isSupportMember && !location.pathname.includes('/support-member-dashboard')) {
    return <Navigate to="/support-member-dashboard" replace />;
  }

  // Check if user needs onboarding (for all protected routes except onboarding routes, memory bridge, and support members)
  if (requireAuth && user && !isSupportMember && !location.pathname.includes('onboarding') && !location.pathname.includes('/memory-bridge')) {
    const onboardingComplete = localStorage.getItem('myrhythm_onboarding_complete') === 'true';
    console.log('Checking onboarding status:', { onboardingComplete, currentPath: location.pathname });
    if (!onboardingComplete) {
      console.log('Redirecting to onboarding:', getOnboardingRoute());
      return <Navigate to={getOnboardingRoute()} replace />;
    }
  }

  return <>{children}</>;
}
