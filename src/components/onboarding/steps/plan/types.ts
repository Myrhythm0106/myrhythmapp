
import { LucideIcon } from "lucide-react";

export type PlanType = "basic" | "premium" | "family" | "preview" | "starter" | "stretch" | "leap";

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
  selectedPlan?: PlanType;
}
