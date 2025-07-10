
import React from "react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { AssessmentPreviewHeader } from "./preview/AssessmentPreviewHeader";
import { FocusAreaCard } from "./preview/FocusAreaCard";
import { TeaserInsightsGrid } from "./preview/TeaserInsightsGrid";
import { PaymentCallToAction } from "./preview/PaymentCallToAction";
import { UserType } from "../UserTypeStep";

interface AssessmentResultsPreviewProps {
  assessmentResult: AssessmentResult;
  onPaymentSelect: (option: 'trial' | 'monthly' | 'annual' | 'skip') => void;
  userType?: UserType | null;
}

export function AssessmentResultsPreview({ assessmentResult, onPaymentSelect, userType }: AssessmentResultsPreviewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AssessmentPreviewHeader userType={userType} />
      <FocusAreaCard assessmentResult={assessmentResult} />
      <TeaserInsightsGrid assessmentResult={assessmentResult} />
      <PaymentCallToAction onPaymentSelect={onPaymentSelect} />
    </div>
  );
}
