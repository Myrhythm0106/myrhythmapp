
import { Shield, Zap, Users } from "lucide-react";
import { Plan } from "./types";

export const plans: Plan[] = [
  {
    id: "basic",
    name: "Memory Partner Starter",
    description: "Your essential memory support companion",
    price: "£5.99",
    trialDays: 7,
    icon: Shield,
    features: [
      "Daily memory logging & tracking",
      "Important moments capture", 
      "Smart reminder system",
      "Memory pattern insights",
      "Progress celebrations",
      "15-minute daily reflections"
    ]
  },
  {
    id: "premium",
    name: "Memory Partner Pro", 
    description: "Complete memory empowerment toolkit",
    price: "£9.99",
    popular: true,
    trialDays: 7,
    icon: Zap,
    highlight: "Most Empowering",
    features: [
      "All Starter features included",
      "Advanced memory analytics",
      "AI-powered memory insights",
      "Voice-to-text logging",
      "Memory trigger alerts",
      "Walking & step integration",
      "Personalized memory exercises",
      "Priority memory coaching support"
    ]
  },
  {
    id: "care-team",
    name: "Memory Partner Care Team",
    description: "Professional memory support with care coordination",
    price: "£15.99",
    trialDays: 7,
    icon: Users,
    highlight: "Clinical Grade",
    features: [
      "All Memory Partner Pro features",
      "Care team dashboard & alerts",
      "Professional progress reports",
      "Medical appointment integration",
      "Family/caregiver collaboration tools",
      "Emergency memory support access",
      "HIPAA-compliant data sharing",
      "Dedicated memory care specialist"
    ]
  }
];
