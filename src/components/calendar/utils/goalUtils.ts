
import { Action } from "../types/goalTypes";

export const getStatusBadge = (status: Action["status"]) => {
  switch(status) {
    case "done":
      return "bg-green-100 text-green-800 border-green-300";
    case "pending":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "doing":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "not_started":
      return "bg-gray-100 text-gray-800 border-gray-300";
    case "on_hold":
      return "bg-orange-100 text-orange-800 border-orange-300";
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
