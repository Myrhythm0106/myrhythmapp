import React from "react";
import { Goal, Action } from "../types/goalTypes";
import { GoalItem } from "./GoalItem";
import { UnlinkedActions } from "./UnlinkedActions";

interface ListViewProps {
  goals: Goal[];
  actions: Action[];
  detailedActions?: boolean;
}

export function ListView({ goals, actions, detailedActions = false }: ListViewProps) {
  const goalsWithActions = goals.map(goal => ({
    ...goal,
    actions: actions.filter(action => action.goalId === goal.id)
  }));

  const unlinkedActions = actions.filter(action => !action.goalId);

  return (
    <div className="space-y-6">
      {goalsWithActions.map(goal => (
        <GoalItem 
          key={goal.id} 
          goal={goal} 
          actions={goal.actions}
          detailedActions={detailedActions}
        />
      ))}
      
      {unlinkedActions.length > 0 && (
        <UnlinkedActions 
          actions={unlinkedActions} 
          detailedActions={detailedActions}
        />
      )}
    </div>
  );
}
