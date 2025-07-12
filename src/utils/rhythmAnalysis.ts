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

// Optimized focus area determination by user type
const getUserTypeFocusPreference = (userType?: UserType): FocusArea => {
  const preferences = {
    'brain-injury': 'memory',
    'caregiver': 'structure',
    'cognitive-optimization': 'achievement',
    'wellness': 'emotional'
  } as const;
  
  return preferences[userType as keyof typeof preferences] || 'memory';
};

export function analyzeRhythmAssessment(responses: AssessmentResponses, userType?: UserType): {
  focusArea: FocusArea;
  sectionScores: SectionScore[];
  overallScore: number;
  determinationReason: string;
  personalizedData: PersonalizedAssessmentData;
} {
  console.log("Starting rhythm analysis for user type:", userType);
  
  // Get user-type-specific sections
  const sections = getSectionsForUserType(userType);
  
  // Early optimization: For simple cases, use user type preference
  if (!sections || sections.length === 0) {
    console.log("No sections found, using user type preference");
    const focusArea = getUserTypeFocusPreference(userType);
    const personalizedData = generatePersonalizedInsights(
      responses,
      [],
      focusArea,
      50,
      userType
    );
    
    return {
      focusArea,
      sectionScores: [],
      overallScore: 50,
      determinationReason: `Based on your ${userType?.replace('-', ' ')} profile, we've selected ${focusAreas[focusArea].title} as your optimal starting point.`,
      personalizedData
    };
  }
  
  // Calculate scores for each section (optimized)
  const sectionScores: SectionScore[] = [];
  let totalScore = 0;
  let responsesCount = 0;
  
  // Pre-calculate response totals for efficiency
  const responseTotals = new Map<string, { sum: number; count: number }>();
  
  Object.entries(responses).forEach(([sectionId, sectionResponses]) => {
    const scores = Object.values(sectionResponses);
    if (scores.length > 0) {
      const sum = scores.reduce((acc, score) => acc + score, 0);
      responseTotals.set(sectionId, { sum, count: scores.length });
      totalScore += sum;
      responsesCount += scores.length;
    }
  });
  
  // Build section scores efficiently
  sections.forEach((section, index) => {
    const sectionId = section.id.toString();
    const totals = responseTotals.get(sectionId);
    
    if (totals) {
      const average = totals.sum / totals.count;
      sectionScores.push({
        id: section.id,
        title: section.title,
        average: Number(average.toFixed(2)),
        responses: { ...responses[sectionId] },
        phase: section.phase
      });
    }
  });
  
  // Calculate overall score
  const overallScore = responsesCount > 0 
    ? Number((totalScore / responsesCount).toFixed(2))
    : 50;
  
  console.log("Calculated overall score:", overallScore, "for", responsesCount, "responses");
  
  // Optimized focus area determination
  let focusArea: FocusArea;
  
  // Use user type preference as starting point for efficiency
  const preferredFocus = getUserTypeFocusPreference(userType);
  
  if (sectionScores.length === 0) {
    focusArea = preferredFocus;
  } else {
    // Find highest scoring section
    const highestSection = sectionScores.reduce((max, section) => 
      section.average > max.average ? section : max
    );
    
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

    // Determine focus area with optimized logic
    if (overallScore < 2.0) {
      // Low scores suggest significant memory/cognitive challenges
      focusArea = "memory";
    } else if (overallScore > 2.5) {
      // Higher scores allow for other focus areas
      focusArea = sectionToFocusArea[highestSection.id.toString()] || preferredFocus;
    } else {
      // Medium scores use user type preference with section influence
      const sectionSuggestion = sectionToFocusArea[highestSection.id.toString()];
      focusArea = sectionSuggestion || preferredFocus;
    }
    
    // Final user type adjustments
    if (userType === "cognitive-optimization" && focusArea === "emotional") {
      focusArea = "achievement"; // Better fit for optimization users
    }
    
    if (userType === "brain-injury" && focusArea !== "memory" && overallScore < 2.2) {
      focusArea = "memory"; // Always prioritize memory for brain injury recovery
    }
  }
  
  console.log("Determined focus area:", focusArea);
  
  // Generate personalized insights (optimized call)
  const personalizedData = generatePersonalizedInsights(
    responses,
    sectionScores,
    focusArea,
    overallScore,
    userType
  );

  // Generate optimized determination reason
  const userTypeContext = userType ? ` designed for ${userType.replace(/-/g, ' ')} users` : '';
  const memoryContext = focusArea === "memory" 
    ? "Your assessment indicates that strengthening memory and cognitive wellness is your ideal starting point. " 
    : `Your personalized analysis shows that ${focusAreas[focusArea].title} will best support your cognitive wellness journey right now. `;
  
  const determinationReason = `${memoryContext}This MyRhythm recommendation${userTypeContext} corresponds to the ${focusAreas[focusArea].phase} phase of our proven framework. Your journey is designed to build a strong foundation while addressing your specific ${focusAreas[focusArea].title.toLowerCase()} needs.`;

  console.log("Analysis completed successfully");

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
