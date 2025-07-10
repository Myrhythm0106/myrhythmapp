import { AssessmentResponses, getSectionsForUserType } from "@/components/onboarding/steps/rhythm/rhythmAssessmentData";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";
import { generatePersonalizedInsights, PersonalizedAssessmentData } from "./personalizedInsights";

export type FocusArea = "memory" | "structure" | "emotional" | "achievement" | "community" | "growth";

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
  userType?: UserType;
  personalizedData?: PersonalizedAssessmentData;
}

// Memory-enhanced focus areas for the MyRhythm framework
export const focusAreas: Record<FocusArea, FocusAreaInfo> = {
  memory: {
    id: "memory",
    title: "Memory & Cognitive Wellness Focus",
    phase: "M - Memory Foundation",
    description: "Strengthening memory, cognitive function, and mental clarity as your foundation for everything else.",
    keyFeatures: ["Memory exercises", "Cognitive training", "Important moment logging", "Memory pattern tracking"],
    primaryActions: ["Log important moments daily", "Practice memory exercises", "Track cognitive patterns"],
    color: "indigo",
    gradient: "from-indigo-500 to-purple-500"
  },
  structure: {
    id: "structure",
    title: "Structure & Routine Focus",
    phase: "M - Moment of Impact / Multiply",
    description: "Building consistent routines and structures that support your memory and daily rhythm.",
    keyFeatures: ["Memory-supportive routines", "Calendar management", "Habit building", "Structure development"],
    primaryActions: ["Set up memory-friendly routines", "Schedule important tasks", "Track habit formation"],
    color: "red",
    gradient: "from-red-500 to-orange-500"
  },
  emotional: {
    id: "emotional",
    title: "Emotional Wellbeing Focus",
    phase: "Y - Yield to the Fog",
    description: "Focusing on emotional wellness and mental clarity that supports memory and cognitive health.",
    keyFeatures: ["Mood tracking", "Memory-emotion connection", "Mindfulness exercises", "Stress management"],
    primaryActions: ["Track daily mood and memory", "Practice mindfulness", "Access wellness resources"],
    color: "blue",
    gradient: "from-blue-500 to-indigo-500"
  },
  achievement: {
    id: "achievement",
    title: "Goal Achievement Focus",
    phase: "R - Reckon with Reality / T - Take Back Control",
    description: "Setting and achieving meaningful goals while building memory confidence and momentum.",
    keyFeatures: ["Memory-informed goal setting", "Progress tracking", "Action planning", "Achievement celebration"],
    primaryActions: ["Create memory-supportive goals", "Break down into memorable steps", "Track progress"],
    color: "purple",
    gradient: "from-purple-500 to-pink-500"
  },
  community: {
    id: "community",
    title: "Community & Purpose Focus",
    phase: "H - Harness Support / M - Multiply the Mission",
    description: "Building connections and finding purpose through community, sharing your memory journey with others.",
    keyFeatures: ["Memory support circles", "Community participation", "Sharing experiences", "Memory advocacy"],
    primaryActions: ["Connect with memory support groups", "Share your memory story", "Support others' memory journeys"],
    color: "green",
    gradient: "from-green-500 to-teal-500"
  },
  growth: {
    id: "growth",
    title: "Personal Growth Focus",
    phase: "H - Heal Forward",
    description: "Embracing personal development and continuous improvement in memory and life skills.",
    keyFeatures: ["Memory skill development", "Cognitive growth", "Continuous learning", "Memory mastery"],
    primaryActions: ["Practice new memory techniques", "Learn continuously", "Reflect on memory progress"],
    color: "amber",
    gradient: "from-amber-500 to-yellow-500"
  }
};

export function analyzeRhythmAssessment(responses: AssessmentResponses, userType?: UserType): {
  focusArea: FocusArea;
  sectionScores: SectionScore[];
  overallScore: number;
  determinationReason: string;
  personalizedData: PersonalizedAssessmentData;
} {
  // Get user-type-specific sections
  const sections = getSectionsForUserType(userType);
  
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
  
  // Determine focus area with memory-first approach
  let focusArea: FocusArea = "memory"; // Default to memory
  let highestScore = 0;
  let dominantSectionId = "1";
  
  sectionScores.forEach(section => {
    if (section.average > highestScore) {
      highestScore = section.average;
      dominantSectionId = section.id.toString();
    }
  });
  
  // Enhanced mapping that considers memory needs first
  const sectionToFocusArea: Record<string, FocusArea> = {
    "1": "memory", // M - Moment of Impact (memory baseline)
    "2": "memory", // Y - Yield to the Fog (memory fog)
    "3": "emotional", // R - Reckon with Reality
    "4": "structure", // H - Harness Support
    "5": "growth", // Y - Yield Again (memory progress)
    "6": "achievement", // T - Take Back Control
    "7": "growth", // H - Heal Forward
    "8": "community" // M - Multiply the Mission
  };

  // Determine focus area with memory-centric logic
  if (overallScore < 2.0) {
    // Low scores suggest significant memory/cognitive challenges
    focusArea = "memory";
  } else if (overallScore > 2.5) {
    // Higher scores allow for other focus areas
    focusArea = sectionToFocusArea[dominantSectionId] || "memory";
  } else {
    // Medium scores default to memory with some flexibility
    focusArea = sectionToFocusArea[dominantSectionId] || "memory";
  }
  
  // Adjust focus area based on user type with memory consideration
  if (userType === "cognitive-optimization" && focusArea === "emotional") {
    focusArea = "memory"; // Cognitive optimization users benefit from memory focus
  }
  
  if (userType === "brain-injury") {
    // Always consider memory as primary or secondary focus for brain injury recovery
    if (focusArea !== "memory" && overallScore < 2.2) {
      focusArea = "memory";
    }
  }
  
  // Generate personalized insights
  const personalizedData = generatePersonalizedInsights(
    responses,
    sectionScores,
    focusArea,
    overallScore,
    userType
  );

  // Generate memory-aware determination reason
  const dominantSectionTitle = sectionScores.find(s => s.id.toString() === dominantSectionId)?.title || '';
  const userTypeContext = userType ? ` for ${userType.replace(/-/g, ' ')} users` : '';
  const memoryContext = focusArea === "memory" 
    ? "Your responses indicate that strengthening memory and cognitive wellness should be your primary focus right now. " 
    : `While your strongest area is "${dominantSectionTitle}", we've identified that ${focusAreas[focusArea].title} will best support your memory wellness journey. `;
  
  const determinationReason = `${memoryContext}Based on your assessment${userTypeContext}, this corresponds to the ${focusAreas[focusArea].phase} phase of the MyRhythm framework. Memory is the foundation that supports all other aspects of your wellness journey, which is why our recommendations center around cognitive wellness while addressing your ${focusAreas[focusArea].title.toLowerCase()}.`;

  return { 
    focusArea, 
    sectionScores,
    overallScore,
    determinationReason,
    personalizedData
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
