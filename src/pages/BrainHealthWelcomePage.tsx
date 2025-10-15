import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainHealthWelcome } from '@/components/mvp/BrainHealthWelcome';

export default function BrainHealthWelcomePage() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    localStorage.setItem('selected_user_type', 'brain-health');
    navigate('/start');
  };

  return <BrainHealthWelcome onStartJourney={handleStartJourney} />;
}
