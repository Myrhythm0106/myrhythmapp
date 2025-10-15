import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MedicalProfessionalWelcome } from '@/components/mvp/MedicalProfessionalWelcome';

export default function MedicalProfessionalWelcomePage() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    localStorage.setItem('selected_user_type', 'medical-professional');
    navigate('/start');
  };

  return <MedicalProfessionalWelcome onStartJourney={handleStartJourney} />;
}
