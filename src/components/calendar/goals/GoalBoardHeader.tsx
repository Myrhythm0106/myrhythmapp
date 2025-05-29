
import React from "react";
import { Button } from "@/components/ui/button";
import { Target, Plus } from "lucide-react";

interface GoalBoardHeaderProps {
  onAddGoal: () => void;
}

export function GoalBoardHeader({ onAddGoal }: GoalBoardHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          My Goal Board
        </h2>
        <p className="text-gray-600 mt-1">Your dreams organized and in progress</p>
      </div>
      
      <Button onClick={onAddGoal} className="bg-gradient-to-r from-purple-500 to-blue-500">
        <Plus className="h-4 w-4 mr-2" />
        Plan New Dream
      </Button>
    </div>
  );
}
