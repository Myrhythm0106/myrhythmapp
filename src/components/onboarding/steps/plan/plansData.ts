
import { Crown, Users, Shield } from "lucide-react";
import { Plan } from "./types";

export const plans: Plan[] = [
  {
    id: "starter",
    name: "MyStarter",
    description: "Perfect start to build your rhythm with support circle",
    price: "£7.00/month",
    annualPrice: "£70.00/year",
    monthlySavings: "Save £14.00",
    trialDays: 7,
    icon: Shield,
    features: [
      "✨ 3 Free Support Circle Members",
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
    id: "stretch",
    name: "MyStretch",
    description: "Enhanced experience with advanced momentum building",
    price: "£7.00/month",
    annualPrice: "£70.00/year",
    monthlySavings: "Save £14.00",
    trialDays: 7,
    popular: true,
    icon: Crown,
    highlight: "Most Popular",
    features: [
      "✨ 3 Free Support Circle Members",
      "Everything in MyStarter",
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
    id: "leap",
    name: "MyLeap",
    description: "Complete family wellness journey with unlimited support",
    price: "£7.00/month",
    annualPrice: "£70.00/year",
    monthlySavings: "Save £14.00",
    trialDays: 7,
    icon: Users,
    features: [
      "✨ 3 Free Support Circle Members",
      "Everything in MyStretch",
      "Up to 6 Family Members",
      "Shared Family Calendar",
      "Caregiver Dashboard Access",
      "Family Progress Tracking",
      "Collaborative Goal Setting",
      "Family Support Resources",
      "Dedicated Family Coach",
      "Emergency Contact System",
      "Unlimited Support Circle Growth"
    ]
  }
];
