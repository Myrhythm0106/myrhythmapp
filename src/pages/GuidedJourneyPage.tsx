import React from 'react';
import { GuidedJourney } from '@/components/guided-journey/GuidedJourney';
import { useNavigate } from 'react-router-dom';
import { AssessmentResult } from '@/utils/rhythmAnalysis';

export default function GuidedJourneyPage() {
  const navigate = useNavigate();

  // Mock assessment result for now - in production, this would come from context or local storage
  const mockAssessmentResult: AssessmentResult = {
    id: 'mock-assessment-1',
    completedAt: new Date().toISOString(),
    overallScore: 2.4,
    sectionScores: [],
    focusArea: 'memory',
    determinationReason: 'Your assessment indicates strong potential in memory organization and structured planning.',
    version: '1.0',
    nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    personalizedData: {
      insights: [],
      personalProfile: {
        rhythmSignature: 'Building Rhythm',
        personalizedMessage: 'Your cognitive patterns show strong potential for memory organization.',
        uniqueCharacteristics: ['Structured thinking', 'Detail-oriented'],
        strengthAreas: ['Memory Organization', 'Planning'],
        growthOpportunities: ['Energy optimization', 'Social connection'],
        nextSteps: ['Set up Memory Bridge', 'Create daily rhythm']
      },
      customDeterminationReason: 'Based on your responses, memory organization is your strongest pathway to recovery.',
      userTypeSpecificMessage: 'Your recovery-focused approach aligns perfectly with structured memory practices.',
      uniqueScoreStory: 'Your assessment reveals a unique pattern of cognitive strengths centered around systematic memory organization.'
    }
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

  return (
    <GuidedJourney 
      assessmentResult={mockAssessmentResult}
      onComplete={handleComplete}
    />
  );
}