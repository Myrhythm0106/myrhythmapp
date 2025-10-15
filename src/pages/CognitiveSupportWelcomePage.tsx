import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CognitiveSupportWelcome } from '@/components/mvp/CognitiveSupportWelcome';

export default function CognitiveSupportWelcomePage() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    localStorage.setItem('selected_user_type', 'cognitive-support');
    navigate('/start');
  };

  return <CognitiveSupportWelcome onStartJourney={handleStartJourney} />;
}
