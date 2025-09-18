import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExplorerPathDashboard } from '@/components/shared/ExplorerPathDashboard';

export default function ExplorerPage() {
  const navigate = useNavigate();

  const handleTakeAssessment = () => {
    navigate('/mvp/assessment-flow?path=explorer');
  };

  const handleRequestGuidance = () => {
    navigate('/guided-journey');
  };

  return (
    <ExplorerPathDashboard 
      onTakeAssessment={handleTakeAssessment}
      onRequestGuidance={handleRequestGuidance}
    />
  );
}