import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AssessmentToCalendarFlow } from '@/components/onboarding/AssessmentToCalendarFlow';
import { toast } from 'sonner';

interface AssessmentResults {
  answers: Record<string, string>;
  recommendations: string[];
  assessmentType: string;
  isPaid: boolean;
  completedAt: string;
}

export default function AssessmentToCalendarPage() {
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResults | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we should show the flow
    const shouldStartFlow = localStorage.getItem('startAssessmentToCalendarFlow');
    
    if (!shouldStartFlow) {
      navigate('/mvp-assessment-results');
      return;
    }

    // Get assessment results
    const results = localStorage.getItem('lastAssessmentResults');
    if (!results) {
      toast.error('No assessment results found. Please complete the assessment first.');
      navigate('/mvp-assessment');
      return;
    }

    try {
      const parsedResults = JSON.parse(results);
      setAssessmentResults(parsedResults);
    } catch (error) {
      console.error('Error parsing assessment results:', error);
      toast.error('Invalid assessment results. Please retake the assessment.');
      navigate('/mvp-assessment');
    }
  }, [navigate]);

  const handleComplete = () => {
    // Clear the flow flag
    localStorage.removeItem('startAssessmentToCalendarFlow');
    
    // Navigate to calendar or dashboard
    navigate('/calendar');
  };

  if (!assessmentResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50/30 via-brain-health-50/25 to-clarity-teal-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brain-health-600 mx-auto mb-4"></div>
          <p className="text-brain-health-600">Loading your personalized experience...</p>
        </div>
      </div>
    );
  }

  return (
    <AssessmentToCalendarFlow 
      assessmentResults={assessmentResults}
      onComplete={handleComplete}
    />
  );
}