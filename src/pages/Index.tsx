import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from './Dashboard';

const Index = () => {
  // In a real app, we would check if a user is authenticated and has completed onboarding
  // For now, let's simulate a "first-time" view for demo purposes
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited) {
      setIsFirstVisit(true);
      // Set the flag in localStorage for future visits
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  // If it's the first visit, redirect to onboarding
  if (isFirstVisit) {
    return <Navigate to="/onboarding" replace />;
  }

  // Otherwise, show the dashboard
  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
};

export default Index;
