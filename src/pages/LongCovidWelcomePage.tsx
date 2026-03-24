import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LongCovidWelcome } from '@/components/mvp/LongCovidWelcome';

export default function LongCovidWelcomePage() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    localStorage.setItem('selected_user_type', 'long-covid');
    navigate('/launch/register?userType=long-covid');
  };

  return <LongCovidWelcome onStartJourney={handleStartJourney} />;
}
