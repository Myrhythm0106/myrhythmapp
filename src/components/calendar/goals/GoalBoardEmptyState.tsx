
import React from "react";
import { Button } from "@/components/ui/button";
import { Target, Plus } from "lucide-react";

interface GoalBoardEmptyStateProps {
  onAddGoal: () => void;
}

export function GoalBoardEmptyState({ onAddGoal }: GoalBoardEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-600 mb-2">Ready to Plan Your Next Steps?</h3>
      <p className="text-gray-500 mb-4">Let's break down what you're working toward into manageable pieces!</p>
      <Button onClick={onAddGoal} className="bg-gradient-to-r from-purple-500 to-blue-500">
        <Plus className="h-4 w-4 mr-2" />
        Plan My Next Steps
      </Button>
    </div>
  );
}
