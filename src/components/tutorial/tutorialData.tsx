
import React from 'react';
import { 
  Heart, 
  HeartPulse, 
  Users,
  Home,
  Info,
  Calendar
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
    description: "Your personal brain health companion. Let's explore how MyRhythm can help support your journey.",
    icon: <Heart className="h-12 w-12 text-primary" />,
    video: "welcome-intro.mp4"
  },
  {
    title: "Dashboard",
    description: "Your personalized hub shows your key health metrics, upcoming events, and quick access to resources when you need them most.",
    icon: <Home className="h-12 w-12 text-primary" />,
    video: "dashboard-overview.mp4"
  },
  {
    title: "Symptom Tracking",
    description: "Record symptoms daily to identify patterns. Get insights into triggers and share reports with your healthcare team.",
    icon: <HeartPulse className="h-12 w-12 text-primary" />,
    video: "symptom-tracking.mp4"
  },
  {
    title: "Calendar",
    description: "Never miss an appointment or medication. Set reminders, manage your schedule, and keep your support team informed.",
    icon: <Calendar className="h-12 w-12 text-primary" />,
    video: "calendar-usage.mp4"
  },
  {
    title: "Community",
    description: "Connect with others on similar journeys. Share experiences, ask questions, and learn from both peers and experts.",
    icon: <Users className="h-12 w-12 text-primary" />,
    video: "community-connections.mp4"
  },
  {
    title: "My Support Circle",
    description: "Add family members, friends, or caregivers to your personal network. Share updates and coordinate care seamlessly.",
    icon: <Heart className="h-12 w-12 text-primary" />,
    video: "support-circle.mp4"
  },
  {
    title: "Ready to Begin?",
    description: "You can revisit these tutorials anytime in the 'Useful Info' section. We're excited to be part of your health journey!",
    icon: <Info className="h-12 w-12 text-primary" />,
    video: "getting-started.mp4"
  }
];
