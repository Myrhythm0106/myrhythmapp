import React from "react";
import { UserType } from "@/types/user";
import { EnhancedComprehensiveAssessment } from "./EnhancedComprehensiveAssessment";

interface RhythmAssessmentViewProps {
  userType: UserType;
  onComplete: (data: any) => void;
}

export function RhythmAssessmentView({ userType, onComplete }: RhythmAssessmentViewProps) {
  return (
    <EnhancedComprehensiveAssessment 
      userType={userType} 
      onComplete={onComplete} 
    />
  );
}
