import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MSCognitiveWelcome } from '@/components/mvp/MSCognitiveWelcome';

export default function MSCognitiveWelcomePage() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    localStorage.setItem('selected_user_type', 'ms-cognitive');
    navigate('/launch/register?userType=ms-cognitive');
  };

  return <MSCognitiveWelcome onStartJourney={handleStartJourney} />;
}
