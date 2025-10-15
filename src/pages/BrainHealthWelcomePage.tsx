import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainHealthWelcome } from '@/components/mvp/BrainHealthWelcome';
import { useAuth } from '@/hooks/useAuth';
import { isOnboardingCompleted } from '@/utils/onboardingStatus';

export default function BrainHealthWelcomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartJourney = () => {
    localStorage.setItem('selected_user_type', 'brain-health');
    
    // Check if user is already authenticated and onboarded
    if (user && isOnboardingCompleted()) {
      // Returning user - go directly to dashboard
      navigate('/memory-bridge');
    } else {
      // New user - go through onboarding
      navigate('/start');
    }
  };

  return <BrainHealthWelcome onStartJourney={handleStartJourney} />;
}
