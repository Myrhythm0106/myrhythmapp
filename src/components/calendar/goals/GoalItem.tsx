
import React from "react";
import { Goal, Action } from "../types/goalTypes";
import { ActionItemDetailed } from "../ActionItemDetailed";
import { StatusBadge } from "./StatusBadge";
import { Target, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GoalItemProps {
  goal: Goal;
  actions: Action[];
  detailedActions?: boolean;
}

export function GoalItem({ goal, actions, detailedActions = false }: GoalItemProps) {
  const getGoalTypeColor = (type: string) => {
    switch (type) {
      case "daily":
        return "border-l-blue-500 bg-blue-50";
      case "weekly":
        return "border-l-green-500 bg-green-50";
      case "monthly":
        return "border-l-purple-500 bg-purple-50";
      case "long-term":
        return "border-l-orange-500 bg-orange-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  const completedActions = actions.filter(action => action.status === "completed").length;
  const totalActions = actions.length;
  const completionPercentage = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;

  return (
    <Card className={`border-l-4 ${getGoalTypeColor(goal.type)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <CardTitle className="text-lg">{goal.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={completedActions === totalActions && totalActions > 0 ? "completed" : "in-progress"} />
            <span className="text-sm text-muted-foreground">
              {completedActions}/{totalActions}
            </span>
          </div>
        </div>
        {goal.description && (
          <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        {actions.length > 0 ? (
          <div className="space-y-2">
            {actions.map((action) => (
              <ActionItemDetailed
                key={action.id}
                action={{
                  ...action,
                  time: action.startTime || "No time set"
                }}
                showDetails={detailedActions}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No actions assigned to this goal yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
