
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AssessmentTypeSelection } from "@/components/onboarding/steps/rhythm/AssessmentTypeSelection";
import { BriefAssessmentView } from "@/components/onboarding/steps/rhythm/BriefAssessmentView";
import { RhythmAssessmentView } from "@/components/onboarding/steps/rhythm/RhythmAssessmentView";
import { useAssessmentManager } from "@/hooks/useAssessmentManager";
import { UserType } from "@/types/user";

const Assessment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'brief' | 'comprehensive' | null>(
    (searchParams.get('type') as 'brief' | 'comprehensive') || null
  );
  const [userType] = useState<UserType>('brain-injury'); // Default or get from user context
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
      
      navigate('/dashboard?assessment_complete=true');
    } catch (error) {
      console.error('Failed to save assessment:', error);
      // Still redirect even if save fails
      navigate('/dashboard?assessment_complete=true');
    }
  };

  const handleBack = () => {
    if (selectedType) {
      setSelectedType(null);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={handleBack}
            variant="ghost" 
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {selectedType ? 'Back to Selection' : 'Back to Dashboard'}
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-beacon-600 to-beacon-800 bg-clip-text text-transparent">
              RHYTHM Assessment
            </h1>
            <p className="text-gray-600 mt-2">
              Discover your unique cognitive patterns and optimize your daily life
            </p>
          </div>
        </div>

        {/* Assessment Content */}
        {!selectedType && (
          <AssessmentTypeSelection onSelectType={handleTypeSelection} />
        )}

        {selectedType === 'brief' && (
          <BriefAssessmentView 
            userType={userType} 
            onComplete={handleAssessmentComplete}
          />
        )}

        {selectedType === 'comprehensive' && (
          <RhythmAssessmentView 
            userType={userType} 
            onComplete={handleAssessmentComplete}
          />
        )}
      </div>
    </div>
  );
};

export default Assessment;
