
import { FamilyTimeActivity } from "../components/ActivityCard";

export const familyActivities: FamilyTimeActivity[] = [
  {
    id: "daily-checkin",
    title: "Daily Family Check-in",
    description: "Share one good thing from today and ask how everyone is feeling",
    duration: 10,
    difficulty: "easy",
    category: "conversation",
    benefits: ["emotional connection", "routine building"]
  },
  {
    id: "cooking-together",
    title: "Cook a Simple Meal Together", 
    description: "Prepare something easy like sandwiches or pasta side by side",
    duration: 30,
    difficulty: "medium",
    category: "activity",
    benefits: ["collaboration", "life skills", "quality time"]
  },
  {
    id: "gratitude-sharing",
    title: "Gratitude Circle",
    description: "Each person shares 2 things they're grateful for today",
    duration: 15,
    difficulty: "easy", 
    category: "conversation",
    benefits: ["positive focus", "emotional bonding"]
  },
  {
    id: "memory-lane",
    title: "Share a Favorite Memory",
    description: "Take turns sharing a happy memory involving the family",
    duration: 20,
    difficulty: "easy",
    category: "conversation", 
    benefits: ["memory strengthening", "emotional connection"]
  }
];
