
import { Crown, Users, Shield } from "lucide-react";
import { Plan } from "./types";

export const plans: Plan[] = [
  {
    id: "basic",
    name: "MyRhythm Align",
    description: "Foundation for aligning memory, focus, and daily rhythm",
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
    name: "MyRhythm Flow",
    description: "Complete flow experience with advanced momentum building",
    price: "$9.99/month",
    trialDays: 7,
    popular: true,
    icon: Crown,
    highlight: "Most Popular",
    features: [
      "Everything in MyRhythm Align",
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
    name: "MyRhythm Thrive",
    description: "Complete family wellness journey to help everyone thrive",
    price: "$19.99/month",
    trialDays: 7,
    icon: Users,
    features: [
      "Everything in MyRhythm Flow",
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
