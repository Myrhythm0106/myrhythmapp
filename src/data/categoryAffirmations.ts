
import { UserType } from "@/components/onboarding/steps/UserTypeStep";

export interface CategoryAffirmation {
  text: string;
  category: UserType;
  subcategory: string;
  mood?: "great" | "okay" | "struggling";
  isPremium: boolean;
}

// Brain Injury Recovery Affirmations (400+ for premium, 10 for free)
const brainInjuryRecoveryAffirmations: CategoryAffirmation[] = [
  // Free affirmations (10)
  { text: "I choose progress over perfection in my recovery journey.", category: "brain-injury-recovery", subcategory: "progress", isPremium: false },
  { text: "Every small step forward is a victory worth celebrating.", category: "brain-injury-recovery", subcategory: "celebration", isPremium: false },
  { text: "My brain has an incredible ability to heal and adapt.", category: "brain-injury-recovery", subcategory: "neuroplasticity", isPremium: false },
  { text: "I am stronger than my challenges and braver than my fears.", category: "brain-injury-recovery", subcategory: "strength", isPremium: false },
  { text: "Each day brings new opportunities for growth and healing.", category: "brain-injury-recovery", subcategory: "hope", isPremium: false },
  { text: "I honor my pace and trust my journey.", category: "brain-injury-recovery", subcategory: "self-compassion", isPremium: false },
  { text: "My worth is not defined by my cognitive abilities.", category: "brain-injury-recovery", subcategory: "self-worth", isPremium: false },
  { text: "I am building new pathways to success every day.", category: "brain-injury-recovery", subcategory: "neuroplasticity", isPremium: false },
  { text: "Resilience is my superpower, and I grow stronger with each challenge.", category: "brain-injury-recovery", subcategory: "resilience", isPremium: false },
  { text: "I choose hope over fear, growth over limitation.", category: "brain-injury-recovery", subcategory: "mindset", isPremium: false },

  // Premium affirmations (sample of 50+ more)
  { text: "I celebrate every cognitive victory, no matter how small it seems to others.", category: "brain-injury-recovery", subcategory: "celebration", mood: "great", isPremium: true },
  { text: "My brain is constantly rewiring itself for success and independence.", category: "brain-injury-recovery", subcategory: "neuroplasticity", mood: "great", isPremium: true },
  { text: "I am reclaiming my independence one confident step at a time.", category: "brain-injury-recovery", subcategory: "independence", mood: "great", isPremium: true },
  { text: "My brain injury does not define my potential or limit my dreams.", category: "brain-injury-recovery", subcategory: "potential", mood: "okay", isPremium: true },
  { text: "I am writing a new chapter of strength and possibility.", category: "brain-injury-recovery", subcategory: "future", mood: "okay", isPremium: true },
  
  // Struggling mood affirmations
  { text: "Even on difficult days, I am making progress that I cannot yet see.", category: "brain-injury-recovery", subcategory: "progress", mood: "struggling", isPremium: true },
  { text: "My struggles today are building the strength I need for tomorrow.", category: "brain-injury-recovery", subcategory: "resilience", mood: "struggling", isPremium: true },
  { text: "I give myself permission to rest and heal at my own pace.", category: "brain-injury-recovery", subcategory: "self-compassion", mood: "struggling", isPremium: true },
  { text: "This moment is hard, but I have survived hard moments before.", category: "brain-injury-recovery", subcategory: "survival", mood: "struggling", isPremium: true },
  { text: "I am gentle with myself as my brain works hard to heal.", category: "brain-injury-recovery", subcategory: "self-compassion", mood: "struggling", isPremium: true },

  // More premium affirmations would continue here...
  { text: "I trust my brain's ability to find new ways to accomplish my goals.", category: "brain-injury-recovery", subcategory: "trust", mood: "okay", isPremium: true },
  { text: "Every adaptation I make shows my incredible creativity and resilience.", category: "brain-injury-recovery", subcategory: "adaptation", mood: "great", isPremium: true },
  { text: "I am proud of how far I've come on this journey of recovery.", category: "brain-injury-recovery", subcategory: "pride", mood: "great", isPremium: true },
  { text: "My experience gives me unique wisdom and strength to share with others.", category: "brain-injury-recovery", subcategory: "wisdom", mood: "great", isPremium: true },
  { text: "I choose to see obstacles as opportunities for creative problem-solving.", category: "brain-injury-recovery", subcategory: "mindset", mood: "okay", isPremium: true }
];

