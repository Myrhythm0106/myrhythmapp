import { Crown } from "lucide-react";
import { Plan } from "./types";

// Single tier pricing - MyRhythm Premium
export const plans: Plan[] = [
  {
    id: "premium",
    name: "MyRhythm Premium",
    description: "Everything you need for your cognitive empowerment journey",
    price: "£10",
    regularPrice: "£15",
    annualPrice: "£100",
    regularAnnualPrice: "£150",
    monthlySavings: "Save £20/year",
    foundingSavings: "Save £5/month forever",
    trialDays: 7,
    popular: true,
    icon: Crown,
    highlight: "Founding Member Price",
    features: [
      "✨ 7-day free trial",
      "Unlimited Memory Bridge recordings",
      "Brain Health Reminders with escalation",
      "Daily Brain Boost (240+ challenges)",
      "Support Circle (5 members included)",
      "LEAP Assessment & Analytics",
      "Calendar Integration",
      "Progress Tracking & Reports",
      "Promise Score tracking",
      "Streak celebrations & motivation",
      "Priority customer support"
    ]
  }
];

// Simple feature list for marketing
export const coreFeatures = [
  {
    title: "Memory Bridge",
    description: "Record conversations and automatically extract action items",
    icon: "🎙️"
  },
  {
    title: "Brain Health Reminders",
    description: "Progressive escalation system with contextual anchors",
    icon: "🧠"
  },
  {
    title: "Daily Brain Boost",
    description: "240+ cognitive, emotional, and social challenges",
    icon: "💪"
  },
  {
    title: "Support Circle",
    description: "Connect up to 5 trusted people as your safety net",
    icon: "💚"
  },
  {
    title: "LEAP Assessment",
    description: "Discover your unique cognitive rhythm",
    icon: "📊"
  },
  {
    title: "Promise Score",
    description: "Track your commitment and build trust",
    icon: "⭐"
  }
];

// Value proposition
export const valueProposition = {
  headline: "Less than a coffee a week",
  subheadline: "£10/month = £2.50/week",
  comparison: "That's less than one coffee for a complete brain health system",
  urgency: "Founding Member pricing ends after 500 users or 6 months"
};
