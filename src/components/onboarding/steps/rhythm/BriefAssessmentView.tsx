
import React from "react";
import { UserType } from "@/types/user";
import { EnhancedQuickStartAssessment } from "./EnhancedQuickStartAssessment";

interface BriefAssessmentViewProps {
  userType: UserType;
  onComplete: (data: any) => void;
}

export function BriefAssessmentView({ userType, onComplete }: BriefAssessmentViewProps) {
  return (
    <EnhancedQuickStartAssessment 
      userType={userType} 
      onComplete={onComplete} 
    />
  );
}
