
import { AssessmentResponses } from "@/components/onboarding/steps/rhythm/rhythmAssessmentData";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";
import { ProgressData } from "./types";

export class ProgressManager {
  private static readonly PROGRESS_KEY = 'myrhythm_assessment_progress';
  private static readonly SAVE_DELAY = 2000;

  static saveProgress(
    responses: AssessmentResponses,
    currentSection: number,
    userType: UserType | null
  ): void {
    const progressData: ProgressData = {
      responses,
      currentSection,
      userType,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(progressData));
    console.log("ProgressManager: Progress saved:", progressData);
  }

  static loadProgress(): ProgressData | null {
    try {
      const savedProgress = localStorage.getItem(this.PROGRESS_KEY);
      if (!savedProgress) return null;
      
      const progress = JSON.parse(savedProgress) as ProgressData;
      console.log("ProgressManager: Progress loaded:", progress);
      return progress;
    } catch (error) {
      console.error("ProgressManager: Failed to load progress:", error);
      this.clearProgress();
      return null;
    }
  }

  static clearProgress(): void {
    localStorage.removeItem(this.PROGRESS_KEY);
    console.log("ProgressManager: Progress cleared");
  }

  static setupAutoSave(
    responses: AssessmentResponses,
    currentSection: number,
    userType: UserType | null
  ): void {
    clearTimeout((window as any).assessmentSaveTimeout);
    (window as any).assessmentSaveTimeout = setTimeout(() => {
      this.saveProgress(responses, currentSection, userType);
    }, this.SAVE_DELAY);
  }
}
