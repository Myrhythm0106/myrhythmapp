
import React from 'react';
import { 
  Heart, 
  HeartPulse, 
  Users,
  Home,
  Info,
  Calendar,
  Brain,
  Target,
  Repeat
} from "lucide-react";

export interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  video: string;
}

export const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to MyRhythm",
    description: "Your personal brain health companion. Let's explore how MyRhythm can help support your journey to recovery and well-being.",
    icon: <Heart className="h-12 w-12 text-primary" />,
    video: "welcome-intro.mp4"
  },
  {
    title: "Dashboard Overview",
    description: "Your personalized hub shows key health metrics, upcoming events, mood tracking, and quick access to all features when you need them most.",
    icon: <Home className="h-12 w-12 text-primary" />,
    video: "dashboard-overview.mp4"
  },
  {
    title: "Health & Symptom Tracking",
    description: "Record symptoms daily, track your mood, and practice gratitude. Get insights into patterns and share reports with your healthcare team.",
    icon: <HeartPulse className="h-12 w-12 text-primary" />,
    video: "symptom-tracking.mp4"
  },
  {
    title: "Smart Calendar & Recurring Events",
    description: "Never miss appointments or medications. Set up recurring therapy sessions, create reminders, and link events to your recovery goals.",
    icon: <Calendar className="h-12 w-12 text-primary" />,
    video: "calendar-usage.mp4"
  },
  {
    title: "Goal Setting & Progress Tracking",
    description: "Set meaningful recovery goals, break them into manageable steps, and track your progress with visual indicators and celebrations.",
    icon: <Target className="h-12 w-12 text-primary" />,
    video: "goals-tracking.mp4"
  },
  {
    title: "Brain Games & Cognitive Training",
    description: "Strengthen your cognitive abilities with specially designed brain games. Track your progress and adapt difficulty levels to your needs.",
    icon: <Brain className="h-12 w-12 text-primary" />,
    video: "brain-games.mp4"
  },
  {
    title: "Community & Support Circle",
    description: "Connect with others on similar journeys. Add family, friends, and caregivers to coordinate care and receive meaningful support.",
    icon: <Users className="h-12 w-12 text-primary" />,
    video: "community-connections.mp4"
  },
  {
    title: "Ready to Begin Your Journey?",
    description: "You can revisit these tutorials anytime in the 'Useful Info' section. We're excited to be part of your health journey and recovery!",
    icon: <Info className="h-12 w-12 text-primary" />,
    video: "getting-started.mp4"
  }
];
