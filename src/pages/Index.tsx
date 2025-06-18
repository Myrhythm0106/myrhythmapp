
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('Index page - user:', !!user, 'loading:', loading);
  }, [user, loading]);

  // Show loading while authentication state is being determined
  if (loading) {
    console.log('Index page showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect based on authentication state
  if (user) {
    console.log('Index page redirecting authenticated user to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // Not authenticated, redirect to auth page
  console.log('Index page redirecting unauthenticated user to auth');
  return <Navigate to="/auth" replace />;
};

export default Index;
