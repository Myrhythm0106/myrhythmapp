
import { Crown, Users, Shield } from "lucide-react";
import { Plan } from "./types";

export const plans: Plan[] = [
  {
    id: "basic",
    name: "Starter Plan",
    description: "Perfect for individuals beginning their LEAP journey",
    price: "$7.99/month",
    trialDays: 7,
    icon: Shield,
    features: [
      "Your LEAP Assessment & Results",
      "Personal Rhythm Discovery",
      "Basic Calendar & Goals",
      "Memory Enhancement Tools",
      "Brain Games & Exercises",
      "Daily Progress Tracking",
      "Community Access"
    ]
  },
  {
    id: "premium",
    name: "Pro Plan",
    description: "Complete MyRhythm experience with advanced features",
    price: "$9.99/month",
    trialDays: 7,
    popular: true,
    icon: Crown,
    highlight: "Most Popular",
    features: [
      "Everything in Starter Plan",
      "Advanced LEAP Analytics",
      "Personalized Momentum Insights",
      "Priority Customer Support",
      "Advanced Calendar Management",
      "Goal Achievement Coaching",
      "Premium Brain Training",
      "Detailed Progress Reports",
      "Export & Share Features"
    ]
  },
  {
    id: "family",
    name: "Family Plan",
    description: "Support your whole family's cognitive wellness journey",
    price: "$19.99/month",
    trialDays: 7,
    icon: Users,
    features: [
      "Everything in Pro Plan",
      "Up to 4 Family Members",
      "Shared Family Calendar",
      "Caregiver Dashboard Access",
      "Family Progress Tracking",
      "Collaborative Goal Setting",
      "Family Support Resources",
      "Dedicated Family Coach",
      "Emergency Contact System"
    ]
  }
];
