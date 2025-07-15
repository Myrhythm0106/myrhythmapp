import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserType } from "@/types/user";

interface AssessmentFlowManagerProps {
  userType: UserType;
  onComplete: (data: any) => void;
}

export function AssessmentFlowManager({ userType, onComplete }: AssessmentFlowManagerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState({});

  const handleStepComplete = (stepData: any) => {
    setAssessmentData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => prev + 1);
  };

  const handleComplete = () => {
    onComplete(assessmentData);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Assessment Flow Manager
            </h2>
            <p className="text-gray-600">
              Managing your personalized assessment for {userType} users
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">
              Step {currentStep + 1} of assessment flow
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
