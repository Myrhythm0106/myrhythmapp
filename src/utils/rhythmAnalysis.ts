import { AssessmentResponses, sections } from "@/components/onboarding/steps/rhythm/rhythmAssessmentData";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";

export type FocusArea = "structure" | "emotional" | "achievement" | "community" | "growth";

export interface FocusAreaInfo {
  id: FocusArea;
  title: string;
  phase: string;
  description: string;
  keyFeatures: string[];
  primaryActions: string[];
  color: string;
  gradient: string;
}

export interface SectionScore {
  id: number;
  title: string;
  average: number;
  responses: Record<string, number>;
  phase: string;
}

export interface AssessmentResult {
  id: string;
  completedAt: string;
  focusArea: FocusArea;
  sectionScores: SectionScore[];
  overallScore: number;
  determinationReason: string;
  version: string;
  nextReviewDate: string;
  userType?: UserType; // Track which user type took the assessment
}

// Focus areas adapted for different user types
export const focusAreas: Record<FocusArea, FocusAreaInfo> = {
  structure: {
    id: "structure",
    title: "Structure & Routine Focus",
    phase: "M - Moment of Impact / Multiply",
    description: "Building consistent routines and structures to support your journey.",
    keyFeatures: ["Daily routine tracking", "Calendar management", "Habit building", "Structure optimization"],
    primaryActions: ["Set up daily routine", "Schedule important tasks", "Track habit formation"],
    color: "red",
    gradient: "from-red-500 to-orange-500"
  },
  emotional: {
    id: "emotional",
    title: "Emotional Wellbeing Focus",
    phase: "Y - Yield to the Fog",
    description: "Focusing on emotional wellness and mental clarity.",
    keyFeatures: ["Mood tracking", "Gratitude practice", "Mindfulness exercises", "Stress management"],
    primaryActions: ["Track daily mood", "Practice gratitude", "Access wellness resources"],
    color: "blue",
    gradient: "from-blue-500 to-indigo-500"
  },
  achievement: {
    id: "achievement",
    title: "Goal Achievement Focus",
    phase: "R - Reckon with Reality / T - Take Back Control",
    description: "Setting and achieving meaningful goals while building momentum.",
    keyFeatures: ["Goal setting", "Progress tracking", "Action planning", "Achievement celebration"],
    primaryActions: ["Create meaningful goals", "Break down into steps", "Track progress"],
    color: "purple",
    gradient: "from-purple-500 to-pink-500"
  },
  community: {
    id: "community",
    title: "Community & Purpose Focus",
    phase: "H - Harness Support / M - Multiply the Mission",
    description: "Building connections and finding purpose through community engagement.",
    keyFeatures: ["Support circles", "Community participation", "Sharing experiences", "Helping others"],
    primaryActions: ["Connect with support groups", "Share your story", "Support others"],
    color: "green",
    gradient: "from-green-500 to-teal-500"
  },
  growth: {
    id: "growth",
    title: "Personal Growth Focus",
    phase: "H - Heal Forward",
    description: "Embracing personal development and continuous improvement.",
    keyFeatures: ["Skill development", "Self-reflection", "Continuous learning", "Performance optimization"],
    primaryActions: ["Practice new skills", "Learn continuously", "Reflect on progress"],
    color: "amber",
    gradient: "from-amber-500 to-yellow-500"
  }
};

