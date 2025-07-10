
import { UserType } from "@/components/onboarding/steps/UserTypeStep";

export interface PremiumIChooseStatement {
  id: string;
  text: string;
  category: UserType;
  subcategory: string;
  mood?: "great" | "okay" | "struggling";
  isPremium: boolean;
  theme: string;
  season?: "spring" | "summer" | "fall" | "winter";
  tags: string[];
}

// Extended free statements (20 total)
export const freeIChooseStatements: PremiumIChooseStatement[] = [
  // Brain Injury Recovery (5 free)
  {
    id: "bi_1",
    text: "#IChoose to honor my brain's healing journey with gentle patience, knowing every small step builds my strength.",
    category: "brain-injury",
    subcategory: "healing",
    isPremium: false,
    theme: "patience",
    tags: ["healing", "gentleness", "progress"]
  },
  {
    id: "bi_2", 
    text: "#IChoose to celebrate my victories, no matter how small they seem to others. Each one matters.",
    category: "brain-injury",
    subcategory: "celebration",
    isPremium: false,
    theme: "celebration",
    tags: ["victory", "progress", "self-compassion"]
  },
  {
    id: "bi_3",
    text: "#IChoose to trust my brain's incredible ability to adapt and create new pathways to success.",
    category: "brain-injury",
    subcategory: "neuroplasticity",
    isPremium: false,
    theme: "trust",
    tags: ["adaptation", "neuroplasticity", "potential"]
  },
  {
    id: "bi_4",
    text: "#IChoose to give myself permission to rest when needed, knowing that healing requires balance.",
    category: "brain-injury",
    subcategory: "self-care",
    isPremium: false,
    theme: "rest",
    tags: ["self-care", "balance", "permission"]
  },
  {
    id: "bi_5",
    text: "#IChoose to define myself by my courage and resilience, not by my challenges.",
    category: "brain-injury",
    subcategory: "identity",
    isPremium: false,
    theme: "courage",
    tags: ["identity", "resilience", "strength"]
  },

  // Caregiver Support (5 free)
  {
    id: "care_1",
    text: "#IChoose to support my loved one while honoring my own needs and boundaries.",
    category: "caregiver",
    subcategory: "balance",
    isPremium: false,
    theme: "balance",
    tags: ["boundaries", "self-care", "support"]
  },
  {
    id: "care_2",
    text: "#IChoose to see my caregiving as an act of love that transforms both of us.",
    category: "caregiver",
    subcategory: "purpose",
    isPremium: false,
    theme: "love",
    tags: ["purpose", "transformation", "love"]
  },
  {
    id: "care_3",
    text: "#IChoose to fill my own cup first, so I can pour into others from abundance.",
    category: "caregiver",
    subcategory: "self-care",
    isPremium: false,
    theme: "abundance",
    tags: ["self-care", "abundance", "energy"]
  },
  {
    id: "care_4",
    text: "#IChoose to celebrate every small improvement I witness, knowing progress comes in many forms.",
    category: "caregiver",
    subcategory: "celebration",
    isPremium: false,
    theme: "progress",
    tags: ["celebration", "progress", "awareness"]
  },
  {
    id: "care_5",
    text: "#IChoose to ask for help when I need it, understanding that accepting support is a strength.",
    category: "caregiver",
    subcategory: "support",
    isPremium: false,
    theme: "strength",
    tags: ["help", "community", "strength"]
  },

  // Cognitive Optimization (5 free)
  {
    id: "cog_1",
    text: "#IChoose to push my cognitive boundaries today, knowing growth happens at the edge of comfort.",
    category: "cognitive-optimization",
    subcategory: "growth",
    isPremium: false,
    theme: "growth",
    tags: ["challenge", "growth", "potential"]
  },
  {
    id: "cog_2",
    text: "#IChoose to focus my mental energy on what matters most, eliminating cognitive clutter.",
    category: "cognitive-optimization",
    subcategory: "focus",
    isPremium: false,
    theme: "focus",
    tags: ["focus", "clarity", "priorities"]
  },
  {
    id: "cog_3",
    text: "#IChoose to treat my mind like the high-performance tool it is, with proper care and challenge.",
    category: "cognitive-optimization",
    subcategory: "performance",
    isPremium: false,
    theme: "performance",
    tags: ["optimization", "care", "excellence"]
  },
  {
    id: "cog_4",
    text: "#IChoose to embrace mental challenges as opportunities to expand my cognitive capacity.",
    category: "cognitive-optimization",
    subcategory: "challenge",
    isPremium: false,
    theme: "expansion",
    tags: ["challenge", "capacity", "growth"]
  },
  {
    id: "cog_5",
    text: "#IChoose to combine focused work with strategic rest, optimizing my mental performance.",
    category: "cognitive-optimization",
    subcategory: "strategy",
    isPremium: false,
    theme: "optimization",
    tags: ["strategy", "balance", "performance"]
  },

  // Wellness & Productivity (5 free)
  {
    id: "well_1",
    text: "#IChoose to build systems that support my highest potential and deepest values.",
    category: "wellness",
    subcategory: "systems",
    isPremium: false,
    theme: "potential",
    tags: ["systems", "values", "potential"]
  },
  {
    id: "well_2",
    text: "#IChoose to prioritize what truly matters and release what no longer serves me.",
    category: "wellness",
    subcategory: "priorities",
    isPremium: false,
    theme: "clarity",
    tags: ["priorities", "release", "clarity"]
  },
  {
    id: "well_3",
    text: "#IChoose to create sustainable habits that compound into extraordinary results.",
    category: "wellness",
    subcategory: "habits",
    isPremium: false,
    theme: "sustainability",
    tags: ["habits", "sustainability", "results"]
  },
  {
    id: "well_4",
    text: "#IChoose to honor both my ambition and my need for rest, creating sustainable success.",
    category: "wellness",
    subcategory: "balance",
    isPremium: false,
    theme: "sustainability",
    tags: ["ambition", "rest", "sustainability"]
  },
  {
    id: "well_5",
    text: "#IChoose to measure my success by alignment with my values, not just achievements.",
    category: "wellness",
    subcategory: "values",
    isPremium: false,
    theme: "alignment",
    tags: ["values", "success", "alignment"]
  }
];

