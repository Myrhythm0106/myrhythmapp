import React from "react";
import { SearchResult } from "../types/searchTypes";
import { 
  Calendar, 
  Home, 
  Users, 
  Heart, 
  HeartPulse, 
  Info, 
  User,
  MapPin,
  FileText,
  CheckSquare,
  Sparkles,
  GamepadIcon,
  BookOpen,
  Brain,
  Mic,
  Target,
  PlayCircle,
  HelpCircle,
  Compass,
  HandHeart,
  MessageSquare,
  Clock
} from "lucide-react";

// Main navigation items
export const navigationItems: SearchResult[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    category: "Navigation",
    description: "Go to your dashboard",
    route: "/dashboard",
    icon: <Home className="h-4 w-4 mr-2" />
  },
  {
    id: "calendar",
    title: "Calendar",
    category: "Navigation",
    description: "View your calendar and events",
    route: "/calendar",
    icon: <Calendar className="h-4 w-4 mr-2" />
  },
  {
    id: "tracking",
    title: "Health Tracking",
    category: "Navigation",
    description: "Track your health and symptoms",
    route: "/tracking",
    icon: <HeartPulse className="h-4 w-4 mr-2" />
  },
  {
    id: "community",
    title: "Community",
    category: "Navigation",
    description: "Connect with your community",
    route: "/community",
    icon: <Users className="h-4 w-4 mr-2" />
  },
  {
    id: "personal-community",
    title: "Family Support Circle",
    category: "Navigation",
    description: "Connect with family and caregivers",
    route: "/personal-community",
    icon: <Heart className="h-4 w-4 mr-2" />
  },
  {
    id: "ecosystem",
    title: "Ecosystem Hub",
    category: "Navigation",
    description: "Your central command center - access all features",
    route: "/ecosystem",
    icon: <Compass className="h-4 w-4 mr-2" />
  },
  {
    id: "next-steps",
    title: "Next Steps",
    category: "Navigation",
    description: "View and manage your action items and next steps",
    route: "/next-steps",
    icon: <CheckSquare className="h-4 w-4 mr-2" />
  },
  {
    id: "memory-bank",
    title: "Memory Bank",
    category: "Navigation",
    description: "Store and retrieve important memories and moments",
    route: "/memory-bank",
    icon: <Brain className="h-4 w-4 mr-2" />
  },
  {
    id: "useful-info",
    title: "Useful Information",
    category: "Navigation",
    description: "Find useful resources and guides",
    route: "/useful-info",
    icon: <Info className="h-4 w-4 mr-2" />
  },
  {
    id: "profile",
    title: "My Profile",
    category: "Navigation",
    description: "View and edit your profile information",
    route: "/profile",
    icon: <User className="h-4 w-4 mr-2" />
  },
  {
    id: "local-services",
    title: "Local Services",
    category: "Navigation",
    description: "Find support services in your area",
    route: "/local-services",
    icon: <MapPin className="h-4 w-4 mr-2" />
  },
  {
    id: "resources",
    title: "Resources",
    category: "Navigation",
    description: "Access helpful resources and information",
    route: "/resources",
    icon: <FileText className="h-4 w-4 mr-2" />
  },
  {
    id: "gratitude",
    title: "Gratitude Journal",
    category: "Navigation", 
    description: "Record and track gratitude entries",
    route: "/gratitude",
    icon: <Sparkles className="h-4 w-4 mr-2" />
  },
];

