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

// Base sections for brain injury recovery (current compassionate questions)
export const baseSections: Section[] = [
  {
    id: 1,
    title: "The Beginning",
    phase: "M",
    phaseDescription: "Moment of Impact",
    narrative: "Sometimes, everything changes in a moment. That moment might feel like a blur, or it might still be vivid in your mind.",
    questions: [
      { id: "replay_moment", text: "Do you replay the moment your brain injury happened in your mind?" },
      { id: "something_broke", text: "Do you feel like something \"broke\" or changed dramatically in your thinking?" },
      { id: "negative_thoughts", text: "Do you frequently experience negative or fearful thoughts since the injury?" }
    ],
    icon: Brain,
    gradient: "from-red-500 to-orange-500"
  },
  {
    id: 2,
    title: "In the Fog",
    phase: "Y",
    phaseDescription: "Yield to the Fog",
    narrative: "Minds can feel misty after trauma. Like you're here—but not quite.",
    questions: [
      { id: "brain_fog", text: "Do you struggle to finish tasks because your brain feels tired or foggy?" },
      { id: "memory_issues", text: "Do you often forget what you were doing or why you entered a room?" },
      { id: "overwhelm", text: "Do things that once felt easy now seem mentally overwhelming?" }
    ],
    icon: Brain,
    gradient: "from-gray-500 to-blue-400"
  },
  {
    id: 3,
    title: "Facing Reality",
    phase: "R",
    phaseDescription: "Reckon with Reality",
    narrative: "Healing begins with honesty. Grief, acceptance, even frustration—it's all part of the rhythm.",
    questions: [
      { id: "acceptance", text: "Have you accepted that life feels different after your brain injury?" },
      { id: "grief", text: "Do you sometimes feel sadness or grief over how things have changed?" },
      { id: "exploring_new_ways", text: "Are you beginning to explore new ways of functioning with your current abilities?" }
    ],
    icon: Heart,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 4,
    title: "Gathering Strength",
    phase: "H",
    phaseDescription: "Harness Support and Strategy",
    narrative: "Structure is a kind of medicine. Support is a kind of power.",
    questions: [
      { id: "daily_routines", text: "Do you use daily routines or tools to help you stay on track?" },
      { id: "support_systems", text: "Are there people or systems that you rely on to support your recovery?" },
      { id: "structured_plan", text: "Do you feel more in control when you follow a structured plan?" }
    ],
    icon: Target,
    gradient: "from-green-500 to-teal-500"
  },
  {
    id: 5,
    title: "Embracing the Shift",
    phase: "Y",
    phaseDescription: "Yield Again to Progress",
    narrative: "Healing isn't always linear. But awareness of change is a sign of growth.",
    questions: [
      { id: "recognizing_progress", text: "Are you recognizing progress, even in small ways, in your healing journey?" },
      { id: "flexibility", text: "Are you becoming more flexible in how you approach daily life and tasks?" },
      { id: "confident_pacing", text: "Do you feel more confident adjusting your pace to what your brain needs?" }
    ],
    icon: Brain,
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    id: 6,
    title: "Regaining Power",
    phase: "T",
    phaseDescription: "Take Back Control",
    narrative: "Control is built step by step—and it begins with choosing how to respond today.",
    questions: [
      { id: "setting_goals", text: "Are you setting goals for your day or week to regain a sense of control?" },
      { id: "shaping_healing", text: "Do you believe your decisions and actions are shaping your healing?" },
      { id: "rebuilding_trust", text: "Are you beginning to rebuild trust in your memory and judgment?" }
    ],
    icon: Target,
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    id: 7,
    title: "Becoming New",
    phase: "H",
    phaseDescription: "Heal Forward",
    narrative: "This version of you is growing. Not in spite of what happened, but through it.",
    questions: [
      { id: "self_kindness", text: "Are you practicing self-kindness and patience during setbacks?" },
      { id: "new_version", text: "Do you feel you are growing into a new version of yourself?" },
      { id: "meaningful_life", text: "Are you focused on creating a meaningful life going forward, not just returning to the past?" }
    ],
    icon: Heart,
    gradient: "from-pink-500 to-rose-500"
  },
  {
    id: 8,
    title: "Sharing the Light",
    phase: "M",
    phaseDescription: "Multiply the Mission",
    narrative: "Your healing has ripple effects. Maybe what hurt you can help someone else rise.",
    questions: [
      { id: "sharing_journey", text: "Do you feel inspired to share your recovery journey with others?" },
      { id: "supporting_others", text: "Are you exploring ways to support or encourage others going through similar challenges?" },
      { id: "greater_purpose", text: "Does your experience now feel like something that can lead to greater purpose or mission?" }
    ],
    icon: Users,
    gradient: "from-amber-500 to-yellow-500"
  }
];

