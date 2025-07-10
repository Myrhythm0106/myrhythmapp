import { AssessmentResponses, Section } from "@/components/onboarding/steps/rhythm/rhythmAssessmentData";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";
import { SectionScore, FocusArea } from "./rhythmAnalysis";

export interface PersonalizedInsight {
  type: "strength" | "challenge" | "unique" | "opportunity";
  title: string;
  description: string;
  actionable?: string;
}

export interface PersonalRhythmProfile {
  uniqueCharacteristics: string[];
  strengthAreas: string[];
  growthOpportunities: string[];
  personalizedMessage: string;
  nextSteps: string[];
  rhythmSignature: string;
}

export interface PersonalizedAssessmentData {
  insights: PersonalizedInsight[];
  personalProfile: PersonalRhythmProfile;
  customDeterminationReason: string;
  userTypeSpecificMessage: string;
  uniqueScoreStory: string;
}

export function generatePersonalizedInsights(
  responses: AssessmentResponses,
  sectionScores: SectionScore[],
  focusArea: FocusArea,
  overallScore: number,
  userType?: UserType
): PersonalizedAssessmentData {
  const insights = analyzeResponsePatterns(responses, sectionScores, userType);
  const personalProfile = createPersonalRhythmProfile(sectionScores, focusArea, userType);
  const customDeterminationReason = generateCustomDeterminationReason(sectionScores, focusArea, responses, userType);
  const userTypeSpecificMessage = generateUserTypeMessage(focusArea, overallScore, userType);
  const uniqueScoreStory = generateUniqueScoreStory(sectionScores, overallScore, userType);

  return {
    insights,
    personalProfile,
    customDeterminationReason,
    userTypeSpecificMessage,
    uniqueScoreStory
  };
}

function analyzeResponsePatterns(
  responses: AssessmentResponses,
  sectionScores: SectionScore[],
  userType?: UserType
): PersonalizedInsight[] {
  const insights: PersonalizedInsight[] = [];
  
  // Find highest and lowest scoring sections
  const sortedSections = [...sectionScores].sort((a, b) => b.average - a.average);
  const strongest = sortedSections[0];
  const weakest = sortedSections[sortedSections.length - 1];
  
  // Analyze score variance
  const scoreVariance = calculateVariance(sectionScores.map(s => s.average));
  const isBalanced = scoreVariance < 0.3;
  const isExtreme = scoreVariance > 0.8;

  // Strength insight
  if (strongest.average >= 2.3) {
    insights.push({
      type: "strength",
      title: `Strong ${strongest.title} Foundation`,
      description: `Your responses show exceptional strength in ${strongest.title.toLowerCase()}, scoring ${strongest.average.toFixed(1)}/3.0. This suggests you have natural resilience in this area.`,
      actionable: `Leverage this strength as an anchor while building other areas.`
    });
  }

  // Challenge insight
  if (weakest.average <= 1.7) {
    const userTypeContext = getUserTypeContext(userType);
    insights.push({
      type: "challenge",
      title: `Growth Opportunity in ${weakest.title}`,
      description: `Your ${weakest.title.toLowerCase()} responses (${weakest.average.toFixed(1)}/3.0) indicate this as a key growth area${userTypeContext ? ` for ${userTypeContext}` : ''}.`,
      actionable: `Small, consistent steps in this area could yield significant improvements.`
    });
  }

  // Unique pattern insight
  if (isBalanced) {
    insights.push({
      type: "unique",
      title: "Remarkably Balanced Pattern",
      description: "Your responses show consistent scores across all areas, indicating a well-rounded approach to life management.",
      actionable: "Consider focusing on one area at a time to create breakthrough momentum."
    });
  } else if (isExtreme) {
    insights.push({
      type: "unique",
      title: "Distinctive Strength-Growth Pattern",
      description: "Your assessment reveals a unique pattern with clear areas of strength alongside specific growth opportunities.",
      actionable: "Use your strengths to support development in growth areas."
    });
  }

  // Response-specific insights
  const specificInsights = analyzeSpecificResponses(responses, userType);
  insights.push(...specificInsights);

  return insights.slice(0, 4); // Limit to most relevant insights
}