// Memory Bridge and core features
export const memoryBridgeItems: SearchResult[] = [
  {
    id: "memory-bridge",
    title: "Memory Bridge",
    category: "Core Features",
    description: "Record conversations and extract A.C.T.S (Actions, Contacts, Tasks, Schedule)",
    route: "/memory-bridge",
    icon: <Brain className="h-4 w-4 mr-2" />
  },
  {
    id: "record-conversation",
    title: "Record conversation", 
    category: "Memory Bridge",
    description: "Start recording an important conversation",
    route: "/memory-bridge?action=record",
    icon: <Mic className="h-4 w-4 mr-2" />
  },
  {
    id: "extract-actions",
    title: "Extract actions",
    category: "Memory Bridge", 
    description: "View extracted Actions, Contacts, Tasks, and Schedule items",
    route: "/memory-bridge?tab=extractions",
    icon: <Target className="h-4 w-4 mr-2" />
  },
  {
    id: "schedule-from-bridge",
    title: "Schedule from bridge",
    category: "Memory Bridge",
    description: "Add Memory Bridge items to your calendar", 
    route: "/memory-bridge?tab=schedule",
    icon: <Calendar className="h-4 w-4 mr-2" />
  },
  {
    id: "voice-recording",
    title: "Voice recording",
    category: "Memory Bridge",
    description: "Record voice notes and conversations",
    route: "/memory-bridge",
    icon: <Mic className="h-4 w-4 mr-2" />
  },
  {
    id: "meeting-notes", 
    title: "Meeting notes",
    category: "Memory Bridge",
    description: "Capture and organize meeting information",
    route: "/memory-bridge",
    icon: <MessageSquare className="h-4 w-4 mr-2" />
  }
];

// Assessment and onboarding
export const assessmentItems: SearchResult[] = [
  {
    id: "rhythm-assessment", 
    title: "Rhythm Assessment",
    category: "Assessment",
    description: "Take your personalized cognitive assessment",
    route: "/mvp/assessment-flow",
    icon: <Brain className="h-4 w-4 mr-2" />
  },
  {
    id: "brain-health-check",
    title: "Brain Health Check", 
    category: "Assessment",
    description: "Quick brain health assessment",
    route: "/mvp/assessment-flow?type=brief",
    icon: <HeartPulse className="h-4 w-4 mr-2" />
  },
  {
    id: "assessment-results",
    title: "Assessment Results",
    category: "Assessment", 
    description: "View your assessment results and recommendations",
    route: "/dashboard?tab=assessments",
    icon: <Target className="h-4 w-4 mr-2" />
  }
];

// Onboarding and help
export const onboardingItems: SearchResult[] = [
  {
    id: "get-started-guide",
    title: "Get Started Guide",
    category: "Help",
    description: "Complete beginner's guide to MyRhythm",
    route: "/onboarding",
    icon: <PlayCircle className="h-4 w-4 mr-2" />
  },
  {
    id: "plan-selection",
    title: "Choose Your Plan",
    category: "Onboarding",
    description: "Select the MyRhythm plan that's right for you",
    route: "/mvp/plan-selection",
    icon: <Target className="h-4 w-4 mr-2" />
  },
  {
    id: "welcome-congrats",
    title: "Welcome Celebration",
    category: "Onboarding",
    description: "Celebrate joining the MyRhythm community",
    route: "/mvp/welcome-congrats",
    icon: <Sparkles className="h-4 w-4 mr-2" />
  },
  {
    id: "user-guide",
    title: "User Guide & Tutorial",
    category: "Onboarding",
    description: "Learn how to use MyRhythm features",
    route: "/mvp/user-guide",
    icon: <BookOpen className="h-4 w-4 mr-2" />
  },
  {
    id: "first-time-user-help",
    title: "First Time User Help",
    category: "Help", 
    description: "Help for new users getting started",
    route: "/tutorial",
    icon: <HandHeart className="h-4 w-4 mr-2" />
  },
  {
    id: "guided-tour",
    title: "Guided Tour",
    category: "Help",
    description: "Take a guided tour of MyRhythm features",
    route: "/mvp/main-flow?step=features",
    icon: <Compass className="h-4 w-4 mr-2" />
  },
  {
    id: "how-to-use",
    title: "How to Use MyRhythm",
    category: "Help",
    description: "Learn how to use MyRhythm effectively",
    route: "/useful-info?tab=howto",
    icon: <HelpCircle className="h-4 w-4 mr-2" />
  }
];

