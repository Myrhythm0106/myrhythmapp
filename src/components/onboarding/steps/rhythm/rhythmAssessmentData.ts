
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

export const sections: Section[] = [
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

export const scaleLabels = ["Not at all", "Rarely", "Often", "Very much so"];
