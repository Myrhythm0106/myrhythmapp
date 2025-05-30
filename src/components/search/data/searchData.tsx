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
  BookOpen
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

// Features and functionalities (removed brain games references)
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
  ...navigationItems,
  ...featuresItems,
  ...resourcesItems,
];
