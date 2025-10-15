import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainInjuryJourneyWelcome } from '@/components/mvp/BrainInjuryJourneyWelcome';

export default function BrainInjuryWelcomePage() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    // Store user type preference
    localStorage.setItem('selected_user_type', 'brain-injury');
    // Navigate to authentication and onboarding
    navigate('/start');
  };

  return <BrainInjuryJourneyWelcome onStartJourney={handleStartJourney} />;
}
