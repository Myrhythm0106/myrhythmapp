import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Goal, Action } from "../types/goalTypes";
import { ActionTable } from "./ActionTable";
import { ActionItemDetailed } from "../ActionItemDetailed";
import { getActionStatusStyles, getActionTypeStyles, getGoalTypeStyles } from "../utils/actionStyles";

interface GoalItemProps {
  goal: Goal;
  actions: Action[];
  detailedActions?: boolean;
}

export function GoalItem({ goal, actions, detailedActions = false }: GoalItemProps) {
  
  const completedActions = actions.filter(action => action.status === "completed").length;
  const progress = actions.length > 0 ? (completedActions / actions.length) * 100 : 0;

  const getStatusColor = (status: Goal["status"]) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "not-started": return "bg-gray-100 text-gray-800";
      case "on-hold": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: Goal["type"]) => {
    switch (type) {
      case "mobility": return "bg-purple-100 text-purple-800";
      case "cognitive": return "bg-blue-100 text-blue-800";
      case "health": return "bg-green-100 text-green-800";
      case "other": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-lg font-semibold">{goal.title}</h3>
          <div className="flex gap-2">
            <Badge className={getTypeColor(goal.type)}>{goal.type}</Badge>
            <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
          </div>
        </div>
        {goal.description && (
          <p className="text-sm text-muted-foreground mt-2">{goal.description}</p>
        )}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{completedActions}/{actions.length} actions completed</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {detailedActions ? (
          <div className="space-y-3">
            {actions.map(action => (
              <ActionItemDetailed
                key={action.id}
                action={action}
                getActionStatusStyles={getActionStatusStyles}
                getActionTypeStyles={getActionTypeStyles}
                getGoalTypeStyles={getGoalTypeStyles}
              />
            ))}
          </div>
        ) : (
          <ActionTable actions={actions} goalId={goal.id} />
        )}
      </CardContent>
    </Card>
  );
}
