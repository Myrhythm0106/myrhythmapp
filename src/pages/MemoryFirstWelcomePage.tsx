import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MemoryFirstWelcome } from '@/components/mvp/MemoryFirstWelcome';

export default function MemoryFirstWelcomePage() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    localStorage.setItem('selected_user_type', 'memory-challenges');
    navigate('/start');
  };

  return <MemoryFirstWelcome onStartJourney={handleStartJourney} />;
}
