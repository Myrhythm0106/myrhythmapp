
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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
    console.log('ProtectedRoute: Redirecting unauthenticated user to /auth from', location.pathname);
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If user is authenticated and is a support member, redirect to support dashboard
  if (user && isSupportMember && !location.pathname.includes('/support-member-dashboard')) {
    return <Navigate to="/support-member-dashboard" replace />;
  }

  // Check if user needs onboarding (Phase 4: Route guards)
  if (requireAuth && user && !isSupportMember) {
    const onboardingComplete = localStorage.getItem('myrhythm_onboarding_complete') === 'true';
    const chosenPath = localStorage.getItem('myrhythm_chosen_path') as 'guided' | 'explorer' | null;
    
    // If onboarding not complete and not on start page, redirect to /start
    if (!onboardingComplete && !location.pathname.includes('/start') && !location.pathname.includes('/auth')) {
      console.log('ProtectedRoute: User has not completed onboarding, redirecting to /start');
      return <Navigate to="/start" replace />;
    }
    
    // If trying to access guided-journey without choosing guided path
    if (location.pathname.includes('/guided-journey') && chosenPath !== 'guided' && onboardingComplete) {
      console.log('ProtectedRoute: User chose explorer path, redirecting to /explorer');
      return <Navigate to="/explorer" replace />;
    }
    
    // If trying to access explorer without choosing explorer path
    if (location.pathname.includes('/explorer') && chosenPath !== 'explorer' && onboardingComplete) {
      console.log('ProtectedRoute: User chose guided path, redirecting to /guided-journey');
      return <Navigate to="/guided-journey" replace />;
    }
  }

  return <>{children}</>;
}
