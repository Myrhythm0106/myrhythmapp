
import { LucideIcon } from "lucide-react";

export type PlanType = "basic" | "premium" | "family";

export interface Plan {
  id: PlanType;
  name: string;
  description: string;
  price: string;
  trialDays?: number;
  features: string[];
  popular?: boolean;
  icon: LucideIcon;
  highlight?: string;
}

export interface PlanStepProps {
  onComplete: (plan: PlanType) => void;
  selectedPlan?: PlanType;
}
