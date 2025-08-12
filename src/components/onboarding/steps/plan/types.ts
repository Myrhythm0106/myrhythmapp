
import { LucideIcon } from "lucide-react";

export type PlanType = "basic" | "premium" | "family" | "preview";

export interface Plan {
  id: PlanType;
  name: string;
  description: string;
  price: string;
  annualPrice?: string;
  monthlySavings?: string;
  trialDays?: number;
  popular?: boolean;
  icon: LucideIcon;
  highlight?: string;
  features: string[];
}

export interface PlanStepProps {
  onComplete: (plan: PlanType, billingPeriod?: 'monthly' | 'annual') => void;
  selectedPlan?: PlanType;
}
