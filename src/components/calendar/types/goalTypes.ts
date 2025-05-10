
export interface Goal {
  id: string;
  title: string;
  type: "daily" | "weekly" | "monthly" | "long-term";
  description?: string;
  progress: number; // 0-100
  dueDate?: string;
  createdAt: string;
  linkedActions: string[]; // Array of action IDs
}

export interface Action {
  id: string;
  title: string;
  type: "appointment" | "meeting" | "task" | "reminder";
  date: string;
  startTime: string;
  endTime?: string;
  status: "completed" | "pending" | "in-progress" | "canceled";
  goalId?: string;
}
