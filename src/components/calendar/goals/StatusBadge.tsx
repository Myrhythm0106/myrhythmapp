
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
      {status === "done" && "Accomplished!"}
      {status === "pending" && "Pending"}
      {status === "doing" && "In My Flow"}
      {status === "canceled" && "Redirected Energy"}
      {status === "not_started" && "Ready to Begin"}
      {status === "on_hold" && "Paused Mindfully"}
    </Badge>
  );
};
