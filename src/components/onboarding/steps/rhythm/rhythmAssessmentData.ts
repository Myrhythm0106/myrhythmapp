import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps, Brain, Heart, Users, Target, Calendar as CalendarIcon, TrendingUp, Stethoscope, UserCheck } from "lucide-react";
import { UserType } from "@/types/user";

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
  icon: ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;
  gradient: string;
}

export const scaleLabels = {
  1: "Never/Not at all",
  2: "Rarely/A little",
  3: "Sometimes/Moderately", 
  4: "Often/Quite a bit",
  5: "Always/Extremely"
};

export const assessmentSections: Record<UserType, Section[]> = {
  "brain-injury": [
    {
      id: 1,
      title: "Cognitive Foundation",
      phase: "Recovery & Rebuilding",
      phaseDescription: "Assessing core cognitive functions after brain injury",
      narrative: "Your recovery journey begins with understanding your current cognitive abilities.",
      questions: [
        { id: "bi_1_1", text: "I can remember important details from recent conversations" },
        { id: "bi_1_2", text: "I can focus on tasks without getting easily distracted" },
        { id: "bi_1_3", text: "I can plan and organize my daily activities effectively" }
      ],
      icon: Brain,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      id: 2,
      title: "Emotional Resilience",
      phase: "Emotional Regulation",
      phaseDescription: "Building emotional strength and coping mechanisms",
      narrative: "Emotional resilience is key to navigating the challenges of brain injury recovery.",
      questions: [
        { id: "bi_2_1", text: "I feel emotionally stable and balanced throughout the day" },
        { id: "bi_2_2", text: "I can manage feelings of frustration or sadness effectively" },
        { id: "bi_2_3", text: "I maintain a positive outlook despite challenges" }
      ],
      icon: Heart,
      gradient: "from-purple-500 to-pink-500"
    }
  ],
  "cognitive-optimization": [
    {
      id: 1,
      title: "Cognitive Performance",
      phase: "Performance Enhancement",
      phaseDescription: "Assessing cognitive strengths and areas for improvement",
      narrative: "Your journey to peak cognitive performance starts with understanding your current abilities.",
      questions: [
        { id: "co_1_1", text: "I can quickly process and analyze complex information" },
        { id: "co_1_2", text: "I can easily adapt to new situations and challenges" },
        { id: "co_1_3", text: "I can maintain focus and concentration for extended periods" }
      ],
      icon: Brain,
      gradient: "from-green-500 to-teal-500"
    },
    {
      id: 2,
      title: "Strategic Thinking",
      phase: "Strategic Planning",
      phaseDescription: "Developing strategic thinking and problem-solving skills",
      narrative: "Strategic thinking is essential for achieving your cognitive goals.",
      questions: [
        { id: "co_2_1", text: "I can effectively plan and execute complex projects" },
        { id: "co_2_2", text: "I can identify and solve problems creatively" },
        { id: "co_2_3", text: "I can make informed decisions under pressure" }
      ],
      icon: Target,
      gradient: "from-orange-500 to-red-500"
    }
  ],
  "empowerment": [
    {
      id: 1,
      title: "Personal Empowerment Foundation",
      phase: "Self-Discovery",
      phaseDescription: "Understanding your unique strengths and empowerment style",
      narrative: "Your empowerment journey begins with understanding your natural strengths and leadership style.",
      questions: [
        { id: "emp_1_1", text: "I feel confident making decisions that affect my daily life" },
        { id: "emp_1_2", text: "I believe I have valuable insights to share with others" },
        { id: "emp_1_3", text: "I take initiative when I see opportunities for improvement" }
      ],
      icon: Target,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      title: "Community Leadership",
      phase: "Connection Building",
      phaseDescription: "Developing your ability to inspire and lead others",
      narrative: "True empowerment grows when we lift others up alongside ourselves.",
      questions: [
        { id: "emp_2_1", text: "I enjoy helping others discover their potential" },
        { id: "emp_2_2", text: "People often come to me for advice or support" },
        { id: "emp_2_3", text: "I can effectively communicate my vision to others" }
      ],
      icon: Users,
      gradient: "from-blue-500 to-purple-500"
    }
  ],
  "brain-health": [
    {
      id: 1,
      title: "Cognitive Wellness Foundation",
      phase: "Brain Health Assessment",
      phaseDescription: "Understanding your current cognitive health and wellness patterns",
      narrative: "Your brain health journey starts with understanding your cognitive patterns and wellness habits.",
      questions: [
        { id: "bh_1_1", text: "I maintain consistent sleep patterns that support my cognitive health" },
        { id: "bh_1_2", text: "I engage in activities that challenge my brain regularly" },
        { id: "bh_1_3", text: "I feel mentally sharp and focused most days" }
      ],
      icon: Brain,
      gradient: "from-green-500 to-teal-500"
    },
    {
      id: 2,
      title: "Lifestyle Integration",
      phase: "Holistic Wellness",
      phaseDescription: "Integrating brain-healthy practices into daily life",
      narrative: "Sustainable brain health comes from consistent, integrated wellness practices.",
      questions: [
        { id: "bh_2_1", text: "I incorporate physical exercise that benefits my brain health" },
        { id: "bh_2_2", text: "I practice stress management techniques regularly" },
        { id: "bh_2_3", text: "I maintain social connections that support my mental wellness" }
      ],
      icon: Heart,
      gradient: "from-teal-500 to-blue-500"
    }
  ],
  caregiver: [
    {
      id: 1,
      title: "Caregiver Wellbeing",
      phase: "Support & Self-Care",
      phaseDescription: "Assessing your wellbeing as a caregiver",
      narrative: "Your wellbeing is essential to providing effective care.",
      questions: [
        { id: "cg_1_1", text: "I feel supported in my role as a caregiver" },
        { id: "cg_1_2", text: "I have time for my own needs and interests" },
        { id: "cg_1_3", text: "I can manage stress and prevent burnout" }
      ],
      icon: Heart,
      gradient: "from-pink-500 to-purple-500"
    },
    {
      id: 2,
      title: "Effective Communication",
      phase: "Communication Strategies",
      phaseDescription: "Improving communication with the person you care for",
      narrative: "Effective communication is key to providing quality care.",
      questions: [
        { id: "cg_2_1", text: "I can communicate effectively with the person I care for" },
        { id: "cg_2_2", text: "I can understand and respond to their needs" },
        { id: "cg_2_3", text: "I can resolve conflicts peacefully" }
      ],
      icon: Users,
      gradient: "from-teal-500 to-green-500"
    }
  ],
  wellness: [
    {
      id: 1,
      title: "Holistic Wellness",
      phase: "Holistic Wellness",
      phaseDescription: "Assessing your overall wellness and lifestyle",
      narrative: "Your overall wellness is key to a fulfilling life.",
      questions: [
        { id: "w_1_1", text: "I maintain a healthy diet and exercise regularly" },
        { id: "w_1_2", text: "I get enough sleep and manage stress effectively" },
        { id: "w_1_3", text: "I have strong social connections and support networks" }
      ],
      icon: Heart,
      gradient: "from-pink-500 to-purple-500"
    },
    {
      id: 2,
      title: "Mindfulness & Reflection",
      phase: "Mindfulness Practices",
      phaseDescription: "Practicing mindfulness and self-reflection",
      narrative: "Mindfulness and self-reflection are essential for personal growth.",
      questions: [
        { id: "w_2_1", text: "I practice mindfulness and meditation regularly" },
        { id: "w_2_2", text: "I reflect on my experiences and learn from them" },
        { id: "w_2_3", text: "I set meaningful goals and work towards them" }
      ],
      icon: TrendingUp,
      gradient: "from-teal-500 to-green-500"
    }
  ],
  "medical-professional": [
    {
      id: 1,
      title: "Professional Development",
      phase: "Professional Development",
      phaseDescription: "Assessing your professional development and expertise",
      narrative: "Your professional development is key to providing quality care.",
      questions: [
        { id: "mp_1_1", text: "I stay up-to-date with the latest medical research" },
        { id: "mp_1_2", text: "I attend conferences and workshops regularly" },
        { id: "mp_1_3", text: "I seek mentorship and guidance from experienced colleagues" }
      ],
      icon: Stethoscope,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      id: 2,
      title: "Patient Care",
      phase: "Patient Care Strategies",
      phaseDescription: "Improving patient care and communication",
      narrative: "Effective patient care is essential to your practice.",
      questions: [
        { id: "mp_2_1", text: "I communicate effectively with my patients" },
        { id: "mp_2_2", text: "I understand and respond to their needs" },
        { id: "mp_2_3", text: "I provide compassionate and empathetic care" }
      ],
      icon: UserCheck,
      gradient: "from-green-500 to-teal-500"
    }
  ],
  colleague: [
    {
      id: 1,
      title: "Collaboration & Teamwork",
      phase: "Growth & Learning",
      phaseDescription: "Assessing your collaboration and teamwork skills",
      narrative: "Your collaboration and teamwork skills are essential to your success.",
      questions: [
        { id: "c_1_1", text: "I collaborate effectively with my colleagues" },
        { id: "c_1_2", text: "I contribute to a positive team environment" },
        { id: "c_1_3", text: "I communicate effectively with my team members" }
      ],
      icon: Users,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      id: 2,
      title: "Personal Growth",
      phase: "Personal Development",
      phaseDescription: "Assessing your personal growth and development",
      narrative: "Your personal growth is key to your success.",
      questions: [
        { id: "c_2_1", text: "I seek opportunities for personal growth and development" },
        { id: "c_2_2", text: "I learn from my mistakes and challenges" },
        { id: "c_2_3", text: "I set meaningful goals and work towards them" }
      ],
      icon: TrendingUp,
      gradient: "from-green-500 to-teal-500"
    }
  ]
};
