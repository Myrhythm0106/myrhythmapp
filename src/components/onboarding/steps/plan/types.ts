import { LucideIcon } from "lucide-react";

// Simplified to single tier
export type PlanType = "free" | "premium";

export interface Plan {
  id: PlanType;
  name: string;
  description: string;
  price: string;
  regularPrice?: string;
  annualPrice?: string;
  regularAnnualPrice?: string;
  monthlySavings?: string;
  foundingSavings?: string;
  trialDays?: number;
  popular?: boolean;
  icon: LucideIcon;
  highlight?: string;
  features: string[];
}

export interface PlanStepProps {
  onComplete: (plan: PlanType, billingPeriod?: 'monthly' | 'annual') => void;
  selectedPlan?: PlanType | null;
}

export interface PricingDisplayProps {
  isFoundingMember: boolean;
  isAnnual: boolean;
  showSavings?: boolean;
}
