
import { Shield, Zap } from "lucide-react";
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
  }
];