function analyzeSpecificResponses(responses: AssessmentResponses, userType?: UserType): PersonalizedInsight[] {
  const insights: PersonalizedInsight[] = [];
  
  // Analyze extreme responses (1s and 3s)
  let highConfidenceResponses = 0;
  let lowConfidenceResponses = 0;
  
  Object.values(responses).forEach(sectionResponses => {
    Object.values(sectionResponses).forEach(score => {
      if (score === 3) highConfidenceResponses++;
      if (score === 1) lowConfidenceResponses++;
    });
  });

  if (highConfidenceResponses >= 3) {
    insights.push({
      type: "strength",
      title: "Strong Self-Awareness",
      description: `You provided ${highConfidenceResponses} confident "completely true" responses, showing clear self-knowledge.`,
      actionable: "Your self-awareness is a powerful tool for growth and goal achievement."
    });
  }

  if (lowConfidenceResponses >= 3) {
    const message = userType === "brain-injury" 
      ? "This is common and completely normal in recovery - it shows honest self-reflection."
      : "This honest self-assessment provides a clear foundation for targeted improvement.";
    
    insights.push({
      type: "opportunity",
      title: "Clear Development Areas",
      description: `Your ${lowConfidenceResponses} "not true for me" responses identify specific areas for growth. ${message}`,
      actionable: "These areas represent your biggest opportunities for positive change."
    });
  }

  return insights;
}

function createPersonalRhythmProfile(
  sectionScores: SectionScore[],
  focusArea: FocusArea,
  userType?: UserType
): PersonalRhythmProfile {
  const sortedSections = [...sectionScores].sort((a, b) => b.average - a.average);
  const topTwo = sortedSections.slice(0, 2);
  const bottomTwo = sortedSections.slice(-2);

  const uniqueCharacteristics = generateUniqueCharacteristics(sectionScores, userType);
  const strengthAreas = topTwo.map(s => s.title);
  const growthOpportunities = bottomTwo.map(s => s.title);
  const personalizedMessage = generatePersonalizedMessage(focusArea, topTwo, userType);
  const nextSteps = generatePersonalizedNextSteps(focusArea, sectionScores, userType);
  const rhythmSignature = generateRhythmSignature(sectionScores, focusArea);

  return {
    uniqueCharacteristics,
    strengthAreas,
    growthOpportunities,
    personalizedMessage,
    nextSteps,
    rhythmSignature
  };
}

function generateUniqueCharacteristics(sectionScores: SectionScore[], userType?: UserType): string[] {
  const characteristics: string[] = [];
  const scores = sectionScores.map(s => s.average);
  const variance = calculateVariance(scores);
  
  if (variance < 0.3) {
    characteristics.push("Consistent and balanced across all life areas");
  } else if (variance > 0.8) {
    characteristics.push("Dynamic range with distinct strengths and growth areas");
  }

  const highScorer = sectionScores.find(s => s.average >= 2.5);
  if (highScorer) {
    characteristics.push(`Exceptional strength in ${highScorer.title.toLowerCase()}`);
  }

  const userTypeChar = getUserTypeCharacteristic(userType);
  if (userTypeChar) {
    characteristics.push(userTypeChar);
  }

  return characteristics;
}

function generatePersonalizedMessage(
  focusArea: FocusArea,
  topStrengths: SectionScore[],
  userType?: UserType
): string {
  const strengthText = topStrengths.map(s => s.title.toLowerCase()).join(" and ");
  const userContext = getUserTypePersonalMessage(userType);
  
  return `Your unique rhythm combines strong ${strengthText} with a natural inclination toward ${focusArea} focus. ${userContext} This combination positions you well for meaningful progress in your journey.`;
}

function generatePersonalizedNextSteps(
  focusArea: FocusArea,
  sectionScores: SectionScore[],
  userType?: UserType
): string[] {
  const steps: string[] = [];
  const weakest = sectionScores.reduce((min, current) => 
    current.average < min.average ? current : min
  );

  // Focus area specific step
  steps.push(`Begin with ${focusArea} activities that feel natural and comfortable`);
  
  // Strength-based step
  const strongest = sectionScores.reduce((max, current) => 
    current.average > max.average ? current : max
  );
  steps.push(`Use your ${strongest.title.toLowerCase()} strength as a foundation for other areas`);
  
  // Growth-focused step
  steps.push(`Gently explore ${weakest.title.toLowerCase()} with small, manageable actions`);
  
  // User type specific step
  const userTypeStep = getUserTypeSpecificStep(userType, focusArea);
  if (userTypeStep) {
    steps.push(userTypeStep);
  }

  return steps;
}

function generateRhythmSignature(sectionScores: SectionScore[], focusArea: FocusArea): string {
  const pattern = sectionScores.map(s => {
    if (s.average >= 2.3) return "High";
    if (s.average >= 1.7) return "Moderate";
    return "Developing";
  }).join("-");
  
  return `${focusArea.charAt(0).toUpperCase() + focusArea.slice(1)}-Focused ${pattern} Rhythm`;
}

