import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MedicalProfessionalWelcome } from '@/components/mvp/MedicalProfessionalWelcome';
import { useAuth } from '@/hooks/useAuth';
import { isOnboardingCompleted } from '@/utils/onboardingStatus';

export default function MedicalProfessionalWelcomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartJourney = () => {
    localStorage.setItem('selected_user_type', 'medical-professional');
    
    // Check if user is already authenticated and onboarded
    if (user && isOnboardingCompleted()) {
      // Returning user - go directly to dashboard
      navigate('/memory-bridge');
    } else {
      // New user - go through onboarding
      navigate('/start');
    }
  };

  return <MedicalProfessionalWelcome onStartJourney={handleStartJourney} />;
}
