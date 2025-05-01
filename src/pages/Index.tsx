
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from './Dashboard';
import { TutorialModal } from '@/components/tutorial/TutorialModal';
import { toast } from "sonner";

const Index = () => {
  // In a real app, we would check if a user is authenticated and has completed onboarding
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isNewRegistration, setIsNewRegistration] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    const justRegistered = sessionStorage.getItem('justRegistered');
    
    if (justRegistered === 'true') {
      setIsNewRegistration(true);
      setShowTutorial(true);
      toast.success("Registration successful! Welcome to MyRhythm.", {
        duration: 4000,
      });
      sessionStorage.removeItem('justRegistered');
    }
    else if (!hasVisited) {
      setIsFirstVisit(true);
      // Set flag for tutorial
      setShowTutorial(true);
      // Set the flag in localStorage for future visits
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    if (isNewRegistration) {
      toast("You can access tutorials anytime from the 'Useful Info' section");
    }
  };

  // If it's the first visit, redirect to landing page 
  if (isFirstVisit && !showTutorial && !isNewRegistration) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, show the dashboard
  return (
    <MainLayout>
      <Dashboard />
      <TutorialModal isOpen={showTutorial} onComplete={handleTutorialComplete} />
    </MainLayout>
  );
};

export default Index;
