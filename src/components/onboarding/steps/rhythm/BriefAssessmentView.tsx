
import React from "react";
import { UserType } from "@/types/user";
import { QuickStartAssessment } from "./QuickStartAssessment";

interface BriefAssessmentViewProps {
  userType: UserType;
  onComplete: (data: any) => void;
}

export function BriefAssessmentView({ userType, onComplete }: BriefAssessmentViewProps) {
  return (
    <QuickStartAssessment 
      userType={userType} 
      onComplete={onComplete} 
    />
  );
}
