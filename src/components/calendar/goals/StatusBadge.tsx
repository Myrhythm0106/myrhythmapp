
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Action } from "../types/goalTypes";
import { getStatusBadge } from "../utils/goalUtils";

interface StatusBadgeProps {
  status: Action["status"];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const badgeClasses = getStatusBadge(status);
  
  return (
    <Badge variant="outline" className={badgeClasses}>
      {status === "completed" && "Completed"}
      {status === "pending" && "Pending"}
      {status === "in-progress" && "In Progress"}
      {status === "canceled" && "Canceled"}
    </Badge>
  );
};
