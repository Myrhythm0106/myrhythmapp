
import { Action } from "../types/goalTypes";

export const getStatusBadge = (status: Action["status"]) => {
  switch(status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-300";
    case "pending":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "in-progress":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "canceled":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "";
  }
};

export const getGoalTypeIcon = (type: "daily" | "weekly" | "monthly" | "long-term") => {
  switch(type) {
    case "daily":
      return "Flag";
    case "weekly":
      return "Flag";
    case "monthly":
      return "Target";
    case "long-term":
      return "ListCheck";
    default:
      return "Target";
  }
};

export const getGoalActions = (goalId: string, actions: Action[]) => {
  return actions.filter(action => action.goalId === goalId);
};

export const getActionsWithoutGoals = (actions: Action[]) => {
  return actions.filter(action => !action.goalId);
};