// User-type-specific question variations
const userTypeQuestions: Record<UserType, Section[]> = {
  "brain-injury-recovery": baseSections,
  
  "cognitive-optimization": [
    {
      id: 1,
      title: "The Starting Point",
      phase: "M",
      phaseDescription: "Moment of Impact",
      narrative: "Every peak performer recognizes there was a moment when they decided to optimize their cognitive abilities.",
      questions: [
        { id: "replay_moment", text: "Do you reflect on the moment you decided to optimize your cognitive performance?" },
        { id: "something_broke", text: "Do you feel like your current thinking patterns need significant improvement?" },
        { id: "negative_thoughts", text: "Do you frequently experience thoughts that you're not reaching your cognitive potential?" }
      ],
      icon: Brain,
      gradient: "from-red-500 to-orange-500"
    },
    {
      id: 2,
      title: "Mental Clarity",
      phase: "Y",
      phaseDescription: "Yield to the Fog",
      narrative: "Even high performers experience moments when focus feels elusive and clarity seems just out of reach.",
      questions: [
        { id: "brain_fog", text: "Do you struggle to maintain deep focus when working on complex tasks?" },
        { id: "memory_issues", text: "Do you often forget important details or lose track of your priorities?" },
        { id: "overwhelm", text: "Do you feel mentally overwhelmed when juggling multiple high-level projects?" }
      ],
      icon: Brain,
      gradient: "from-gray-500 to-blue-400"
    },
    {
      id: 3,
      title: "Facing Performance",
      phase: "R",
      phaseDescription: "Reckon with Reality",
      narrative: "Growth begins with honest assessment. Understanding your current cognitive patterns is the foundation for optimization.",
      questions: [
        { id: "acceptance", text: "Have you honestly assessed your current cognitive performance levels?" },
        { id: "grief", text: "Do you sometimes feel frustrated with your current mental clarity and focus?" },
        { id: "exploring_new_ways", text: "Are you actively exploring new strategies to enhance your cognitive abilities?" }
      ],
      icon: Heart,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 4,
      title: "Building Systems",
      phase: "H",
      phaseDescription: "Harness Support and Strategy",
      narrative: "Peak performance requires intentional systems. The right frameworks become your cognitive edge.",
      questions: [
        { id: "daily_routines", text: "Do you use structured daily routines to optimize your mental performance?" },
        { id: "support_systems", text: "Do you have systems and tools that consistently support your cognitive growth?" },
        { id: "structured_plan", text: "Do you feel more empowered when following a structured cognitive development plan?" }
      ],
      icon: Target,
      gradient: "from-green-500 to-teal-500"
    },
    {
      id: 5,
      title: "Embracing Growth",
      phase: "Y",
      phaseDescription: "Yield Again to Progress",
      narrative: "Cognitive optimization isn't linear. Recognizing patterns in your mental performance is a sign of deepening self-awareness.",
      questions: [
        { id: "recognizing_progress", text: "Are you tracking and recognizing improvements in your cognitive performance?" },
        { id: "flexibility", text: "Are you becoming more flexible in adapting your thinking strategies to different challenges?" },
        { id: "confident_pacing", text: "Do you feel more confident in managing your mental energy throughout the day?" }
      ],
      icon: Brain,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      id: 6,
      title: "Taking Charge",
      phase: "T",
      phaseDescription: "Take Back Control",
      narrative: "Empowerment is built step by step—and it begins with taking deliberate action on your cognitive development.",
      questions: [
        { id: "setting_goals", text: "Are you setting specific goals to regain a sense of empowerment over your mental performance?" },
        { id: "shaping_healing", text: "Do you believe your daily decisions are actively shaping your cognitive abilities?" },
        { id: "rebuilding_trust", text: "Are you building greater trust in your mental capabilities and decision-making?" }
      ],
      icon: Target,
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      id: 7,
      title: "Becoming Optimized",
      phase: "H",
      phaseDescription: "Heal Forward",
      narrative: "This version of your cognitive self is evolving. You're not just improving, you're transforming how you think.",
      questions: [
        { id: "self_kindness", text: "Are you practicing patience with yourself during the cognitive optimization process?" },
        { id: "new_version", text: "Do you feel you are evolving into a more cognitively capable version of yourself?" },
        { id: "meaningful_life", text: "Are you focused on creating meaningful cognitive growth, not just quick fixes?" }
      ],
      icon: Heart,
      gradient: "from-pink-500 to-rose-500"
    },
    {
      id: 8,
      title: "Sharing Excellence",
      phase: "M",
      phaseDescription: "Multiply the Mission",
      narrative: "Your cognitive growth has ripple effects. Your optimized thinking can inspire and elevate others.",
      questions: [
        { id: "sharing_journey", text: "Do you feel inspired to share your cognitive optimization journey with others?" },
        { id: "supporting_others", text: "Are you exploring ways to help others enhance their mental performance?" },
        { id: "greater_purpose", text: "Does your cognitive growth feel like it can contribute to something greater?" }
      ],
      icon: Users,
      gradient: "from-amber-500 to-yellow-500"
    }
  ],

  "caregiver-support": [
    {
      id: 1,
      title: "The Call to Care",
      phase: "M",
      phaseDescription: "Moment of Impact",
      narrative: "Sometimes caring begins in a moment—when someone you love needs you in a way you never expected.",
      questions: [
        { id: "replay_moment", text: "Do you think about the moment you realized your loved one needed your care?" },
        { id: "something_broke", text: "Do you feel like your life changed dramatically when you became a caregiver?" },
        { id: "negative_thoughts", text: "Do you frequently worry about your ability to provide the care your loved one needs?" }
      ],
      icon: Brain,
      gradient: "from-red-500 to-orange-500"
    },
    {
      id: 2,
      title: "In the Uncertainty",
      phase: "Y",
      phaseDescription: "Yield to the Fog",
      narrative: "Caregiving can feel overwhelming. Like you're navigating uncharted territory without a clear map.",
      questions: [
        { id: "brain_fog", text: "Do you struggle to manage all your caregiving responsibilities without feeling mentally exhausted?" },
        { id: "memory_issues", text: "Do you often forget important appointments or tasks related to caregiving?" },
        { id: "overwhelm", text: "Do caregiving demands feel mentally and emotionally overwhelming?" }
      ],
      icon: Brain,
      gradient: "from-gray-500 to-blue-400"
    },
    {
      id: 3,
      title: "Facing the Challenge",
      phase: "R",
      phaseDescription: "Reckon with Reality",
      narrative: "Effective caregiving begins with honest acceptance. Understanding both your strengths and your limits.",
      questions: [
        { id: "acceptance", text: "Have you accepted the realities and challenges of your caregiving role?" },
        { id: "grief", text: "Do you sometimes feel sadness about how caregiving has changed your life?" },
        { id: "exploring_new_ways", text: "Are you learning new approaches to provide better care while caring for yourself?" }
      ],
      icon: Heart,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 4,
      title: "Building Support",
      phase: "H",
      phaseDescription: "Harness Support and Strategy",
      narrative: "You can't pour from an empty cup. Building support systems strengthens both you and your loved one.",
      questions: [
        { id: "daily_routines", text: "Do you use structured routines to manage your caregiving responsibilities?" },
        { id: "support_systems", text: "Do you have reliable support systems to help you in your caregiving journey?" },
        { id: "structured_plan", text: "Do you feel more empowered when you have a clear caregiving plan?" }
      ],
      icon: Target,
      gradient: "from-green-500 to-teal-500"
    },
    {
      id: 5,
      title: "Finding Balance",
      phase: "Y",
      phaseDescription: "Yield Again to Progress",
      narrative: "Caregiving is a journey of balance. Learning to care for others while caring for yourself takes wisdom and grace.",
      questions: [
        { id: "recognizing_progress", text: "Are you recognizing positive changes in your caregiving abilities and confidence?" },
        { id: "flexibility", text: "Are you becoming more adaptable in how you approach daily caregiving challenges?" },
        { id: "confident_pacing", text: "Do you feel more confident in balancing your loved one's needs with your own?" }
      ],
      icon: Brain,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      id: 6,
      title: "Taking Charge",
      phase: "T",
      phaseDescription: "Take Back Control",
      narrative: "Empowerment is built step by step—and it begins with making choices that honor both your wellbeing and theirs.",
      questions: [
        { id: "setting_goals", text: "Are you setting boundaries and goals to regain a sense of empowerment in your caregiving?" },
        { id: "shaping_healing", text: "Do you believe your caregiving choices are positively impacting your loved one's wellbeing?" },
        { id: "rebuilding_trust", text: "Are you building confidence in your caregiving abilities and judgment?" }
      ],
      icon: Target,
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      id: 7,
      title: "Growing Together",
      phase: "H",
      phaseDescription: "Heal Forward",
      narrative: "This caregiving journey is transforming you. You're becoming someone who can hold both strength and tenderness.",
      questions: [
        { id: "self_kindness", text: "Are you practicing self-compassion during challenging caregiving moments?" },
        { id: "new_version", text: "Do you feel you are growing into a more capable and compassionate caregiver?" },
        { id: "meaningful_life", text: "Are you focused on creating meaningful caregiving experiences, not just managing tasks?" }
      ],
      icon: Heart,
      gradient: "from-pink-500 to-rose-500"
    },
    {
      id: 8,
      title: "Supporting Others",
      phase: "M",
      phaseDescription: "Multiply the Mission",
      narrative: "Your caregiving experience has wisdom to offer. Your journey can light the way for other caregivers.",
      questions: [
        { id: "sharing_journey", text: "Do you feel inspired to share your caregiving insights with other caregivers?" },
        { id: "supporting_others", text: "Are you finding ways to support and encourage other caregivers?" },
        { id: "greater_purpose", text: "Does your caregiving experience feel like it contributes to a greater mission of care?" }
      ],
      icon: Users,
      gradient: "from-amber-500 to-yellow-500"
    }
  ],

  "wellness-productivity": [
    {
      id: 1,
      title: "The Starting Point",
      phase: "M",
      phaseDescription: "Moment of Impact",
      narrative: "Every transformation begins with a moment of recognition—when you realize it's time to build better systems for your life.",
      questions: [
        { id: "replay_moment", text: "Do you think about the moment you decided to improve your wellness and productivity?" },
        { id: "something_broke", text: "Do you feel like your current life systems need significant improvement?" },
        { id: "negative_thoughts", text: "Do you frequently feel frustrated with your current productivity and wellness habits?" }
      ],
      icon: Brain,
      gradient: "from-red-500 to-orange-500"
    },
    {
      id: 2,
      title: "In the Chaos",
      phase: "Y",
      phaseDescription: "Yield to the Fog",
      narrative: "Life can feel scattered and overwhelming. Like you're busy but not productive, moving but not progressing.",
      questions: [
        { id: "brain_fog", text: "Do you struggle to maintain focus and clarity throughout your busy days?" },
        { id: "memory_issues", text: "Do you often forget important tasks or feel like you're constantly playing catch-up?" },
        { id: "overwhelm", text: "Do your daily responsibilities feel chaotic and overwhelming?" }
      ],
      icon: Brain,
      gradient: "from-gray-500 to-blue-400"
    },
    {
      id: 3,
      title: "Facing Reality",
      phase: "R",
      phaseDescription: "Reckon with Reality",
      narrative: "Real change begins with honest assessment. Understanding your current patterns is the first step to transformation.",
      questions: [
        { id: "acceptance", text: "Have you honestly assessed your current wellness and productivity patterns?" },
        { id: "grief", text: "Do you sometimes feel disappointed with your current lifestyle and habits?" },
        { id: "exploring_new_ways", text: "Are you actively exploring new systems to improve your daily effectiveness?" }
      ],
      icon: Heart,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 4,
      title: "Building Structure",
      phase: "H",
      phaseDescription: "Harness Support and Strategy",
      narrative: "Sustainable wellness and productivity come from intentional structure. The right systems become your foundation.",
      questions: [
        { id: "daily_routines", text: "Do you use consistent daily routines to support your wellness and productivity?" },
        { id: "support_systems", text: "Do you have tools and systems that reliably support your life organization?" },
        { id: "structured_plan", text: "Do you feel more empowered when following a structured approach to your day?" }
      ],
      icon: Target,
      gradient: "from-green-500 to-teal-500"
    },
    {
      id: 5,
      title: "Finding Flow",
      phase: "Y",
      phaseDescription: "Yield Again to Progress",
      narrative: "Building better habits isn't linear. Recognizing your natural rhythms helps you work with your energy, not against it.",
      questions: [
        { id: "recognizing_progress", text: "Are you noticing improvements in your daily productivity and wellness habits?" },
        { id: "flexibility", text: "Are you becoming more flexible in adapting your systems to what works for you?" },
        { id: "confident_pacing", text: "Do you feel more confident in managing your energy and time throughout the day?" }
      ],
      icon: Brain,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      id: 6,
      title: "Taking Charge",
      phase: "T",
      phaseDescription: "Take Back Control",
      narrative: "Empowerment is built step by step—and it begins with making deliberate choices about how you structure your life.",
      questions: [
        { id: "setting_goals", text: "Are you setting clear goals to regain a sense of empowerment over your daily life?" },
        { id: "shaping_healing", text: "Do you believe your daily choices are actively improving your wellness and productivity?" },
        { id: "rebuilding_trust", text: "Are you building confidence in your ability to maintain positive habits?" }
      ],
      icon: Target,
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      id: 7,
      title: "Living Better",
      phase: "H",
      phaseDescription: "Heal Forward",
      narrative: "This version of you is more organized and intentional. You're creating a life that supports who you want to become.",
      questions: [
        { id: "self_kindness", text: "Are you practicing patience with yourself as you build new wellness and productivity habits?" },
        { id: "new_version", text: "Do you feel you are becoming a more organized and wellness-focused version of yourself?" },
        { id: "meaningful_life", text: "Are you focused on creating sustainable lifestyle improvements, not just quick fixes?" }
      ],
      icon: Heart,
      gradient: "from-pink-500 to-rose-500"
    },
    {
      id: 8,
      title: "Inspiring Others",
      phase: "M",
      phaseDescription: "Multiply the Mission",
      narrative: "Your improved life systems inspire others. Your journey toward better wellness and productivity lights the way.",
      questions: [
        { id: "sharing_journey", text: "Do you feel inspired to share your wellness and productivity improvements with others?" },
        { id: "supporting_others", text: "Are you finding ways to help others build better life systems?" },
        { id: "greater_purpose", text: "Does your improved lifestyle feel like it contributes to inspiring positive change?" }
      ],
      icon: Users,
      gradient: "from-amber-500 to-yellow-500"
    }
  ]
};

// Function to get sections based on user type
export function getSectionsForUserType(userType?: UserType): Section[] {
  if (!userType) return baseSections;
  return userTypeQuestions[userType] || baseSections;
}

// Export the current sections based on user type (dynamic)
export function getCurrentSections(): Section[] {
  const userType = localStorage.getItem("myrhythm_user_type") as UserType | null;
  return getSectionsForUserType(userType || undefined);
}

// Keep the default export as sections for backward compatibility
export const sections = baseSections;

export const scaleLabels = ["Not at all", "Rarely", "Often", "Very much so"];
