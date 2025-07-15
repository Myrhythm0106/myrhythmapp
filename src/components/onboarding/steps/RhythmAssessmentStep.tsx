
import React, { useState } from "react";
import { UserType } from "@/types/user";
import { AssessmentTypeSelection } from "./rhythm/AssessmentTypeSelection";
import { BriefAssessmentView } from "./rhythm/BriefAssessmentView";
import { RhythmAssessmentView } from "./rhythm/RhythmAssessmentView";
import { useAssessmentManager } from "@/hooks/useAssessmentManager";

interface RhythmAssessmentStepProps {
  onComplete: (userType?: UserType) => void;
}

export function RhythmAssessmentStep({ onComplete }: RhythmAssessmentStepProps) {
  const [selectedType, setSelectedType] = useState<'brief' | 'comprehensive' | null>(null);
  const [userType] = useState<UserType>('brain-injury'); // Default or get from context
  const { saveAssessment } = useAssessmentManager();

  const handleTypeSelection = (type: 'brief' | 'comprehensive') => {
    setSelectedType(type);
  };

  const handleAssessmentComplete = async (assessmentData: any) => {
    try {
      await saveAssessment({
        assessmentType: selectedType || 'brief',
        responses: assessmentData.responses,
        recommendations: assessmentData.recommendations,
        completedAt: assessmentData.completedAt,
        userType: assessmentData.userType
      });
      
      onComplete(assessmentData.userType);
    } catch (error) {
      console.error('Failed to save assessment:', error);
      // Still proceed with onboarding even if save fails
      onComplete(assessmentData.userType);
    }
  };

  // Show type selection first
  if (!selectedType) {
    return <AssessmentTypeSelection onSelectType={handleTypeSelection} />;
  }

  // Show appropriate assessment based on selection
  if (selectedType === 'brief') {
    return (
      <BriefAssessmentView 
        userType={userType} 
        onComplete={handleAssessmentComplete}
      />
    );
  }

  return (
    <RhythmAssessmentView 
      userType={userType} 
      onComplete={handleAssessmentComplete}
    />
  );
}