// Cognitive Optimization Affirmations (100+ for premium, 10 for free)
const cognitiveOptimizationAffirmations: CategoryAffirmation[] = [
  // Free affirmations (10)
  { text: "I optimize my mental performance through consistent practice.", category: "cognitive-optimization", subcategory: "performance", isPremium: false },
  { text: "My focus and clarity improve with each deliberate action.", category: "cognitive-optimization", subcategory: "focus", isPremium: false },
  { text: "I leverage my cognitive strengths for peak performance.", category: "cognitive-optimization", subcategory: "strengths", isPremium: false },
  { text: "My mind is a powerful tool that grows stronger with use.", category: "cognitive-optimization", subcategory: "growth", isPremium: false },
  { text: "I turn mental challenges into competitive advantages.", category: "cognitive-optimization", subcategory: "challenges", isPremium: false },
  { text: "Every day I enhance my cognitive abilities through intentional practice.", category: "cognitive-optimization", subcategory: "practice", isPremium: false },
  { text: "I am committed to unlocking my brain's full potential.", category: "cognitive-optimization", subcategory: "potential", isPremium: false },
  { text: "Mental clarity is my foundation for exceptional performance.", category: "cognitive-optimization", subcategory: "clarity", isPremium: false },
  { text: "I approach each task with focused intention and strategic thinking.", category: "cognitive-optimization", subcategory: "strategy", isPremium: false },
  { text: "My cognitive skills are assets that I continuously develop.", category: "cognitive-optimization", subcategory: "development", isPremium: false },

  // Premium samples
  { text: "I am the architect of my cognitive excellence and mental mastery.", category: "cognitive-optimization", subcategory: "mastery", mood: "great", isPremium: true },
  { text: "My brain operates at peak efficiency when I give it proper care.", category: "cognitive-optimization", subcategory: "efficiency", mood: "great", isPremium: true },
  { text: "I strategically challenge my mind to expand its capabilities.", category: "cognitive-optimization", subcategory: "expansion", mood: "okay", isPremium: true },
  { text: "Focus is my superpower, and I cultivate it with intention.", category: "cognitive-optimization", subcategory: "focus", mood: "okay", isPremium: true },
  { text: "Even when I feel mentally fatigued, I trust in my brain's resilience.", category: "cognitive-optimization", subcategory: "resilience", mood: "struggling", isPremium: true }
];

// Caregiver Support Affirmations (100+ for premium, 10 for free)
const caregiverSupportAffirmations: CategoryAffirmation[] = [
  // Free affirmations (10)
  { text: "I am a source of strength while honoring my own needs.", category: "caregiver-support", subcategory: "balance", isPremium: false },
  { text: "I empower my loved one by believing in their potential.", category: "caregiver-support", subcategory: "empowerment", isPremium: false },
  { text: "I can support others while caring for myself.", category: "caregiver-support", subcategory: "self-care", isPremium: false },
  { text: "Every small step my loved one takes is worth celebrating.", category: "caregiver-support", subcategory: "celebration", isPremium: false },
  { text: "My support creates space for healing and growth.", category: "caregiver-support", subcategory: "healing", isPremium: false },
  { text: "I provide love and support while respecting their independence.", category: "caregiver-support", subcategory: "respect", isPremium: false },
  { text: "My patience and understanding make a meaningful difference.", category: "caregiver-support", subcategory: "patience", isPremium: false },
  { text: "I am part of their support system, not their entire world.", category: "caregiver-support", subcategory: "boundaries", isPremium: false },
  { text: "Together, we are stronger than any challenge we face.", category: "caregiver-support", subcategory: "teamwork", isPremium: false },
  { text: "I choose compassion for both my loved one and myself.", category: "caregiver-support", subcategory: "compassion", isPremium: false },

  // Premium samples
  { text: "My love creates a safe space for my loved one to take risks and grow.", category: "caregiver-support", subcategory: "safety", mood: "great", isPremium: true },
  { text: "I model resilience and hope through my actions and words.", category: "caregiver-support", subcategory: "modeling", mood: "great", isPremium: true },
  { text: "Supporting others fills my heart even when it's challenging.", category: "caregiver-support", subcategory: "fulfillment", mood: "okay", isPremium: true },
  { text: "It's okay to feel overwhelmed sometimes - I'm only human.", category: "caregiver-support", subcategory: "humanity", mood: "struggling", isPremium: true },
  { text: "I give myself permission to rest and recharge when needed.", category: "caregiver-support", subcategory: "rest", mood: "struggling", isPremium: true }
];

