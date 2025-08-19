import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function RedirectToStart() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if onboarding is completed
    const onboardingCompleted = localStorage.getItem('myrhythm_onboarding_completed') === 'true';
    
    if (!onboardingCompleted) {
      // Preserve any query parameters for analytics
      const searchParams = new URLSearchParams(location.search);
      if (!searchParams.has('source')) {
        searchParams.set('source', 'mvp');
      }
      
      const queryString = searchParams.toString();
      const targetPath = queryString ? `/start?${queryString}` : '/start';
      
      navigate(targetPath, { replace: true });
    } else {
      // If onboarding is completed, redirect to the intended destination
      // For assessment routes, go to the assessment page
      if (location.pathname.includes('assessment')) {
        navigate('/assessment', { replace: true });
      } else {
        // Default to dashboard
        navigate('/dashboard', { replace: true });
      }
    }
  }, [navigate, location]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brain-health-600 mx-auto"></div>
        <p className="text-brain-health-700">Preparing your personalized experience...</p>
      </div>
    </div>
  );
}