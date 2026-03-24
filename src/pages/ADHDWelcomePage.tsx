import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ADHDWelcome } from '@/components/mvp/ADHDWelcome';

export default function ADHDWelcomePage() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    localStorage.setItem('selected_user_type', 'adhd');
    navigate('/launch/register?userType=adhd');
  };

  return <ADHDWelcome onStartJourney={handleStartJourney} />;
}
