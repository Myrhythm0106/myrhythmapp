
import React from "react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { AssessmentPreviewHeader } from "./preview/AssessmentPreviewHeader";
import { FocusAreaCard } from "./preview/FocusAreaCard";
import { TeaserInsightsGrid } from "./preview/TeaserInsightsGrid";
import { PaymentCallToAction } from "./preview/PaymentCallToAction";

interface AssessmentResultsPreviewProps {
  assessmentResult: AssessmentResult;
  onPaymentSelect: (option: 'trial' | 'monthly' | 'annual' | 'skip') => void;
}

export function AssessmentResultsPreview({ assessmentResult, onPaymentSelect }: AssessmentResultsPreviewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AssessmentPreviewHeader />
      <FocusAreaCard assessmentResult={assessmentResult} />
      <TeaserInsightsGrid assessmentResult={assessmentResult} />
      <PaymentCallToAction onPaymentSelect={onPaymentSelect} />
    </div>
  );
}
