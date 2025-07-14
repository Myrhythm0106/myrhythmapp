
import { AssessmentResponses } from "@/components/onboarding/steps/rhythm/rhythmAssessmentData";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";
import { ProgressManager } from "./progressManager";

export class ResponseManager {
  static handleResponse(
    questionId: string,
    value: any,
    responses: AssessmentResponses,
    currentSection: number,
    sections: any[],
    userType: UserType | null,
    setResponses: (responses: AssessmentResponses) => void
  ): void {
    const sectionId = sections[currentSection].id.toString();
    const newResponses = {
      ...responses,
      [sectionId]: {
        ...responses[sectionId],
        [questionId]: typeof value === 'string' ? parseInt(value, 10) : value
      }
    };
    
    console.log("ResponseManager: Recording response", questionId, "=", value);
    console.log("ResponseManager: Updated section responses:", newResponses[sectionId]);
    
    setResponses(newResponses);
    ProgressManager.setupAutoSave(newResponses, currentSection, userType);
  }
}
