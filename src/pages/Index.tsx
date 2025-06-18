
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();

  // Show loading while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect based on authentication state
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Not authenticated, redirect to auth page
  return <Navigate to="/auth" replace />;
};

export default Index;