function generateCustomDeterminationReason(
  sectionScores: SectionScore[],
  focusArea: FocusArea,
  responses: AssessmentResponses,
  userType?: UserType
): string {
  const dominantSection = sectionScores.reduce((max, current) => 
    current.average > max.average ? current : max
  );
  
  const responseCount = Object.values(responses).reduce((total, section) => 
    total + Object.keys(section).length, 0
  );
  
  const userTypeContext = userType ? ` as someone focused on ${userType.replace(/-/g, ' ')}` : '';
  
  return `Your ${responseCount} assessment responses revealed a distinctive pattern where "${dominantSection.title}" emerged as your strongest area (${dominantSection.average.toFixed(1)}/3.0)${userTypeContext}. This personal combination, along with your unique response patterns across all areas, clearly indicates that ${focusArea} focus will serve you best right now. Your individual rhythm shows this is where you'll find the most natural momentum and meaningful progress.`;
}

function generateUserTypeMessage(
  focusArea: FocusArea,
  overallScore: number,
  userType?: UserType
): string {
  if (!userType) return "";
  
  const contextMap: Record<UserType, string> = {
    "brain-injury": `As someone on a recovery journey, your ${focusArea} focus aligns perfectly with rebuilding your rhythm at a pace that honors your healing process. Your assessment shows you're ready for this next step.`,
    "cognitive-optimization": `For cognitive optimization, your ${focusArea} focus represents your most efficient path to enhanced mental performance. Your assessment indicates this area will yield the highest return on your optimization efforts.`,
    "caregiver": `As a caregiver, your ${focusArea} focus will help you support others more effectively while maintaining your own well-being. Your assessment shows this balance is achievable and sustainable for you.`,
    "wellness": `Your ${focusArea} focus perfectly aligns with building sustainable wellness and productivity systems. Your assessment indicates this foundation will support all your other life optimization goals.`
  };
  
  return contextMap[userType] || "";
}

function generateUniqueScoreStory(
  sectionScores: SectionScore[],
  overallScore: number,
  userType?: UserType
): string {
  const highest = sectionScores.reduce((max, current) => 
    current.average > max.average ? current : max
  );
  const lowest = sectionScores.reduce((min, current) => 
    current.average < min.average ? current : min
  );
  
  const spreadValue = highest.average - lowest.average;
  const spreadDescription = spreadValue > 1.0 ? "significant variation" : 
                           spreadValue > 0.5 ? "moderate variation" : "consistent pattern";
  
  return `Your overall score of ${overallScore.toFixed(1)}/3.0 tells a unique story: while ${highest.title.toLowerCase()} stands out as your strength (${highest.average.toFixed(1)}), ${lowest.title.toLowerCase()} presents your greatest opportunity (${lowest.average.toFixed(1)}). This ${spreadDescription} across areas creates your distinctive rhythm profile and explains why your personalized focus area was determined specifically for you.`;
}

// Helper functions
function calculateVariance(numbers: number[]): number {
  const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
  return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
}

function getUserTypeContext(userType?: UserType): string | null {
  const contextMap: Record<UserType, string> = {
    "brain-injury": "recovery journeys",
    "cognitive-optimization": "performance optimization",
    "caregiver": "caregiving roles",
    "wellness": "wellness and productivity goals"
  };
  return userType ? contextMap[userType] : null;
}

function getUserTypeCharacteristic(userType?: UserType): string | null {
  const charMap: Record<UserType, string> = {
    "brain-injury": "Resilient and recovery-focused approach",
    "cognitive-optimization": "Performance-driven mindset with optimization focus",
    "caregiver": "Supportive nature with others-focused perspective",
    "wellness": "Balanced approach to life optimization"
  };
  return userType ? charMap[userType] : null;
}

function getUserTypePersonalMessage(userType?: UserType): string {
  const messageMap: Record<UserType, string> = {
    "brain-injury": "Your journey shows remarkable self-awareness and readiness for positive growth.",
    "cognitive-optimization": "Your systematic approach to self-assessment indicates strong optimization potential.",
    "caregiver": "Your thoughtful responses show the same care you give others applied to your own growth.",
    "wellness": "Your balanced perspective creates an ideal foundation for sustainable life optimization."
  };
  return userType ? messageMap[userType] : "Your thoughtful responses show strong self-awareness and growth potential.";
}

function getUserTypeSpecificStep(userType?: UserType, focusArea?: FocusArea): string | null {
  if (!userType) return null;
  
  const stepMap: Record<UserType, string> = {
    "brain-injury": "Connect with recovery-focused community resources and support",
    "cognitive-optimization": "Track and measure your cognitive performance improvements",
    "caregiver": "Include family/care network in your growth journey when appropriate",
    "wellness": "Integrate wellness practices with your productivity systems"
  };
  
  return stepMap[userType];
}
