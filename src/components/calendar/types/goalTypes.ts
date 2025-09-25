
export interface Goal {
  id: string;
  title: string;
  type: "daily" | "weekly" | "monthly" | "long-term";
  description?: string;
  progress: number; // 0-100
  dueDate?: string;
  createdAt: string;
  smallSteps: SmallStep[];
}

export interface SmallStep {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  actions: TinyAction[];
  progress: number; // 0-100
}

export interface TinyAction {
  id: string;
  goalId: string;
  smallStepId: string;
  title: string;
  type: "appointment" | "therapy" | "medication" | "activity" | "personal" | "other";
  date: string;
  startTime: string;
  endTime?: string;
  status: "done" | "pending" | "doing" | "canceled" | "not_started" | "on_hold";
  location?: string;
  watchers?: string[];
  duration?: number; // in minutes
  isToday?: boolean;
}

export interface Action {
  id: string;
  title: string;
  type: "appointment" | "therapy" | "medication" | "activity" | "personal" | "other";
  date: string;
  startTime: string;
  endTime?: string;
  status: "done" | "pending" | "doing" | "canceled" | "not_started" | "on_hold";
  goalId?: string;
  location?: string;
  watchers?: string[];
  linkedGoal?: {
    id: string;
    title: string;
    type: "mobility" | "cognitive" | "health" | "other";
  };
}
