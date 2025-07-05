
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
  Repeat,
  Zap,
  Star
} from "lucide-react";

export interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  video: string;
}

export const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to Your MyRhythm Journey",
    description: "MyRhythm is built on three simple but powerful concepts that work together to support your brain health and help you live your best life.",
    icon: <Heart className="h-12 w-12 text-primary" />,
    video: "welcome-intro.mp4"
  },
  {
    title: "Memory1st/Brain Health Foundation",
    description: "Think of your brain like a garden that needs gentle tending. We start with Memory1st principles - creating structure and routine that helps your brain heal, grow, and thrive at your own pace.",
    icon: <Brain className="h-12 w-12 text-green-600" />,
    video: "brain-health-foundation.mp4"
  },
  {
    title: "MYRHYTHM Process - Your 8-Step Journey",
    description: "MYRHYTHM is your personal process to discover and live your unique rhythm. Like a heartbeat, it's steady, reliable, and uniquely yours. We'll guide you through 8 gentle steps that build on each other.",
    icon: <Heart className="h-12 w-12 text-blue-600" />,
    video: "myrhythm-process.mp4"
  },
  {
    title: "LEAP Outcome - Live Empowered, Authentic & Productive", 
    description: "LEAP is where you're headed - living a life that's Empowered (you have what you need), Authentic (true to yourself), and Productive (focused on what matters most).",
    icon: <Zap className="h-12 w-12 text-purple-600" />,
    video: "leap-outcome.mp4"
  },
  {
    title: "Dashboard - Your Daily Home Base",
    description: "Your dashboard shows today's focus using Memory1st principles - simple, clear, and brain-friendly. Check in with yourself, see what's important today, and celebrate your wins.",
    icon: <Home className="h-12 w-12 text-primary" />,
    video: "dashboard-overview.mp4"
  },
  {
    title: "Smart Calendar - MYRHYTHM Scheduling",
    description: "Your calendar adapts to your rhythm. Set gentle reminders, create routines that support your brain health, and link activities to your LEAP goals. Never overwhelm, always empower.",
    icon: <Calendar className="h-12 w-12 text-primary" />,
    video: "calendar-usage.mp4"
  },
  {
    title: "Goal Setting - From Dreams to Daily Steps",
    description: "Turn big dreams into LEAP goals using Memory1st principles. Break everything into brain-friendly steps, celebrate small wins, and track progress in a way that feels encouraging, not overwhelming.",
    icon: <Target className="h-12 w-12 text-primary" />,
    video: "goals-tracking.mp4"
  },
  {
    title: "Community & Support Circle",
    description: "Connect with others on similar journeys. Add family, friends, and caregivers to your support circle. Share your LEAP progress and receive encouragement that understands your unique path.",
    icon: <Users className="h-12 w-12 text-primary" />,
    video: "community-connections.mp4"
  },
  {
    title: "Ready to Start Your LEAP Journey?",
    description: "You now understand the MyRhythm approach: Memory1st foundation, MYRHYTHM process, and LEAP outcome. Remember, this is your rhythm, your pace, your journey. We're here to support you every step of the way.",
    icon: <Star className="h-12 w-12 text-primary" />,
    video: "getting-started.mp4"
  }
];
