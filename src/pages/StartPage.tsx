import React from 'react';
import { isOnboardingCompleted } from '@/utils/onboardingStatus';
import { ThreeStepWarmOnboarding } from '@/components/onboarding/warm/ThreeStepWarmOnboarding';
import { AuthenticationGate } from '@/components/onboarding/AuthenticationGate';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function StartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleAuthSuccess = () => {
    // After successful authentication, check onboarding status
    if (!isOnboardingCompleted()) {
      // User is authenticated but hasn't completed onboarding - stay on this page
      // The component will re-render and show ThreeStepWarmOnboarding
      return;
    } else {
      // User has completed onboarding, redirect to memory bridge
      navigate('/memory-bridge');
    }
  };
  
  // If user is not authenticated, show authentication gate
  if (!user) {
    return <AuthenticationGate onAuthSuccess={handleAuthSuccess} />;
  }
  
  // If user is authenticated but hasn't completed onboarding, show onboarding
  if (!isOnboardingCompleted()) {
    return <ThreeStepWarmOnboarding />;
  }
  
  // If user has completed onboarding, redirect to memory bridge
  React.useEffect(() => {
    if (isOnboardingCompleted()) {
      navigate('/memory-bridge', { replace: true });
    }
  }, [navigate]);
  
  return null;
}