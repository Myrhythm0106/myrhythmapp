import { UserType } from "@/types/user";
import { Brain, Heart, Target, Users } from "lucide-react";

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
  "brain-injury": baseSections,
  
  "cognitive-optimization": [
    {
      id: 1,
      title: "Peak Performance Memory Goals",
      phase: "M",
      phaseDescription: "Moment of Impact - Memory Optimization Vision",
      narrative: "High performers recognize that memory is the foundation of cognitive excellence. Your journey to memory mastery starts with clarity about your goals.",
      questions: [
        { id: "memory_performance_gap", text: "Do you feel frustrated that your memory performance doesn't match your professional ambitions?" },
        { id: "memory_competitive_edge", text: "Do you believe superior memory abilities would give you a significant competitive advantage?" },
        { id: "memory_limitations", text: "Do you feel your current memory capabilities are limiting your career or personal growth?" },
        { id: "memory_optimization_urgency", text: "Do you have a strong urgency to optimize your memory for upcoming challenges or opportunities?" }
      ],
      icon: Brain,
      gradient: "from-red-500 to-orange-500"
    },
    {
      id: 2,
      title: "Cognitive Load & Mental Clarity",
      phase: "Y",
      phaseDescription: "Yield to Analysis - Memory Performance Assessment",
      narrative: "Even top performers experience moments when their memory feels overwhelmed. Understanding your patterns is key to optimization.",
      questions: [
        { id: "information_overload", text: "Do you struggle to retain important information when managing multiple high-stakes projects?" },
        { id: "memory_recall_pressure", text: "Do you worry about forgetting critical details during important meetings or presentations?" },
        { id: "cognitive_fatigue", text: "Does your memory performance decline significantly when you're mentally fatigued?" },
        { id: "memory_system_chaos", text: "Do you feel like your current memory systems are chaotic and need complete restructuring?" }
      ],
      icon: Brain,
      gradient: "from-gray-500 to-blue-400"
    },
    {
      id: 3,
      title: "Memory Performance Analysis",
      phase: "R",
      phaseDescription: "Reckon with Reality - Current Memory Capabilities",
      narrative: "Honest assessment of your memory strengths and weaknesses is essential for targeted optimization.",
      questions: [
        { id: "memory_strengths_weaknesses", text: "Have you clearly identified your specific memory strengths and areas for improvement?" },
        { id: "memory_technique_research", text: "Are you actively researching and experimenting with advanced memory techniques?" },
        { id: "memory_measurement", text: "Do you track and measure your memory performance to identify improvement opportunities?" },
        { id: "memory_pattern_recognition", text: "Have you identified specific patterns in when your memory performs at its peak vs. suboptimal levels?" }
      ],
      icon: Heart,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 4,
      title: "Memory Optimization Systems",
      phase: "H",
      phaseDescription: "Harness Systems - Memory Enhancement Tools",
      narrative: "Peak memory performance requires intentional systems, advanced techniques, and strategic tools for cognitive enhancement.",
      questions: [
        { id: "memory_techniques_daily", text: "Do you use advanced memory techniques (like mnemonics, memory palaces) in your daily professional work?" },
        { id: "memory_tech_stack", text: "Have you built a comprehensive tech stack specifically designed to enhance your memory capabilities?" },
        { id: "memory_training_regimen", text: "Do you follow a structured memory training regimen similar to how athletes train their bodies?" },
        { id: "memory_performance_metrics", text: "Do you have specific metrics and benchmarks for measuring your memory performance improvements?" }
      ],
      icon: Target,
      gradient: "from-green-500 to-teal-500"
    },
    {
      id: 5,
      title: "Memory Mastery Progress",
      phase: "Y",
      phaseDescription: "Yield to Growth - Memory Enhancement Results",
      narrative: "Memory optimization is an ongoing process. Recognizing progress while identifying next-level opportunities drives continuous improvement.",
      questions: [
        { id: "memory_performance_gains", text: "Are you seeing measurable improvements in your memory performance and information retention?" },
        { id: "memory_confidence_professional", text: "Do you feel more confident in high-pressure situations because of your enhanced memory capabilities?" },
        { id: "memory_efficiency_gains", text: "Have you noticed significant efficiency gains in how quickly you can learn and retain new information?" },
        { id: "memory_competitive_advantage", text: "Are you experiencing a noticeable competitive advantage due to your superior memory performance?" }
      ],
      icon: Brain,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      id: 6,
      title: "Memory Excellence & Control",
      phase: "T",
      phaseDescription: "Take Control - Memory Mastery Leadership",
      narrative: "True memory mastery means taking complete control of your cognitive capabilities and using them strategically for maximum impact.",
      questions: [
        { id: "memory_strategic_advantage", text: "Do you strategically leverage your memory capabilities to create competitive advantages in your field?" },
        { id: "memory_leadership_tool", text: "Are you using your enhanced memory as a leadership tool to inspire and guide others?" },
        { id: "memory_decision_making", text: "Has your improved memory significantly enhanced your decision-making speed and accuracy?" },
        { id: "memory_expertise_reputation", text: "Are you becoming known in your field for having exceptional memory and cognitive capabilities?" }
      ],
      icon: Target,
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      id: 7,
      title: "Cognitive Excellence Evolution",
      phase: "H",
      phaseDescription: "Heal Forward - Memory Innovation",
      narrative: "You're evolving into someone with elite-level memory capabilities. This transformation opens new possibilities for impact and achievement.",
      questions: [
        { id: "memory_innovation", text: "Are you innovating new memory techniques or systems that could benefit others in your field?" },
        { id: "memory_peak_potential", text: "Do you feel you're approaching your peak memory potential and consistently performing at elite levels?" },
        { id: "memory_life_transformation", text: "Has your memory optimization transformed not just your work but your entire approach to life and learning?" },
        { id: "memory_mastery_identity", text: "Do you identify as someone with exceptional memory capabilities and cognitive excellence?" }
      ],
      icon: Heart,
      gradient: "from-pink-500 to-rose-500"
    },
    {
      id: 8,
      title: "Memory Leadership & Legacy",
      phase: "M",
      phaseDescription: "Multiply Impact - Memory Excellence Sharing",
      narrative: "Your memory mastery journey positions you to lead others toward cognitive excellence and create lasting impact through shared knowledge.",
      questions: [
        { id: "memory_knowledge_sharing", text: "Do you feel called to share your memory optimization knowledge and techniques with other high performers?" },
        { id: "memory_mentorship", text: "Are you interested in mentoring others who want to achieve memory excellence in their fields?" },
        { id: "memory_thought_leadership", text: "Do you want to become a thought leader in cognitive optimization and memory enhancement?" },
        { id: "memory_legacy_impact", text: "Does building a legacy around memory excellence and cognitive optimization excite and motivate you?" }
      ],
      icon: Users,
      gradient: "from-amber-500 to-yellow-500"
    }
  ],

  "caregiver": [
    {
      id: 1,
      title: "The Caregiver's Memory Burden",
      phase: "M",
      phaseDescription: "Moment of Impact - When Memory Became Your Responsibility",
      narrative: "The moment you realized you're carrying the memory load for two people changes everything. Your mind became the keeper of their memories too.",
      questions: [
        { id: "double_memory_load", text: "Do you feel overwhelmed remembering medical appointments, medications, and daily tasks for both yourself and your loved one?" },
        { id: "memory_anxiety", text: "Do you constantly worry about forgetting something important that could affect your loved one's health or safety?" },
        { id: "lost_own_memory", text: "Do you feel like caring for their memory needs has made you forget about your own memory and mental needs?" },
        { id: "memory_responsibility_weight", text: "Does the weight of being responsible for someone else's memory feel overwhelming and exhausting?" }
      ],
      icon: Brain,
      gradient: "from-red-500 to-orange-500"
    },
    {
      id: 2,
      title: "Living in Memory Fog",
      phase: "Y",
      phaseDescription: "Yield to Overwhelm - Caregiver Memory Exhaustion",
      narrative: "Caregiver stress creates its own kind of fog. When you're caring for someone's memory, your own can suffer from emotional and physical exhaustion.",
      questions: [
        { id: "caregiver_brain_fog", text: "Do you experience brain fog and forgetfulness due to the stress and exhaustion of caregiving?" },
        { id: "memory_mistakes_guilt", text: "Do you feel guilty when you forget things related to your loved one's care, even though you're doing your best?" },
        { id: "competing_priorities", text: "Do you struggle to remember your own important tasks because your mind is always focused on their needs?" },
        { id: "memory_support_isolation", text: "Do you feel alone in managing all the memory-related responsibilities for your loved one?" }
      ],
      icon: Brain,
      gradient: "from-gray-500 to-blue-400"
    },
    {
      id: 3,
      title: "Accepting the Caregiver Reality",
      phase: "R",
      phaseDescription: "Reckon with Reality - Caregiver Memory Challenges",
      narrative: "Acknowledging that caregiving affects your own memory and mental capacity is not failure—it's the first step toward getting support.",
      questions: [
        { id: "caregiver_memory_impact", text: "Have you accepted that caregiving has impacted your own memory and cognitive abilities?" },
        { id: "grief_old_life", text: "Do you grieve for the time when you only had to worry about your own memory and mental tasks?" },
        { id: "seeking_memory_help", text: "Are you beginning to look for tools and strategies to help manage the memory load for both of you?" },
        { id: "caregiver_support_need", text: "Are you recognizing that you need specific support systems designed for caregivers' unique memory challenges?" }
      ],
      icon: Heart,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 4,
      title: "Building Caregiver Memory Systems",
      phase: "H",
      phaseDescription: "Harness Support - Memory Tools for Caregivers",
      narrative: "Effective caregiving requires systems that support both your loved one's memory needs and protect your own mental capacity.",
      questions: [
        { id: "dual_memory_systems", text: "Have you created systems that help you manage both your loved one's memory needs and your own?" },
        { id: "caregiver_memory_tools", text: "Do you use specific apps, calendars, or tools designed to help caregivers track medical and daily care information?" },
        { id: "memory_backup_support", text: "Do you have backup support systems for when your own memory feels overwhelmed or unreliable?" },
        { id: "caregiver_self_care", text: "Are you intentionally protecting time and mental space for your own memory and cognitive health?" }
      ],
      icon: Target,
      gradient: "from-green-500 to-teal-500"
    },
    {
      id: 5,
      title: "Caregiver Memory Progress",
      phase: "Y",
      phaseDescription: "Yield to Growth - Finding Balance in Memory Management",
      narrative: "Progress as a caregiver means finding ways to manage memory responsibilities without losing yourself in the process.",
      questions: [
        { id: "memory_balance_progress", text: "Are you finding better balance between managing their memory needs and preserving your own mental clarity?" },
        { id: "caregiver_confidence", text: "Do you feel more confident in your ability to handle the memory demands of caregiving?" },
        { id: "memory_stress_reduction", text: "Have you noticed reduced stress and anxiety about forgetting important caregiving tasks?" },
        { id: "dual_memory_management", text: "Are you successfully managing both their memory support needs and your own cognitive health?" }
      ],
      icon: Brain,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      id: 6,
      title: "Empowered Caregiver Memory",
      phase: "T",
      phaseDescription: "Take Control - Caregiver Memory Leadership",
      narrative: "Taking control as a caregiver means being strategic about memory management and advocating for both their needs and your own.",
      questions: [
        { id: "caregiver_memory_advocacy", text: "Do you actively advocate for memory support resources for both yourself and your loved one?" },
        { id: "memory_delegation", text: "Are you learning to delegate some memory-related tasks to other family members or professional support?" },
        { id: "caregiver_memory_boundaries", text: "Have you established healthy boundaries around memory responsibilities to protect your own cognitive health?" },
        { id: "memory_crisis_management", text: "Do you feel prepared to handle memory-related crises or emergencies with confidence?" }
      ],
      icon: Target,
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      id: 7,
      title: "Caregiver Memory Mastery",
      phase: "H",
      phaseDescription: "Heal Forward - Caregiver Memory Excellence",
      narrative: "You're developing expertise in managing complex memory needs while maintaining your own cognitive health and emotional well-being.",
      questions: [
        { id: "caregiver_memory_expertise", text: "Do you feel you've developed real expertise in managing memory challenges for both yourself and your loved one?" },
        { id: "memory_resilience", text: "Have you built resilience in your own memory and cognitive abilities despite the demands of caregiving?" },
        { id: "caregiver_fulfillment", text: "Do you find meaning and fulfillment in your role as a memory advocate and supporter for your loved one?" },
        { id: "memory_growth_both", text: "Are you seeing positive growth in memory management for both yourself and the person you care for?" }
      ],
      icon: Heart,
      gradient: "from-pink-500 to-rose-500"
    },
    {
      id: 8,
      title: "Caregiver Memory Mission",
      phase: "M",
      phaseDescription: "Multiply Impact - Supporting Other Caregivers",
      narrative: "Your experience managing memory challenges as a caregiver positions you to help other families navigate similar journeys.",
      questions: [
        { id: "caregiver_memory_sharing", text: "Do you want to share your caregiver memory management strategies with other families facing similar challenges?" },
        { id: "caregiver_community", text: "Are you interested in building or joining communities of caregivers who support each other's memory and cognitive health?" },
        { id: "caregiver_advocacy", text: "Do you feel called to advocate for better memory support resources and recognition for caregivers?" },
        { id: "caregiver_legacy", text: "Does helping other caregivers develop better memory management strategies give your own journey deeper meaning?" }
      ],
      icon: Users,
      gradient: "from-amber-500 to-yellow-500"
    }
  ],

  "wellness": [
    {
      id: 1,
      title: "Memory & Life Organization Goals",
      phase: "M",
      phaseDescription: "Moment of Impact - Memory System Transformation",
      narrative: "The realization that better memory systems could revolutionize your productivity and life satisfaction marks the beginning of transformation.",
      questions: [
        { id: "memory_productivity_vision", text: "Do you have a clear vision of how improved memory systems could transform your daily productivity?" },
        { id: "memory_life_balance", text: "Do you believe better memory management could help you achieve better work-life balance?" },
        { id: "memory_overwhelm", text: "Do you feel overwhelmed by trying to remember all your personal and professional commitments without good systems?" },
        { id: "memory_potential_unlock", text: "Do you sense there's untapped potential in how you could organize and remember information in your life?" }
      ],
      icon: Brain,
      gradient: "from-red-500 to-orange-500"
    },
    {
      id: 2,
      title: "Memory & Productivity Struggles",
      phase: "Y",
      phaseDescription: "Yield to Analysis - Current Memory Limitations",
      narrative: "Recognizing where your current memory and organizational systems are failing helps identify the biggest opportunities for improvement.",
      questions: [
        { id: "task_memory_failure", text: "Do you frequently forget important tasks, deadlines, or commitments despite your best intentions?" },
        { id: "memory_system_chaos", text: "Do your current memory and organizational systems feel chaotic, unreliable, or inconsistent?" },
        { id: "memory_stress_anxiety", text: "Does worrying about forgetting important things create stress and anxiety in your daily life?" },
        { id: "memory_efficiency_loss", text: "Do you waste time trying to remember where you put things or what you were supposed to do?" }
      ],
      icon: Brain,
      gradient: "from-gray-500 to-blue-400"
    },
    {
      id: 3,
      title: "Memory & Wellness Assessment",
      phase: "R",
      phaseDescription: "Reckon with Reality - Memory Impact on Well-being",
      narrative: "Understanding how memory challenges affect your overall wellness helps prioritize what changes will have the biggest positive impact.",
      questions: [
        { id: "memory_wellness_connection", text: "Have you recognized the connection between your memory systems and your overall wellness and life satisfaction?" },
        { id: "memory_habit_tracking", text: "Are you interested in using memory techniques to better track and maintain healthy habits?" },
        { id: "memory_goal_achievement", text: "Do you see improved memory systems as key to achieving your personal and wellness goals?" },
        { id: "memory_mindfulness", text: "Are you exploring how mindfulness and memory techniques can work together to improve your life?" }
      ],
      icon: Heart,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 4,
      title: "Memory & Productivity Systems",
      phase: "H",
      phaseDescription: "Harness Tools - Memory Enhancement Implementation",
      narrative: "Building effective memory and productivity systems requires the right combination of tools, techniques, and consistent habits.",
      questions: [
        { id: "memory_productivity_tools", text: "Are you actively using memory-enhancing tools and apps to improve your personal productivity?" },
        { id: "memory_habit_systems", text: "Have you developed systems that help you remember and maintain important habits and routines?" },
        { id: "memory_information_management", text: "Do you have reliable systems for capturing, organizing, and retrieving important information in your life?" },
        { id: "memory_stress_reduction", text: "Are your memory systems designed to reduce stress and mental load rather than add complexity?" }
      ],
      icon: Target,
      gradient: "from-green-500 to-teal-500"
    },
    {
      id: 5,
      title: "Memory & Life Optimization",
      phase: "Y",
      phaseDescription: "Yield to Progress - Memory System Results",
      narrative: "Progress in memory and productivity systems creates positive momentum that builds on itself, leading to greater life satisfaction.",
      questions: [
        { id: "memory_life_improvement", text: "Are you seeing tangible improvements in your life quality due to better memory and organizational systems?" },
        { id: "memory_confidence_growth", text: "Do you feel more confident and in control of your daily life because of improved memory management?" },
        { id: "memory_time_freedom", text: "Have better memory systems freed up time and mental energy for things that matter most to you?" },
        { id: "memory_wellness_integration", text: "Are your memory systems successfully integrated with your broader wellness and self-care practices?" }
      ],
      icon: Brain,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      id: 6,
      title: "Memory & Life Mastery",
      phase: "T",
      phaseDescription: "Take Control - Memory-Driven Life Design",
      narrative: "Taking control means using memory systems strategically to design and live the life you truly want.",
      questions: [
        { id: "memory_life_design", text: "Are you using memory techniques to help design and achieve your ideal life and goals?" },
        { id: "memory_priority_focus", text: "Do your memory systems help you stay focused on your highest priorities and values?" },
        { id: "memory_decision_support", text: "Are you using memory techniques to make better decisions and learn from past experiences?" },
        { id: "memory_growth_mindset", text: "Do you see memory improvement as an ongoing journey that supports continuous personal growth?" }
      ],
      icon: Target,
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      id: 7,
      title: "Memory & Holistic Excellence",
      phase: "H",
      phaseDescription: "Heal Forward - Integrated Memory Wellness",
      narrative: "You're developing an integrated approach where memory, productivity, and wellness work together to create a fulfilling and effective life.",
      questions: [
        { id: "memory_holistic_integration", text: "Have you successfully integrated memory enhancement with your overall approach to health and wellness?" },
        { id: "memory_life_satisfaction", text: "Do you feel a strong sense of satisfaction and accomplishment in how you manage your memory and life organization?" },
        { id: "memory_inspiring_others", text: "Are you beginning to inspire others with your memory systems and life organization improvements?" },
        { id: "memory_continuous_innovation", text: "Do you enjoy continuously refining and innovating your memory and productivity systems?" }
      ],
      icon: Heart,
      gradient: "from-pink-500 to-rose-500"
    },
    {
      id: 8,
      title: "Memory & Life Leadership",
      phase: "M",
      phaseDescription: "Multiply Impact - Sharing Memory Wisdom",
      narrative: "Your journey in memory and life optimization positions you to help others create more organized, productive, and fulfilling lives.",
      questions: [
        { id: "memory_wisdom_sharing", text: "Do you want to share your memory and life organization strategies with others seeking similar improvements?" },
        { id: "memory_community_building", text: "Are you interested in building or joining communities focused on memory enhancement and life optimization?" },
        { id: "memory_mentoring", text: "Do you feel called to mentor others in developing better memory systems and life organization skills?" },
        { id: "memory_legacy_creation", text: "Does the idea of creating a lasting positive impact through memory and productivity wisdom excite you?" }
      ],
      icon: Users,
      gradient: "from-amber-500 to-yellow-500"
    }
  ],

  "medical-professional": [
    {
      id: 1,
      title: "Clinical Memory Goals",
      phase: "M",
      phaseDescription: "Moment of Impact - Professional Memory Vision",
      narrative: "As a healthcare professional, understanding memory challenges enhances your ability to provide comprehensive patient care and support.",
      questions: [
        { id: "clinical_memory_vision", text: "Do you see memory assessment and support as integral to your patient care approach?" },
        { id: "professional_development", text: "Are you motivated to enhance your clinical skills in memory-related patient support?" },
        { id: "evidence_based_practice", text: "Do you value evidence-based approaches to memory assessment and intervention?" },
        { id: "patient_centered_care", text: "Are you interested in incorporating memory wellness into your patient-centered care model?" }
      ],
      icon: Heart,
      gradient: "from-teal-500 to-emerald-500"
    },
    {
      id: 2,
      title: "Clinical Memory Assessment",
      phase: "Y",
      phaseDescription: "Your Reality - Current Clinical Practice",
      narrative: "Understanding your current knowledge and experience with memory-related patient care helps identify areas for professional growth.",
      questions: [
        { id: "current_clinical_knowledge", text: "Do you currently feel confident in your ability to assess and support patients with memory challenges?" },
        { id: "clinical_tools", text: "Do you have adequate tools and resources for memory-related patient assessment and support?" },
        { id: "interdisciplinary_approach", text: "Are you comfortable collaborating with other professionals in memory care?" },
        { id: "continuing_education", text: "Do you actively seek continuing education opportunities in memory and cognitive health?" }
      ],
      icon: Brain,
      gradient: "from-blue-500 to-indigo-500"
    }
  ],

  "colleague": [
    {
      id: 1,
      title: "Workplace Support Goals",
      phase: "M",
      phaseDescription: "Moment of Impact - Colleague Support Vision",
      narrative: "As a supportive colleague, you understand that cognitive challenges affect workplace dynamics and productivity, and you want to create a more inclusive environment.",
      questions: [
        { id: "workplace_inclusion_vision", text: "Do you have a vision for creating more inclusive workplace practices for colleagues with cognitive challenges?" },
        { id: "colleague_support_motivation", text: "Are you motivated to learn how to better support colleagues who may be experiencing memory or cognitive difficulties?" },
        { id: "team_productivity_enhancement", text: "Do you believe that supporting cognitive wellness could improve overall team productivity and collaboration?" },
        { id: "workplace_wellness_advocacy", text: "Are you interested in becoming an advocate for cognitive wellness and accessibility in your workplace?" }
      ],
      icon: Users,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      id: 2,
      title: "Workplace Understanding Assessment",
      phase: "Y", 
      phaseDescription: "Yield to Analysis - Current Workplace Dynamics",
      narrative: "Understanding current workplace challenges helps identify opportunities to create more supportive and productive environments for everyone.",
      questions: [
        { id: "workplace_awareness", text: "Have you observed how cognitive challenges can impact workplace performance and team dynamics?" },
        { id: "support_system_gaps", text: "Do you notice gaps in your workplace's support systems for colleagues with cognitive or memory challenges?" },
        { id: "communication_barriers", text: "Are you aware of communication barriers that might affect colleagues with cognitive differences?" },
        { id: "inclusive_practices_need", text: "Do you see opportunities to implement more inclusive practices in your daily work interactions?" }
      ],
      icon: Brain,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      title: "Collaborative Enhancement",
      phase: "R",
      phaseDescription: "Reckon with Reality - Team Support Implementation", 
      narrative: "Building supportive workplace relationships requires understanding, patience, and practical strategies that benefit everyone.",
      questions: [
        { id: "supportive_communication", text: "Are you developing communication strategies that work well for colleagues with different cognitive needs?" },
        { id: "inclusive_meeting_practices", text: "Do you advocate for meeting practices and workplace policies that are inclusive of cognitive differences?" },
        { id: "knowledge_sharing", text: "Are you actively sharing knowledge about cognitive wellness and workplace accessibility with your team?" },
        { id: "peer_mentoring", text: "Are you interested in providing peer mentoring or support for colleagues navigating cognitive challenges?" }
      ],
      icon: Heart,
      gradient: "from-green-500 to-teal-500"
    }
  ]
};

export const getCurrentSections = (): Section[] => baseSections;

export const getSectionsForUserType = (userType?: UserType): Section[] => {
  if (!userType) return baseSections;
  return userTypeQuestions[userType] || baseSections;
};

export const scaleLabels = [
  "Never / Not at all",
  "Rarely / A little", 
  "Sometimes / Moderately",
  "Often / Very much"
];
