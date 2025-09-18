import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PathSelectionFlow } from '@/components/mvp/PathSelectionFlow';

export default function PathSelectionPage() {
  const navigate = useNavigate();

  const handlePathSelected = (path: 'guided' | 'explorer') => {
    if (path === 'guided') {
      // For guided path, take assessment first then go to guided journey
      navigate('/mvp/assessment-flow?path=guided&next=guided-journey');
    } else {
      // For explorer path, go directly to explorer dashboard
      navigate('/explorer');
    }
  };

  const handleBack = () => {
    navigate('/auth');
  };

  return (
    <PathSelectionFlow 
      onPathSelected={handlePathSelected}
      onBack={handleBack}
    />
  );
}