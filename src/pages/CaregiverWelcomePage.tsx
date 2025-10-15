import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CaregiverWelcome } from '@/components/mvp/CaregiverWelcome';

export default function CaregiverWelcomePage() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    localStorage.setItem('selected_user_type', 'caregiver');
    navigate('/start');
  };

  return <CaregiverWelcome onStartJourney={handleStartJourney} />;
}