// Sample premium statements (would be 980 more in production)
export const premiumIChooseStatements: PremiumIChooseStatement[] = [
  // Brain Injury Recovery Premium
  {
    id: "bi_p1",
    text: "#IChoose to see my brain injury as a catalyst for discovering strengths I never knew I had.",
    category: "brain-injury",
    subcategory: "transformation",
    mood: "great",
    isPremium: true,
    theme: "discovery",
    season: "spring",
    tags: ["transformation", "discovery", "strength"]
  },
  {
    id: "bi_p2",
    text: "#IChoose to honor my unique timeline for healing, knowing that comparison steals joy.",
    category: "brain-injury",
    subcategory: "patience",
    mood: "okay",
    isPremium: true,
    theme: "uniqueness",
    tags: ["timeline", "healing", "self-compassion"]
  },
  {
    id: "bi_p3",
    text: "#IChoose to be gentle with myself on difficult days, knowing this too shall pass.",
    category: "brain-injury",
    subcategory: "compassion",
    mood: "struggling",
    isPremium: true,
    theme: "gentleness",
    tags: ["gentleness", "difficulty", "temporary"]
  },
  
  // Caregiver Support Premium
  {
    id: "care_p1",
    text: "#IChoose to see my caregiving role as a sacred privilege that shapes my character.",
    category: "caregiver",
    subcategory: "purpose",
    mood: "great",
    isPremium: true,
    theme: "sacred",
    tags: ["privilege", "character", "purpose"]
  },
  {
    id: "care_p2",
    text: "#IChoose to find moments of joy and laughter even in the midst of challenges.",
    category: "caregiver",
    subcategory: "joy",
    mood: "okay",
    isPremium: true,
    theme: "joy",
    tags: ["joy", "laughter", "resilience"]
  },
  
  // Cognitive Optimization Premium
  {
    id: "cog_p1",
    text: "#IChoose to architect my environment for peak mental performance and creative flow.",
    category: "cognitive-optimization",
    subcategory: "environment",
    mood: "great",
    isPremium: true,
    theme: "architecture",
    tags: ["environment", "flow", "performance"]
  },
  
  // Wellness Premium
  {
    id: "well_p1",
    text: "#IChoose to design my life around what energizes me, not what drains me.",
    category: "wellness",
    subcategory: "energy",
    mood: "great",
    isPremium: true,
    theme: "design",
    tags: ["energy", "design", "vitality"]
  }
];

export const getAllIChooseStatements = (includePremium: boolean = false): PremiumIChooseStatement[] => {
  if (includePremium) {
    return [...freeIChooseStatements, ...premiumIChooseStatements];
  }
  return freeIChooseStatements;
};

export const getIChooseByCategory = (
  category: UserType, 
  includePremium: boolean = false,
  mood?: "great" | "okay" | "struggling"
): PremiumIChooseStatement[] => {
  const statements = getAllIChooseStatements(includePremium);
  return statements.filter(statement => 
    statement.category === category && 
    (!mood || !statement.mood || statement.mood === mood)
  );
};

export const getRandomIChooseStatement = (
  category: UserType,
  includePremium: boolean = false,
  mood?: "great" | "okay" | "struggling",
  usedStatementIds: string[] = []
): PremiumIChooseStatement | null => {
  const statements = getIChooseByCategory(category, includePremium, mood);
  const availableStatements = statements.filter(s => !usedStatementIds.includes(s.id));
  
  if (availableStatements.length === 0) {
    // If all statements have been used, reset and use all statements
    return statements[Math.floor(Math.random() * statements.length)] || null;
  }
  
  return availableStatements[Math.floor(Math.random() * availableStatements.length)] || null;
};
