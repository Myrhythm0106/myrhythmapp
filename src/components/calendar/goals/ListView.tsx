
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Goal, Action } from "../types/goalTypes";
import { GoalItem } from "./GoalItem";
import { UnlinkedActions } from "./UnlinkedActions";
import { getActionsWithoutGoals } from "../utils/goalUtils";

interface ListViewProps {
  goals: Goal[];
  actions: Action[];
  renderPomodoroForGoal?: (goalTitle: string) => React.ReactNode;
}

export const ListView: React.FC<ListViewProps> = ({ 
  goals, 
  actions,
  renderPomodoroForGoal 
}) => {
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({});
  
  const toggleGoalExpanded = (goalId: string) => {
    setExpandedGoals(prev => ({
      ...prev,
      [goalId]: !prev[goalId]
    }));
  };

  const unlinkedActions = getActionsWithoutGoals(actions);

  return (
    <div className="space-y-4">
      {/* Goals with their linked actions */}
      {goals.map(goal => (
        <GoalItem 
          key={goal.id}
          goal={goal}
          isExpanded={!!expandedGoals[goal.id]}
          onToggle={() => toggleGoalExpanded(goal.id)}
          actions={actions}
        />
      ))}
      
      {/* Unlinked Actions */}
      <UnlinkedActions 
        actions={unlinkedActions}
        isExpanded={!!expandedGoals['unlinked']}
        onToggle={() => toggleGoalExpanded('unlinked')}
      />
      
      <div className="flex justify-end mt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-1 h-4 w-4" />
              Add New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            {/* Add a goal form component here */}
            <div className="p-4">
              <p className="text-muted-foreground">Goal form would go here.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