// Wellness & Productivity Affirmations (100+ for premium, 10 for free)
const wellnessProductivityAffirmations: CategoryAffirmation[] = [
  // Free affirmations (10)
  { text: "I build sustainable habits that compound into transformation.", category: "wellness-productivity", subcategory: "habits", isPremium: false },
  { text: "I create systems that support my highest potential.", category: "wellness-productivity", subcategory: "systems", isPremium: false },
  { text: "I focus on progress, not perfection, in all I do.", category: "wellness-productivity", subcategory: "progress", isPremium: false },
  { text: "My well-being is the foundation of my success.", category: "wellness-productivity", subcategory: "foundation", isPremium: false },
  { text: "I optimize my life for both achievement and fulfillment.", category: "wellness-productivity", subcategory: "optimization", isPremium: false },
  { text: "Every healthy choice I make multiplies my energy and focus.", category: "wellness-productivity", subcategory: "energy", isPremium: false },
  { text: "I balance productivity with rest and restoration.", category: "wellness-productivity", subcategory: "balance", isPremium: false },
  { text: "My organized life creates space for spontaneity and joy.", category: "wellness-productivity", subcategory: "organization", isPremium: false },
  { text: "I prioritize what matters most and let go of the rest.", category: "wellness-productivity", subcategory: "priorities", isPremium: false },
  { text: "Small consistent actions create extraordinary results.", category: "wellness-productivity", subcategory: "consistency", isPremium: false },

  // Premium samples
  { text: "I am the CEO of my life, making strategic decisions for my well-being.", category: "wellness-productivity", subcategory: "leadership", mood: "great", isPremium: true },
  { text: "My productivity flows naturally from my aligned priorities.", category: "wellness-productivity", subcategory: "alignment", mood: "great", isPremium: true },
  { text: "I create rhythm and structure that supports my natural energy.", category: "wellness-productivity", subcategory: "rhythm", mood: "okay", isPremium: true },
  { text: "Even when I'm not productive, I am still worthy and valuable.", category: "wellness-productivity", subcategory: "worth", mood: "struggling", isPremium: true },
  { text: "Rest is not laziness - it's an investment in my future performance.", category: "wellness-productivity", subcategory: "rest", mood: "struggling", isPremium: true }
];

// Combine all affirmations
export const allCategoryAffirmations: CategoryAffirmation[] = [
  ...brainInjuryRecoveryAffirmations,
  ...cognitiveOptimizationAffirmations,
  ...caregiverSupportAffirmations,
  ...wellnessProductivityAffirmations
];

// Helper functions
export const getAffirmationsByCategory = (category: UserType, includePremium: boolean = false): CategoryAffirmation[] => {
  return allCategoryAffirmations.filter(
    affirmation => 
      affirmation.category === category && 
      (includePremium || !affirmation.isPremium)
  );
};

export const getAffirmationByMoodAndCategory = (
  category: UserType, 
  mood: "great" | "okay" | "struggling",
  includePremium: boolean = false
): CategoryAffirmation[] => {
  return allCategoryAffirmations.filter(
    affirmation => 
      affirmation.category === category && 
      (affirmation.mood === mood || !affirmation.mood) &&
      (includePremium || !affirmation.isPremium)
  );
};

export const getFreeAffirmationsCount = (category: UserType): number => {
  return getAffirmationsByCategory(category, false).length;
};

export const getPremiumAffirmationsCount = (category: UserType): number => {
  return getAffirmationsByCategory(category, true).length - getFreeAffirmationsCount(category);
};
