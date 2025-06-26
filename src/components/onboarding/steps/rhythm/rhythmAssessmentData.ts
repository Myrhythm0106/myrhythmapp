import { Brain, Heart, Target, Users } from "lucide-react";
import { UserType } from "../UserTypeStep";

export interface Question {
  id: string;
  text: string;
}

export interface Section {
  id: number;
  title: string;
  phase: string;
  phaseDescription: string;
  narrative: string;
  questions: Question[];
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

export interface AssessmentResponses {
  [sectionId: string]: {
    [questionId: string]: number;
  };
}

// Memory-enhanced base sections for brain injury recovery
export const baseSections: Section[] = [
  {
    id: 1,
    title: "Memory & The Beginning",
    phase: "M",
    phaseDescription: "Moment of Impact - Memory Baseline",
    narrative: "Sometimes, everything changes in a moment. That moment might affect both your memories and your ability to create new ones.",
    questions: [
      { id: "replay_moment", text: "Do you replay the moment your brain injury happened in your mind?" },
      { id: "memory_before_after", text: "Do you notice a clear difference in your memory abilities from before to after your injury?" },
      { id: "something_broke", text: "Do you feel like something \"broke\" or changed dramatically in your thinking and memory?" },
      { id: "negative_thoughts", text: "Do you frequently experience negative or fearful thoughts about your memory abilities?" }
    ],
    icon: Brain,
    gradient: "from-red-500 to-orange-500"
  },
  {
    id: 2,
    title: "Memory in the Fog",
    phase: "Y",
    phaseDescription: "Yield to the Fog - Memory Challenges",
    narrative: "Memory can feel cloudy after trauma. Like important moments are there—but just out of reach.",
    questions: [
      { id: "brain_fog", text: "Do you struggle to remember things because your brain feels tired or foggy?" },
      { id: "memory_issues", text: "Do you often forget what you were doing or important conversations you've had?" },
      { id: "overwhelm", text: "Do memory tasks that once felt easy now seem mentally overwhelming?" },
      { id: "important_moments", text: "Do you worry about forgetting important moments or decisions in your life?" }
    ],
    icon: Brain,
    gradient: "from-gray-500 to-blue-400"
  },
  {
    id: 3,
    title: "Facing Memory Reality",
    phase: "R",
    phaseDescription: "Reckon with Reality - Memory Pattern Recognition",
    narrative: "Healing begins with honestly understanding your memory patterns. Acceptance of changes is part of the rhythm.",
    questions: [
      { id: "acceptance", text: "Have you accepted that your memory works differently after your brain injury?" },
      { id: "grief", text: "Do you sometimes feel sadness or grief over memory abilities you've lost?" },
      { id: "exploring_new_ways", text: "Are you beginning to explore new memory strategies and techniques?" },
      { id: "memory_patterns", text: "Are you starting to recognize patterns in when your memory works better or worse?" }
    ],
    icon: Heart,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 4,
    title: "Memory Support Systems",
    phase: "H",
    phaseDescription: "Harness Support - Memory Tools and Structure",
    narrative: "Memory support systems are powerful medicine. The right tools become your external memory.",
    questions: [
      { id: "daily_routines", text: "Do you use daily routines or tools to help your memory stay on track?" },
      { id: "support_systems", text: "Are there people or memory aids that you rely on to support your daily life?" },
      { id: "structured_plan", text: "Do you feel more confident when you have memory aids and structured plans?" },
      { id: "memory_tools", text: "Do you actively use calendars, notes, or apps to support your memory?" }
    ],
    icon: Target,
    gradient: "from-green-500 to-teal-500"
  },
  {
    id: 5,
    title: "Memory Progress Recognition",
    phase: "Y",
    phaseDescription: "Yield Again - Memory Improvement Tracking",
    narrative: "Memory healing isn't always linear. But awareness of small improvements is a sign of real growth.",
    questions: [
      { id: "recognizing_progress", text: "Are you recognizing progress, even small improvements, in your memory abilities?" },
      { id: "flexibility", text: "Are you becoming more flexible in how you approach memory challenges?" },
      { id: "confident_pacing", text: "Do you feel more confident adjusting your pace to what your memory needs?" },
      { id: "memory_strategies", text: "Are you finding memory strategies that actually work for you?" }
    ],
    icon: Brain,
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    id: 6,
    title: "Memory Empowerment",
    phase: "T",
    phaseDescription: "Take Back Control - Memory Confidence Building",
    narrative: "Memory confidence is built step by step—and it begins with trusting the strategies that work for you.",
    questions: [
      { id: "setting_goals", text: "Are you setting memory-related goals to regain a sense of control?" },
      { id: "shaping_healing", text: "Do you believe your memory strategies and decisions are improving your daily life?" },
      { id: "rebuilding_trust", text: "Are you beginning to rebuild trust in your memory abilities and judgment?" },
      { id: "memory_control", text: "Do you feel more in control of your memory challenges than you did before?" }
    ],
    icon: Target,
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    id: 7,
    title: "Memory Growth & Development",
    phase: "H",
    phaseDescription: "Heal Forward - Memory Mastery",
    narrative: "This version of your memory is growing. Not despite what happened, but through developing new strengths.",
    questions: [
      { id: "self_kindness", text: "Are you practicing self-kindness when your memory isn't perfect?" },
      { id: "new_version", text: "Do you feel you are developing new memory strengths and abilities?" },
      { id: "meaningful_life", text: "Are you focused on building a meaningful life with your current memory abilities?" },
      { id: "memory_growth", text: "Do you see your memory challenges as opportunities for growth and learning?" }
    ],
    icon: Heart,
    gradient: "from-pink-500 to-rose-500"
  },
  {
    id: 8,
    title: "Memory Mission & Advocacy",
    phase: "M",
    phaseDescription: "Multiply the Mission - Memory Support for Others",
    narrative: "Your memory journey has wisdom to offer. Your experience can help others navigate their own memory challenges.",
    questions: [
      { id: "sharing_journey", text: "Do you feel inspired to share your memory recovery journey with others?" },
      { id: "supporting_others", text: "Are you exploring ways to support others going through similar memory challenges?" },
      { id: "greater_purpose", text: "Does your memory experience feel like it can contribute to helping others?" },
      { id: "memory_advocacy", text: "Do you want to advocate for better memory support and understanding?" }
    ],
    icon: Users,
    gradient: "from-amber-500 to-yellow-500"
  }
];

const userTypeQuestions: Record<UserType, Section[]> = {
  "brain-injury-recovery": baseSections,
  
  "cognitive-optimization": [
    {
      id: 1,
      title: "Memory & Cognitive Starting Point",
      phase: "M",
      phaseDescription: "Moment of Impact - Cognitive & Memory Baseline",
      narrative: "Every peak performer recognizes the moment they decided to optimize both their cognitive abilities and memory performance.",
      questions: [
        { id: "replay_moment", text: "Do you reflect on the moment you decided to optimize your cognitive and memory performance?" },
        { id: "memory_potential", text: "Do you feel like your current memory abilities aren't reaching their full potential?" },
        { id: "something_broke", text: "Do you feel like your current thinking and memory patterns need significant improvement?" },
        { id: "negative_thoughts", text: "Do you frequently think about not reaching your cognitive and memory potential?" }
      ],
      icon: Brain,
      gradient: "from-red-500 to-orange-500"
    },
    {
      id: 2,
      title: "Memory & Mental Clarity",
      phase: "Y",
      phaseDescription: "Yield to the Fog - Cognitive & Memory Clarity",
      narrative: "Even high performers experience moments when both focus and memory feel elusive.",
      questions: [
        { id: "brain_fog", text: "Do you struggle to maintain deep focus and clear memory when working on complex tasks?" },
        { id: "memory_issues", text: "Do you often forget important details or lose track of key information?" },
        { id: "overwhelm", text: "Do you feel mentally overwhelmed when trying to remember and process multiple high-level projects?" },
        { id: "memory_performance", text: "Are you frustrated with your memory performance during important tasks?" }
      ],
      icon: Brain,
      gradient: "from-gray-500 to-blue-400"
    },
    {
      id: 3,
      title: "Memory & Performance Assessment",
      phase: "R",
      phaseDescription: "Reckon with Reality - Memory & Cognitive Patterns",
      narrative: "Growth begins with honest assessment of both cognitive performance and memory capabilities.",
      questions: [
        { id: "acceptance", text: "Have you honestly assessed your current cognitive and memory performance levels?" },
        { id: "grief", text: "Do you sometimes feel frustrated with your current memory and mental clarity?" },
        { id: "exploring_new_ways", text: "Are you actively exploring new strategies to enhance both memory and cognitive abilities?" },
        { id: "memory_patterns", text: "Are you recognizing patterns in your memory and cognitive performance?" }
      ],
      icon: Heart,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 4,
      title: "Memory & Performance Systems",
      phase: "H",
      phaseDescription: "Harness Support - Memory & Cognitive Tools",
      narrative: "Peak performance requires intentional systems for both cognitive function and memory enhancement.",
      questions: [
        { id: "daily_routines", text: "Do you use structured routines to optimize both memory and mental performance?" },
        { id: "support_systems", text: "Do you have systems and tools that support both cognitive growth and memory enhancement?" },
        { id: "structured_plan", text: "Do you feel more empowered when following a structured cognitive and memory development plan?" },
        { id: "memory_tools", text: "Do you actively use tools and techniques specifically designed for memory improvement?" }
      ],
      icon: Target,
      gradient: "from-green-500 to-teal-500"
    },
    {
      id: 5,
      title: "Memory & Cognitive Growth",
      phase: "Y",
      phaseDescription: "Yield Again - Memory & Performance Progress",
      narrative: "Cognitive and memory optimization isn't linear. Recognizing patterns in both areas shows deepening awareness.",
      questions: [
        { id: "recognizing_progress", text: "Are you tracking improvements in both cognitive performance and memory abilities?" },
        { id: "flexibility", text: "Are you adapting your strategies for both thinking and memory challenges?" },
        { id: "confident_pacing", text: "Do you feel confident managing both mental energy and memory load throughout the day?" },
        { id: "memory_growth", text: "Are you seeing measurable improvements in your memory capabilities?" }
      ],
      icon: Brain,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      id: 6,
      title: "Memory & Cognitive Empowerment",
      phase: "T",
      phaseDescription: "Take Back Control - Memory & Performance Mastery",
      narrative: "Empowerment comes from taking deliberate action on both cognitive development and memory mastery.",
      questions: [
        { id: "setting_goals", text: "Are you setting specific goals for both mental performance and memory improvement?" },
        { id: "shaping_healing", text: "Do you believe your daily decisions actively shape both cognitive abilities and memory?" },
        { id: "rebuilding_trust", text: "Are you building greater trust in both mental capabilities and memory reliability?" },
        { id: "memory_control", text: "Do you feel more in control of your memory performance and cognitive abilities?" }
      ],
      icon: Target,
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      id: 7,
      title: "Memory & Cognitive Optimization",
      phase: "H",
      phaseDescription: "Heal Forward - Memory & Cognitive Excellence",
      narrative: "You're evolving into someone with optimized thinking and enhanced memory capabilities.",
      questions: [
        { id: "self_kindness", text: "Are you patient with yourself during the cognitive and memory optimization process?" },
        { id: "new_version", text: "Do you feel you're becoming more cognitively capable with enhanced memory?" },
        { id: "meaningful_life", text: "Are you focused on meaningful cognitive and memory growth, not just quick fixes?" },
        { id: "memory_mastery", text: "Do you feel you're developing true memory mastery alongside cognitive excellence?" }
      ],
      icon: Heart,
      gradient: "from-pink-500 to-rose-500"
    },
    {
      id: 8,
      title: "Memory & Cognitive Mission",
      phase: "M",
      phaseDescription: "Multiply the Mission - Sharing Memory & Cognitive Excellence",
      narrative: "Your cognitive and memory growth can inspire others to optimize their own mental performance.",
      questions: [
        { id: "sharing_journey", text: "Do you feel inspired to share your cognitive and memory optimization journey?" },
        { id: "supporting_others", text: "Are you exploring ways to help others enhance both mental performance and memory?" },
        { id: "greater_purpose", text: "Does your cognitive and memory growth contribute to something greater?" },
        { id: "memory_teaching", text: "Do you want to help others discover the power of memory enhancement?" }
      ],
      icon: Users,
      gradient: "from-amber-500 to-yellow-500"
    }
  ],

  "caregiver-support": [
    {
      id: 1,
      title: "Memory & The Call to Care",
      phase: "M",
      phaseDescription: "Moment of Impact - Caregiver Memory Challenges",
      narrative: "Caregiving often begins when you realize someone's memory needs support—and that yours might too.",
      questions: [
        { id: "replay_moment", text: "Do you think about the moment you realized your loved one's memory needed your support?" },
        { id: "memory_burden", text: "Do you feel like you're carrying the memory load for both yourself and your loved one?" },
        { id: "something_broke", text: "Do you feel like caregiving has changed your own memory and thinking abilities?" },
        { id: "negative_thoughts", text: "Do you worry about your ability to remember everything needed for caregiving?" }
      ],
      icon: Brain,
      gradient: "from-red-500 to-orange-500"
    }
    // Continue with other caregiver sections updated with memory context...
  ],

  "wellness-productivity": [
    {
      id: 1,
      title: "Memory & Life Systems",
      phase: "M",
      phaseDescription: "Moment of Impact - Memory & Organization Baseline",
      narrative: "Transformation begins when you realize that better memory systems could revolutionize your productivity.",
      questions: [
        { id: "replay_moment", text: "Do you think about when you decided to improve both memory and life organization?" },
        { id: "memory_systems", text: "Do you feel like your current memory and organizational systems need improvement?" },
        { id: "something_broke", text: "Do you feel like your memory and productivity systems are failing you?" },
        { id: "negative_thoughts", text: "Do you frequently feel frustrated with forgetting important tasks and commitments?" }
      ],
      icon: Brain,
      gradient: "from-red-500 to-orange-500"
    }
    // Continue with other wellness sections updated with memory context...
  ]
};

// Function to get sections based on user type with proper fallback
export function getSectionsForUserType(userType?: UserType): Section[] {
  console.log("getSectionsForUserType called with:", userType);
  
  if (!userType) {
    console.log("No user type provided, defaulting to brain injury recovery");
    return baseSections;
  }
  
  const sections = userTypeQuestions[userType];
  if (!sections) {
    console.log("No sections found for user type:", userType, "defaulting to brain injury recovery");
    return baseSections;
  }
  
  console.log("Found sections for user type:", userType, "section count:", sections.length);
  return sections;
}

// Export the current sections based on user type (dynamic) with improved logic
export function getCurrentSections(): Section[] {
  const userType = localStorage.getItem("myrhythm_user_type") as UserType | null;
  return getSectionsForUserType(userType || undefined);
}

export const scaleLabels = [
  "Never / Not at all",
  "Rarely / A little", 
  "Sometimes / Moderately",
  "Often / Very much"
];
