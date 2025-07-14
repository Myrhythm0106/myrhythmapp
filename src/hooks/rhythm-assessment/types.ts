
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";
import { AssessmentResponses } from "@/components/onboarding/steps/rhythm/rhythmAssessmentData";

export interface UseRhythmAssessmentReturn {
  hasStarted: boolean;
  currentSection: number;
  responses: AssessmentResponses;
  isCompiling: boolean;
  showSummary: boolean;
  assessmentResult: AssessmentResult | null;
  compilationError: string | null;
  sections: any[];
  userType: UserType | null;
  isRestoringFromSave: boolean;
  handleResponse: (questionId: string, value: any) => void;
  handleNext: () => void;
  handleCompilationComplete: () => Promise<void>;
  handleManualContinue: () => void;
  handleBack: () => void;
  handleBeginAssessment: () => void;
  handleRetry: () => void;
}

export interface ProgressData {
  responses: AssessmentResponses;
  currentSection: number;
  userType: UserType | null;
  timestamp: string;
}
