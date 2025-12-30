import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainInjuryJourneyWelcome } from '@/components/mvp/BrainInjuryJourneyWelcome';

export default function BrainInjuryWelcomePage() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    // Store user type preference
    localStorage.setItem('selected_user_type', 'brain-injury');
    // Navigate to the new brain-health friendly registration journey
    navigate('/journey/brain-injury/register');
  };

  return <BrainInjuryJourneyWelcome onStartJourney={handleStartJourney} />;
}
