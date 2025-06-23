
import { Shield, Zap, Users } from "lucide-react";
import { Plan } from "./types";

export const plans: Plan[] = [
  {
    id: "basic",
    name: "MyRhythm Starter",
    description: "Perfect for beginning your growth journey",
    price: "$7.99",
    trialDays: 7,
    icon: Shield,
    features: [
      "Daily wellness check-ins",
      "Personal rhythm calendar", 
      "Connect with empowering community",
      "Progress insights & celebrations"
    ]
  },
  {
    id: "premium",
    name: "MyRhythm Pro", 
    description: "Everything you need to thrive & flourish",
    price: "$9.99",
    popular: true,
    icon: Zap,
    highlight: "Most Empowering",
    features: [
      "Complete wellness monitoring",
      "Life organization mastery",
      "Full growth resource library",
      "Personalized insights & guidance",
      "Priority coaching & support"
    ]
  },
  {
    id: "care-team",
    name: "MyRhythm Care Team",
    description: "Comprehensive support for you and your care providers",
    price: "$15.99",
    icon: Users,
    highlight: "Clinical Grade",
    features: [
      "All MyRhythm Pro features included",
      "Secure provider data sharing",
      "Clinical progress reporting",
      "Care team collaboration tools",
      "Healthcare provider dashboard",
      "Medical appointment integration",
      "Insurance documentation support",
      "24/7 clinical support access"
    ]
  }
];
