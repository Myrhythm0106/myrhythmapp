
import React from "react";
import { Badge } from "@/components/ui/badge";
import { OrganizedGoalCard } from "./OrganizedGoalCard";

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

interface GoalCategorySectionProps {
  category: string;
  goals: Goal[];
  onGoalClick: (goalId: string) => void;
}

export function GoalCategorySection({ category, goals, onGoalClick }: GoalCategorySectionProps) {
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "to-do": return "📋 To Do";
      case "doing": return "🚀 In Progress";
      case "done": return "✅ Completed";
      default: return category;
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case "to-do": return "Goals ready to start";
      case "doing": return "Goals currently being worked on";
      case "done": return "Successfully completed goals";
      default: return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-2">
        <h3 className="text-xl font-semibold text-gray-800">
          {getCategoryTitle(category)}
        </h3>
        <p className="text-sm text-gray-600">{getCategoryDescription(category)}</p>
        <Badge variant="outline" className="mt-1">
          {goals.length} goal{goals.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <OrganizedGoalCard 
              key={goal.id} 
              goal={goal} 
              onClick={onGoalClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <p>No goals in this category yet</p>
        </div>
      )}
    </div>
  );
}
