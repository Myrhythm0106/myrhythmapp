
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GoalBoardHeader } from "./GoalBoardHeader";
import { GoalCategorySection } from "./GoalCategorySection";
import { GoalBoardEmptyState } from "./GoalBoardEmptyState";

interface Goal {
  id: string;
  title: string;
  type: "daily" | "weekly" | "monthly" | "long-term";
  description?: string;
  progress: number;
  icon: string;
  dueDate?: string;
  createdAt: string;
  status: "to-do" | "doing" | "done";
  smallSteps: any[];
}

// Sample organized goals data
const sampleOrganizedGoals: Goal[] = [
  {
    id: "goal1",
    title: "Walk to the mailbox by myself",
    type: "daily",
    description: "Build independence in mobility",
    progress: 65,
    icon: "walking",
    dueDate: "2024-02-15",
    createdAt: "2024-01-15",
    status: "doing",
    smallSteps: []
  },
  {
    id: "goal2",
    title: "Read a whole book",
    type: "weekly",
    description: "Improve cognitive function through reading",
    progress: 45,
    icon: "book",
    dueDate: "2024-03-01",
    createdAt: "2024-01-20",
    status: "doing",
    smallSteps: []
  },
  {
    id: "goal3",
    title: "Cook a simple meal",
    type: "weekly",
    description: "Regain independence in kitchen tasks",
    progress: 25,
    icon: "cooking",
    dueDate: "2024-02-28",
    createdAt: "2024-01-25",
    status: "to-do",
    smallSteps: []
  },
  {
    id: "goal4",
    title: "Daily morning walk",
    type: "daily",
    description: "Completed daily exercise routine",
    progress: 100,
    icon: "walking",
    dueDate: "2024-01-31",
    createdAt: "2024-01-01",
    status: "done",
    smallSteps: []
  }
];

export function OrganizedGoalBoard() {
  const navigate = useNavigate();
  const [goals] = useState<Goal[]>(sampleOrganizedGoals);

  const handleGoalClick = (goalId: string) => {
    navigate(`/calendar/goal/${goalId}`);
  };

  const handleAddGoal = () => {
    navigate("/calendar?planMyDreams=true");
    toast.info("Starting Plan My Dreams flow!");
  };

  const categorizeGoals = () => {
    return {
      "to-do": goals.filter(goal => goal.status === "to-do"),
      "doing": goals.filter(goal => goal.status === "doing"),
      "done": goals.filter(goal => goal.status === "done")
    };
  };

  const categorizedGoals = categorizeGoals();

  return (
    <div className="space-y-6">
      <GoalBoardHeader onAddGoal={handleAddGoal} />

      {/* Goal Categories */}
      <div className="space-y-8">
        {Object.entries(categorizedGoals).map(([category, categoryGoals]) => (
          <GoalCategorySection 
            key={category}
            category={category}
            goals={categoryGoals}
            onGoalClick={handleGoalClick}
          />
        ))}
      </div>

      {/* Empty state for no goals */}
      {goals.length === 0 && (
        <GoalBoardEmptyState onAddGoal={handleAddGoal} />
      )}
    </div>
  );
}
