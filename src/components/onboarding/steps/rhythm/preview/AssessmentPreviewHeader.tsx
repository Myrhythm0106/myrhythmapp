
import React from "react";
import { Sparkles } from "lucide-react";
import { UserType } from "../../UserTypeStep";

interface AssessmentPreviewHeaderProps {
  userType?: UserType | null;
}

export function AssessmentPreviewHeader({ userType }: AssessmentPreviewHeaderProps) {
  const getUserTypeDisplay = () => {
    switch (userType) {
      case 'brain-injury': return 'Brain Injury Recovery';
      case 'caregiver': return 'Caregiver Support';
      case 'cognitive-optimization': return 'Cognitive Optimization';
      case 'wellness': return 'General Wellness';
      default: return 'Personal Development';
    }
  };

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-2">
        <Sparkles className="h-6 w-6 text-yellow-500" />
        <h1 className="text-3xl font-bold">Your {getUserTypeDisplay()} Assessment Results</h1>
        <Sparkles className="h-6 w-6 text-yellow-500" />
      </div>
      <p className="text-lg text-muted-foreground">
        We've analyzed your responses and discovered valuable insights about your unique {getUserTypeDisplay().toLowerCase()} journey
      </p>
    </div>
  );
}
