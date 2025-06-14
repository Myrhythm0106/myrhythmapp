
import { Shield, Zap, Users } from "lucide-react";
import { Plan } from "./types";

export const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Essential features",
    price: "$7.99",
    trialDays: 7,
    icon: Shield,
    features: [
      "Basic symptom tracking",
      "Limited calendar features", 
      "Community forum access",
      "Basic insights"
    ]
  },
  {
    id: "premium",
    name: "Premium", 
    description: "Complete feature set",
    price: "$9.99",
    popular: true,
    icon: Zap,
    highlight: "Most Popular",
    features: [
      "Advanced symptom tracking",
      "Full calendar management",
      "Complete resource library",
      "Personalized insights",
      "Priority support"
    ]
  },
  {
    id: "family",
    name: "Family",
    description: "For families & caregivers",
    price: "$19.99",
    icon: Users,
    features: [
      "All Premium features",
      "Multiple user accounts",
      "Caregiver resources", 
      "24/7 emergency support",
      "Dedicated case manager"
    ]
  }
];