// Features and functionalities (enhanced)
export const featuresItems: SearchResult[] = [
  {
    id: "goals-view",
    title: "Goals & Tasks", 
    category: "Features",
    description: "Manage your goals and tasks",
    route: "/calendar?view=goals",
    icon: <CheckSquare className="h-4 w-4 mr-2" />
  },
  {
    id: "symptom-tracking",
    title: "Symptom Tracking",
    category: "Features",
    description: "Track your symptoms and progress",
    route: "/tracking",
    icon: <HeartPulse className="h-4 w-4 mr-2" />
  },
  {
    id: "community-posts",
    title: "Community Posts",
    category: "Features",
    description: "View and create community posts",
    route: "/community?tab=discussions",
    icon: <Users className="h-4 w-4 mr-2" />
  },
  {
    id: "gratitude-journal",
    title: "Gratitude Journal",
    category: "Features",
    description: "Record daily gratitude entries",
    route: "/gratitude",
    icon: <Sparkles className="h-4 w-4 mr-2" />
  },
  {
    id: "storyboard-view",
    title: "Calendar Storyboard",
    category: "Features",
    description: "View your calendar as a visual storyboard",
    route: "/calendar?view=storyboard",
    icon: <Calendar className="h-4 w-4 mr-2" />
  },
  {
    id: "medication-reminders",
    title: "Medication Reminders",
    category: "Features",
    description: "Set and manage medication reminders",
    route: "/calendar",
    icon: <HeartPulse className="h-4 w-4 mr-2" />
  },
  {
    id: "support-circle",
    title: "My Support Circle",
    category: "Features",
    description: "Connect with your personal support network",
    route: "/personal-community",
    icon: <Heart className="h-4 w-4 mr-2" />
  },
  {
    id: "quick-actions",
    title: "Quick Actions",
    category: "Features",
    description: "Rapid access to common tasks and shortcuts",
    route: "/ecosystem",
    icon: <Clock className="h-4 w-4 mr-2" />
  },
  {
    id: "schedule-actions",
    title: "Schedule Actions",
    category: "Features",
    description: "Add extracted actions to your calendar",
    route: "/next-steps",
    icon: <Calendar className="h-4 w-4 mr-2" />
  },
];

// Resources and information
export const resourcesItems: SearchResult[] = [
  {
    id: "user-guides",
    title: "User Guides",
    category: "Resources",
    description: "Helpful guides for using MyRhythm",
    route: "/useful-info?tab=guides",
    icon: <BookOpen className="h-4 w-4 mr-2" />
  },
  {
    id: "faq",
    title: "Frequently Asked Questions",
    category: "Resources",
    description: "Answers to common questions",
    route: "/useful-info?tab=faq",
    icon: <Info className="h-4 w-4 mr-2" />
  },
  {
    id: "tutorial-videos",
    title: "Tutorial Videos",
    category: "Resources",
    description: "Watch tutorial videos for MyRhythm features",
    route: "/useful-info?tab=videos",
    icon: <BookOpen className="h-4 w-4 mr-2" />
  },
  {
    id: "terms-policies",
    title: "Terms & Privacy",
    category: "Resources",
    description: "View terms of service and privacy policies",
    route: "/useful-info?tab=terms",
    icon: <FileText className="h-4 w-4 mr-2" />
  },
  {
    id: "local-support-services",
    title: "Local Support Services",
    category: "Resources",
    description: "Find local support services in the Dallas area",
    route: "/local-services",
    icon: <MapPin className="h-4 w-4 mr-2" />
  },
  {
    id: "emergency-resources",
    title: "Emergency Resources",
    category: "Resources",
    description: "Access emergency contact information and resources",
    route: "/dashboard",
    icon: <HeartPulse className="h-4 w-4 mr-2" />
  },
];

// Sample search data - in a real app, this would be dynamic
export const allSearchResults: SearchResult[] = [
  ...memoryBridgeItems,
  ...assessmentItems, 
  ...onboardingItems,
  ...navigationItems,
  ...featuresItems,
  ...resourcesItems,
];
