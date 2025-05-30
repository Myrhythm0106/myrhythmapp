
import { AssessmentResponses, sections } from "@/components/onboarding/steps/rhythm/rhythmAssessmentData";

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

export const focusAreas: Record<FocusArea, FocusAreaInfo> = {
  structure: {
    id: "structure",
    title: "Structure & Routine Focus",
    phase: "M - Moment of Impact / Multiply",
    description: "Building consistent routines and structures to support your recovery journey.",
    keyFeatures: ["Daily routine tracking", "Calendar management", "Medication reminders", "Habit building"],
    primaryActions: ["Set up daily routine", "Schedule important appointments", "Track medication adherence"],
    color: "red",
    gradient: "from-red-500 to-orange-500"
  },
  emotional: {
    id: "emotional",
    title: "Emotional Wellbeing Focus",
    phase: "Y - Yield to the Fog",
    description: "Focusing on emotional healing and mental wellness during recovery.",
    keyFeatures: ["Mood tracking", "Gratitude practice", "Mindfulness exercises", "Mental health resources"],
    primaryActions: ["Track daily mood", "Practice gratitude", "Access support resources"],
    color: "blue",
    gradient: "from-blue-500 to-indigo-500"
  },
  achievement: {
    id: "achievement",
    title: "Goal Achievement Focus",
    phase: "R - Reckon with Reality / T - Take Back Control",
    description: "Setting and achieving meaningful goals while rebuilding confidence.",
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
    description: "Embracing personal development and cognitive enhancement.",
    keyFeatures: ["Brain training", "Skill development", "Self-reflection", "Continuous learning"],
    primaryActions: ["Practice brain games", "Learn new skills", "Reflect on progress"],
    color: "amber",
    gradient: "from-amber-500 to-yellow-500"
  }
};

export function analyzeRhythmAssessment(responses: AssessmentResponses): FocusArea {
  // Calculate average scores for each section
  const sectionAverages: Record<string, number> = {};
  
  Object.keys(responses).forEach(sectionId => {
    const sectionResponses = responses[sectionId];
    const scores = Object.values(sectionResponses);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    sectionAverages[sectionId] = average;
  });

  // Find the section with the highest average score (most resonant phase)
  let highestScore = 0;
  let dominantSectionId = "1";
  
  Object.entries(sectionAverages).forEach(([sectionId, average]) => {
    if (average > highestScore) {
      highestScore = average;
      dominantSectionId = sectionId;
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

  return sectionToFocusArea[dominantSectionId] || "structure";
}

export function storeFocusArea(focusArea: FocusArea, assessmentData: any) {
  const focusAreaData = {
    currentFocus: focusArea,
    determinedAt: new Date().toISOString(),
    assessmentId: assessmentData.completedAt,
    nextReviewDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString() // 6 months
  };
  
  localStorage.setItem("myrhythm_focus_area", JSON.stringify(focusAreaData));
  
  // Also store in focus area history for tracking evolution
  const focusHistory = JSON.parse(localStorage.getItem("myrhythm_focus_history") || "[]");
  focusHistory.push(focusAreaData);
  localStorage.setItem("myrhythm_focus_history", JSON.stringify(focusHistory));
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
