import React from "react";
import { UserType } from "@/types/user";
import { ComprehensiveAssessment } from "./ComprehensiveAssessment";

interface RhythmAssessmentViewProps {
  userType: UserType;
  onComplete: (data: any) => void;
}

export function RhythmAssessmentView({ userType, onComplete }: RhythmAssessmentViewProps) {
  return (
    <ComprehensiveAssessment 
      userType={userType} 
      onComplete={onComplete} 
    />
  );
}
