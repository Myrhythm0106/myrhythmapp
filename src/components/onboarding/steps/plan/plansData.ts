
import { Shield, Zap } from "lucide-react";
import { Plan } from "./types";

export const plans: Plan[] = [
  {
    id: "basic",
    name: "Essential Support",
    description: "Perfect for getting started",
    price: "$7.99",
    trialDays: 7,
    icon: Shield,
    features: [
      "Track how you feel daily",
      "Simple calendar features", 
      "Connect with community",
      "Basic progress insights"
    ]
  },
  {
    id: "premium",
    name: "Complete Care", 
    description: "Everything you need to thrive",
    price: "$9.99",
    popular: true,
    icon: Zap,
    highlight: "Most Popular",
    features: [
      "Complete wellness tracking",
      "Organize your life easily",
      "Full resource library",
      "Personalized insights & guidance",
      "Priority support & coaching"
    ]
  }
];
