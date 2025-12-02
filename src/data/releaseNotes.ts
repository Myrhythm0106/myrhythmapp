// Release Notes Data - What's New in MyRhythm
// This file is the single source of truth for feature releases

export interface ReleaseFeature {
  id: string;
  title: string;
  description: string;
  type: 'new' | 'improved' | 'fixed' | 'coming-soon';
  icon?: string;
  learnMoreUrl?: string;
}

export interface Release {
  version: string;
  date: string;
  title: string;
  description: string;
  features: ReleaseFeature[];
}

export const releases: Release[] = [
  {
    version: "0.2.0",
    date: "2024-12-01",
    title: "Brain Health & Daily Boost",
    description: "Major update with brain health reminders, daily challenges, and improved Memory Bridge",
    features: [
      {
        id: "brain-health-reminders",
        title: "Brain Health Reminders",
        description: "Progressive escalation system that adapts to your needs. Gentle nudges that grow stronger until you respond, with contextual memory anchors to help you remember why each task matters.",
        type: "new",
        icon: "🧠",
        learnMoreUrl: "/help/brain-health-reminders"
      },
      {
        id: "daily-brain-boost",
        title: "Daily Brain Boost",
        description: "240+ science-backed challenges covering cognitive, emotional, social, and physical wellness. Each day brings a new challenge with a 'Why this helps' explanation.",
        type: "new",
        icon: "💪",
        learnMoreUrl: "/help/daily-brain-boost"
      },
      {
        id: "streak-tracking",
        title: "Streak Tracking & Celebrations",
        description: "Build habits through visual streak displays. Celebrate your consistency with achievements at 3, 7, 14, and 30-day milestones.",
        type: "new",
        icon: "🔥"
      },
      {
        id: "promise-score",
        title: "Promise Score",
        description: "Track how many commitments you keep. Watch your Promise Score grow as you follow through on extracted action items.",
        type: "new",
        icon: "⭐"
      },
      {
        id: "memory-bridge-improved",
        title: "Memory Bridge Improvements",
        description: "Better audio processing, smarter action extraction, and real-time feedback during recording sessions.",
        type: "improved",
        icon: "🎙️"
      },
      {
        id: "app-signature",
        title: "App Signature",
        description: "Every screen now shows our gentle reminder: 'Every promise you keep builds trust. You're building something amazing.'",
        type: "new",
        icon: "💚"
      }
    ]
  },
  {
    version: "0.1.0",
    date: "2024-11-01",
    title: "Initial Release",
    description: "The foundation of MyRhythm - Memory Bridge, LEAP Assessment, and Support Circle",
    features: [
      {
        id: "memory-bridge-core",
        title: "Memory Bridge",
        description: "Record conversations and automatically extract action items, commitments, and important details.",
        type: "new",
        icon: "🎙️"
      },
      {
        id: "leap-assessment",
        title: "LEAP Assessment",
        description: "Discover your unique cognitive rhythm through our comprehensive assessment framework.",
        type: "new",
        icon: "📊"
      },
      {
        id: "support-circle",
        title: "Support Circle",
        description: "Connect trusted people as your safety net. They can receive updates and help keep you on track.",
        type: "new",
        icon: "👥"
      },
      {
        id: "calendar-integration",
        title: "Calendar Integration",
        description: "Extracted actions automatically create calendar events with reminders.",
        type: "new",
        icon: "📅"
      }
    ]
  }
];

export const comingSoon: ReleaseFeature[] = [
  {
    id: "voice-reminders",
    title: "Voice-Activated Reminders",
    description: "Set and receive reminders using just your voice. Perfect for hands-free moments.",
    type: "coming-soon",
    icon: "🗣️"
  },
  {
    id: "external-calendar-sync",
    title: "Apple/Google Calendar Sync",
    description: "Two-way sync with your existing calendars to keep everything in one place.",
    type: "coming-soon",
    icon: "🔄"
  },
  {
    id: "family-dashboard",
    title: "Family Sharing Dashboard",
    description: "Coordinate care across family members with shared views and collaborative planning.",
    type: "coming-soon",
    icon: "👨‍👩‍👧‍👦"
  },
  {
    id: "ai-insights",
    title: "AI-Powered Insights",
    description: "Personalized recommendations based on your patterns, progress, and cognitive profile.",
    type: "coming-soon",
    icon: "🤖"
  }
];

export const currentVersion = "0.2.0";

export function getLatestRelease(): Release {
  return releases[0];
}

export function getAllFeatures(): ReleaseFeature[] {
  return releases.flatMap(release => release.features);
}