export function analyzeRhythmAssessment(responses: AssessmentResponses, userType?: UserType): {
  focusArea: FocusArea;
  sectionScores: SectionScore[];
  overallScore: number;
  determinationReason: string;
} {
  // Calculate scores for each section
  const sectionScores: SectionScore[] = [];
  let totalScore = 0;
  let responsesCount = 0;
  
  Object.keys(responses).forEach(sectionId => {
    const sectionIndex = parseInt(sectionId) - 1;
    if (sectionIndex >= 0 && sectionIndex < sections.length) {
      const section = sections[sectionIndex];
      const sectionResponses = responses[sectionId];
      const scores = Object.values(sectionResponses);
      const average = scores.length > 0 
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length
        : 0;
      
      sectionScores.push({
        id: section.id,
        title: section.title,
        average: Number(average.toFixed(2)),
        responses: { ...sectionResponses },
        phase: section.phase
      });
      
      totalScore += scores.reduce((sum, score) => sum + score, 0);
      responsesCount += scores.length;
    }
  });
  
  // Calculate overall score
  const overallScore = responsesCount > 0 
    ? Number((totalScore / responsesCount).toFixed(2))
    : 0;
  
  // Find section with the highest score
  let highestScore = 0;
  let dominantSectionId = "1";
  
  sectionScores.forEach(section => {
    if (section.average > highestScore) {
      highestScore = section.average;
      dominantSectionId = section.id.toString();
    }
  });
  
  // Map section to MYRHYTHM phase and focus area
  const sectionToFocusArea: Record<string, FocusArea> = {
    "1": "structure", // M - Moment of Impact
    "2": "emotional", // Y - Yield to the Fog
    "3": "achievement", // R - Reckon with Reality
    "4": "community", // H - Harness Support
    "5": "emotional", // Y - Yield Again (emotional processing)
    "6": "achievement", // T - Take Back Control
    "7": "growth", // H - Heal Forward
    "8": "community" // M - Multiply the Mission
  };

  // Adjust focus area based on user type if needed
  let focusArea = sectionToFocusArea[dominantSectionId] || "structure";
  
  // For cognitive optimization users, lean towards achievement and growth
  if (userType === "cognitive-optimization" && (focusArea === "emotional" || focusArea === "structure")) {
    focusArea = highestScore > 2.5 ? "achievement" : "growth";
  }
  
  // For wellness-productivity users, lean towards structure and achievement
  if (userType === "wellness-productivity" && focusArea === "emotional") {
    focusArea = "structure";
  }
  
  // Generate determination reason
  const dominantSectionTitle = sectionScores.find(s => s.id.toString() === dominantSectionId)?.title || '';
  const userTypeContext = userType ? ` for ${userType.replace(/-/g, ' ')} users` : '';
  const determinationReason = `Based on your assessment${userTypeContext}, "${dominantSectionTitle}" emerged as your most resonant phase with a score of ${highestScore.toFixed(2)} out of 3. This corresponds to the ${focusAreas[focusArea].phase} phase of the MyRhythm framework, which is why we're recommending a ${focusAreas[focusArea].title} to support your journey right now.`;

  return { 
    focusArea, 
    sectionScores,
    overallScore,
    determinationReason
  };
}

export function storeFocusArea(
  focusArea: FocusArea, 
  assessmentResult: AssessmentResult
) {
  const focusAreaData = {
    currentFocus: focusArea,
    determinedAt: assessmentResult.completedAt,
    assessmentId: assessmentResult.id,
    nextReviewDate: assessmentResult.nextReviewDate,
    userType: assessmentResult.userType
  };
  
  localStorage.setItem("myrhythm_focus_area", JSON.stringify(focusAreaData));
  
  // Also store in focus area history for tracking evolution
  const focusHistory = JSON.parse(localStorage.getItem("myrhythm_focus_history") || "[]");
  focusHistory.push(focusAreaData);
  localStorage.setItem("myrhythm_focus_history", JSON.stringify(focusHistory));
}

export function storeAssessmentResult(assessmentResult: AssessmentResult) {
  // Store the full current assessment result
  localStorage.setItem("myrhythm_current_assessment", JSON.stringify(assessmentResult));
  
  // Update assessment history, keeping only the last 4 assessments
  const assessmentHistory = JSON.parse(localStorage.getItem("myrhythm_assessment_history") || "[]");
  
  // Add new assessment at the beginning
  assessmentHistory.unshift(assessmentResult);
  
  // Keep only the most recent 4 assessments
  const limitedHistory = assessmentHistory.slice(0, 4);
  
  localStorage.setItem("myrhythm_assessment_history", JSON.stringify(limitedHistory));
}

export function getCurrentAssessmentResult(): AssessmentResult | null {
  const assessmentData = localStorage.getItem("myrhythm_current_assessment");
  if (!assessmentData) return null;
  
  try {
    return JSON.parse(assessmentData);
  } catch {
    return null;
  }
}

export function getAssessmentHistory(): AssessmentResult[] {
  const assessmentHistory = localStorage.getItem("myrhythm_assessment_history");
  if (!assessmentHistory) return [];
  
  try {
    return JSON.parse(assessmentHistory);
  } catch {
    return [];
  }
}

export function getCurrentFocusArea(): FocusArea | null {
  const focusAreaData = localStorage.getItem("myrhythm_focus_area");
  if (!focusAreaData) return null;
  
  try {
    const parsed = JSON.parse(focusAreaData);
    return parsed.currentFocus;
  } catch {
    return null;
  }
}

export function getFocusAreaEvolution(): any[] {
  const focusHistory = localStorage.getItem("myrhythm_focus_history");
  if (!focusHistory) return [];
  
  try {
    return JSON.parse(focusHistory);
  } catch {
    return [];
  }
}
