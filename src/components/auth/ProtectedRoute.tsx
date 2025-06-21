
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SessionSecurity } from '@/utils/security/sessionSecurity';
import { DataProtection } from '@/utils/security/dataProtection';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user && requireAuth) {
      // Update activity on route change
      SessionSecurity.extendSession();
      
      // Log page access for security monitoring
      DataProtection.logSecurityEvent('PAGE_ACCESS', {
        path: location.pathname,
        userId: user.id
      });
    }
  }, [user, location.pathname, requireAuth]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if auth is required and user is not authenticated
  if (requireAuth && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if session has expired
  if (requireAuth && user && SessionSecurity.isSessionExpired()) {
    SessionSecurity.endSession('SESSION_EXPIRED');
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
