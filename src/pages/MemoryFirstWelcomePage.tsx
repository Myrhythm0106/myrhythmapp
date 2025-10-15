import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MemoryFirstWelcome } from '@/components/mvp/MemoryFirstWelcome';
import { useAuth } from '@/hooks/useAuth';
import { isOnboardingCompleted } from '@/utils/onboardingStatus';

export default function MemoryFirstWelcomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartJourney = () => {
    localStorage.setItem('selected_user_type', 'memory-challenges');
    
    // Check if user is already authenticated and onboarded
    if (user && isOnboardingCompleted()) {
      // Returning user - go directly to dashboard
      navigate('/memory-bridge');
    } else {
      // New user - go through onboarding
      navigate('/start');
    }
  };

  return <MemoryFirstWelcome onStartJourney={handleStartJourney} />;
}
