import React from 'react';
import { isOnboardingCompleted } from '@/utils/onboardingStatus';
import { ThreeStepWarmOnboarding } from '@/components/onboarding/warm/ThreeStepWarmOnboarding';
import { AuthenticationGate } from '@/components/onboarding/AuthenticationGate';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function StartPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Show loading state while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neural-purple-50 to-neural-blue-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-neural-purple-600" />
          <p className="text-neural-indigo-700">Loading...</p>
        </div>
      </div>
    );
  }
  
  const handleAuthSuccess = () => {
    // After authentication, stay on this page - component will re-render
    // and show ThreeStepWarmOnboarding since isOnboardingCompleted() is false
    console.log('StartPage: Authentication successful, showing onboarding');
  };
  
  // STATE 1: Not authenticated → Show authentication gate
  if (!user) {
    return <AuthenticationGate onAuthSuccess={handleAuthSuccess} />;
  }
  
  // STATE 2: Authenticated + onboarding incomplete → Show onboarding
  if (!isOnboardingCompleted()) {
    return <ThreeStepWarmOnboarding />;
  }
  
  // STATE 3: Authenticated + onboarding complete → Redirect to appropriate dashboard
  const chosenPath = localStorage.getItem('myrhythm_chosen_path') as 'guided' | 'explorer' | null;
  console.log('StartPage: User authenticated with completed onboarding, redirecting based on path:', chosenPath);
  
  if (chosenPath === 'guided') {
    navigate('/guided-journey', { replace: true });
  } else if (chosenPath === 'explorer') {
    navigate('/explorer', { replace: true });
  } else {
    // Fallback to memory bridge if no path chosen
    navigate('/memory-bridge', { replace: true });
  }
  
  return null;
}