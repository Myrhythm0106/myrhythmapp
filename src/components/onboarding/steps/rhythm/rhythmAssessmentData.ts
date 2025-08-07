import { UserType } from "@/types/user";
import { 
  Brain, 
  Heart, 
  Zap, 
  Target, 
  Users, 
  Shield,
  TrendingUp,
  Lightbulb
} from "lucide-react";
import { ForwardRefExoticComponent } from "react";

export interface Section {
  id: number;
  title: string;
  phase: string;
  phaseDescription: string;
  narrative: string;
  questions: {
    id: string;
    text: string;
  }[];
  icon: ForwardRefExoticComponent<any>;
  gradient: string;
}

export interface AssessmentResponses {
  [questionId: string]: any;
}

export const responseOptions = [
  { label: 'Not at all', value: 1 },
  { label: 'Slightly', value: 2 },
  { label: 'Moderately', value: 3 },
  { label: 'Quite a bit', value: 4 },
  { label: 'Very much', value: 5 },
];

export const assessmentSections: Record<UserType, Section[]> = {
  "brain-injury": [
    {
      id: 1,
      title: "Cognitive Foundation",
      phase: "Rebuilding",
      phaseDescription: "Establishing basic cognitive functions",
      narrative: "Let's start by assessing your current cognitive abilities and identifying areas for improvement.",
      questions: [
        {
          id: "bi_memory",
          text: "How would you rate your short-term memory?"
        },
        {
          id: "bi_focus",
          text: "How well can you concentrate on tasks?"
        },
        {
          id: "bi_problem_solving",
          text: "How easily can you solve simple problems?"
        }
      ],
      icon: Brain,
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      id: 2,
      title: "Emotional Resilience",
      phase: "Regulation",
      phaseDescription: "Developing emotional coping strategies",
      narrative: "Emotional regulation is key to recovery. Let's explore your emotional wellbeing.",
      questions: [
        {
          id: "bi_mood",
          text: "How often do you experience mood swings?"
        },
        {
          id: "bi_anxiety",
          text: "How frequently do you feel anxious or stressed?"
        },
        {
          id: "bi_frustration",
          text: "How easily do you get frustrated?"
        }
      ],
      icon: Heart,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      id: 3,
      title: "Physical Wellbeing",
      phase: "Rehabilitation",
      phaseDescription: "Integrating physical activity for cognitive benefits",
      narrative: "Physical health supports cognitive recovery. Let's assess your physical activity levels.",
      questions: [
        {
          id: "bi_exercise",
          text: "How often do you engage in physical exercise?"
        },
        {
          id: "bi_fatigue",
          text: "How often do you feel fatigued?"
        },
        {
          id: "bi_sleep",
          text: "How would you rate your sleep quality?"
        }
      ],
      icon: Zap,
      gradient: "from-green-500 to-emerald-600"
    }
  ],
  
  "cognitive-optimization": [
    {
      id: 1,
      title: "Cognitive Performance",
      phase: "Assessment",
      phaseDescription: "Evaluating current cognitive strengths",
      narrative: "Let's assess your cognitive performance and identify areas for optimization.",
      questions: [
        {
          id: "cp_focus",
          text: "How well can you maintain focus during tasks?"
        },
        {
          id: "cp_memory",
          text: "How would you rate your memory recall?"
        },
        {
          id: "cp_problem_solving",
          text: "How effective are you at solving complex problems?"
        }
      ],
      icon: Brain,
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      id: 2,
      title: "Lifestyle Integration",
      phase: "Optimization",
      phaseDescription: "Integrating habits for cognitive enhancement",
      narrative: "Your lifestyle choices impact your cognitive abilities. Let's explore your daily habits.",
      questions: [
        {
          id: "cp_sleep",
          text: "How consistently do you get quality sleep?"
        },
        {
          id: "cp_nutrition",
          text: "How healthy is your diet?"
        },
        {
          id: "cp_stress",
          text: "How well do you manage stress?"
        }
      ],
      icon: Heart,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      id: 3,
      title: "Strategic Planning",
      phase: "Enhancement",
      phaseDescription: "Developing strategies for cognitive growth",
      narrative: "Strategic planning can enhance cognitive performance. Let's assess your planning skills.",
      questions: [
        {
          id: "cp_goal_setting",
          text: "How effectively do you set and achieve goals?"
        },
        {
          id: "cp_time_management",
          text: "How well do you manage your time?"
        },
        {
          id: "cp_learning",
          text: "How open are you to learning new things?"
        }
      ],
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-600"
    }
  ],
  
  "empowerment": [
    {
      id: 1,
      title: "Personal Empowerment Foundation",
      phase: "Self-Discovery",
      phaseDescription: "Understanding your inner strength and potential",
      narrative: "Let's explore your natural leadership qualities and personal power.",
      questions: [
        {
          id: "emp_confidence",
          text: "How confident do you feel in making important decisions for yourself?"
        },
        {
          id: "emp_advocacy",
          text: "How comfortable are you advocating for your needs and beliefs?"
        },
        {
          id: "emp_leadership",
          text: "How often do others look to you for guidance or leadership?"
        }
      ],
      icon: Lightbulb,
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      id: 2,
      title: "Goal Achievement & Vision",
      phase: "Vision Building",
      phaseDescription: "Creating and pursuing meaningful goals",
      narrative: "Your ability to set and achieve meaningful goals shapes your empowered life.",
      questions: [
        {
          id: "emp_goals",
          text: "How clear are you about your long-term personal goals?"
        },
        {
          id: "emp_action",
          text: "How consistently do you take action toward your important goals?"
        },
        {
          id: "emp_obstacles",
          text: "How effectively do you overcome obstacles and setbacks?"
        }
      ],
      icon: Target,
      gradient: "from-orange-500 to-red-600"
    }
  ],
  
  "brain-health": [
    {
      id: 1,
      title: "Cognitive Wellness Foundation",
      phase: "Brain Health Assessment",
      phaseDescription: "Understanding your cognitive wellness baseline",
      narrative: "Let's assess your current cognitive health and identify areas for optimization.",
      questions: [
        {
          id: "bh_memory",
          text: "How would you rate your day-to-day memory function?"
        },
        {
          id: "bh_focus",
          text: "How well can you maintain focus during important tasks?"
        },
        {
          id: "bh_mental_energy",
          text: "How consistent is your mental energy throughout the day?"
        }
      ],
      icon: Brain,
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      id: 2,
      title: "Lifestyle & Brain Health",
      phase: "Wellness Integration",
      phaseDescription: "Connecting lifestyle choices to cognitive wellness",
      narrative: "Your daily habits significantly impact your brain health and cognitive performance.",
      questions: [
        {
          id: "bh_sleep",
          text: "How consistently do you get quality, restorative sleep?"
        },
        {
          id: "bh_exercise",
          text: "How regularly do you engage in physical exercise or movement?"
        },
        {
          id: "bh_stress",
          text: "How well do you manage daily stress and maintain mental calm?"
        }
      ],
      icon: Heart,
      gradient: "from-green-500 to-emerald-600"
    }
  ],
  
  "caregiver": [
    {
      id: 1,
      title: "Emotional Support",
      phase: "Self-Care",
      phaseDescription: "Assessing your emotional wellbeing as a caregiver",
      narrative: "Let's explore your emotional state and coping mechanisms.",
      questions: [
        {
          id: "cg_stress",
          text: "How often do you feel overwhelmed by caregiving responsibilities?"
        },
        {
          id: "cg_burnout",
          text: "How frequently do you experience burnout?"
        },
        {
          id: "cg_support",
          text: "How supported do you feel by others?"
        }
      ],
      icon: Heart,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      id: 2,
      title: "Time Management",
      phase: "Balance",
      phaseDescription: "Balancing caregiving with personal needs",
      narrative: "Effective time management is crucial for caregivers. Let's assess your time management skills.",
      questions: [
        {
          id: "cg_time",
          text: "How well do you manage your time?"
        },
        {
          id: "cg_breaks",
          text: "How often do you take breaks from caregiving?"
        },
        {
          id: "cg_priorities",
          text: "How easily can you prioritize tasks?"
        }
      ],
      icon: Calendar,
      gradient: "from-orange-500 to-red-600"
    }
  ],
  
  "wellness": [
    {
      id: 1,
      title: "Lifestyle Assessment",
      phase: "Evaluation",
      phaseDescription: "Evaluating current lifestyle habits",
      narrative: "Let's assess your current lifestyle and identify areas for improvement.",
      questions: [
        {
          id: "wl_nutrition",
          text: "How healthy is your diet?"
        },
        {
          id: "wl_exercise",
          text: "How often do you exercise?"
        },
        {
          id: "wl_sleep",
          text: "How would you rate your sleep quality?"
        }
      ],
      icon: Zap,
      gradient: "from-green-500 to-emerald-600"
    },
    {
      id: 2,
      title: "Mindfulness Practices",
      phase: "Integration",
      phaseDescription: "Integrating mindfulness into daily life",
      narrative: "Mindfulness can enhance overall wellbeing. Let's explore your mindfulness practices.",
      questions: [
        {
          id: "wl_meditation",
          text: "How often do you meditate?"
        },
        {
          id: "wl_stress",
          text: "How well do you manage stress?"
        },
        {
          id: "wl_relaxation",
          text: "How often do you engage in relaxation techniques?"
        }
      ],
      icon: Heart,
      gradient: "from-purple-500 to-pink-600"
    }
  ],
  
  "medical-professional": [
    {
      id: 1,
      title: "Work-Life Balance",
      phase: "Assessment",
      phaseDescription: "Evaluating work-life balance",
      narrative: "Let's assess your work-life balance and identify areas for improvement.",
      questions: [
        {
          id: "mp_workload",
          text: "How manageable is your workload?"
        },
        {
          id: "mp_stress",
          text: "How often do you feel stressed at work?"
        },
        {
          id: "mp_breaks",
          text: "How often do you take breaks during work?"
        }
      ],
      icon: Shield,
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      id: 2,
      title: "Cognitive Demands",
      phase: "Optimization",
      phaseDescription: "Optimizing cognitive performance in clinical settings",
      narrative: "Your cognitive abilities are crucial in clinical settings. Let's explore your cognitive demands.",
      questions: [
        {
          id: "mp_focus",
          text: "How well can you maintain focus during complex tasks?"
        },
        {
          id: "mp_memory",
          text: "How reliable is your memory recall?"
        },
        {
          id: "mp_decision_making",
          text: "How effective are you at making quick decisions?"
        }
      ],
      icon: Brain,
      gradient: "from-blue-500 to-indigo-600"
    }
  ],
  
  "colleague": [
    {
      id: 1,
      title: "Team Collaboration",
      phase: "Assessment",
      phaseDescription: "Evaluating team collaboration skills",
      narrative: "Let's assess your team collaboration skills and identify areas for improvement.",
      questions: [
        {
          id: "cl_communication",
          text: "How effectively do you communicate with team members?"
        },
        {
          id: "cl_conflict_resolution",
          text: "How well do you resolve conflicts within the team?"
        },
        {
          id: "cl_support",
          text: "How supportive are you of your colleagues?"
        }
      ],
      icon: Users,
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      id: 2,
      title: "Innovation & Creativity",
      phase: "Enhancement",
      phaseDescription: "Enhancing innovation and creativity in the workplace",
      narrative: "Innovation and creativity are crucial for workplace success. Let's explore your creative abilities.",
      questions: [
        {
          id: "cl_ideas",
          text: "How often do you generate new ideas?"
        },
        {
          id: "cl_problem_solving",
          text: "How creative are you at solving problems?"
        },
        {
          id: "cl_openness",
          text: "How open are you to new perspectives?"
        }
      ],
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-600"
    }
  ]
};
