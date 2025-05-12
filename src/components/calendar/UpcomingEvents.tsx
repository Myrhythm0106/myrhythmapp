
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActionItem, Action } from "./ActionItem";
import { actions } from "./data/actionsData";
import { getActionTypeStyles, getGoalTypeStyles, getActionStatusStyles } from "./utils/actionStyles";

interface UpcomingEventsProps {
  date?: Date;
}

export function UpcomingEvents({ date }: UpcomingEventsProps) {
  // In a real app, we would filter actions based on the selected date
  // For this demo, we'll just show all actions
  
  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {actions.map((action) => (
          <ActionItem
            key={action.id}
            action={action}
            getActionStatusStyles={getActionStatusStyles}
            getActionTypeStyles={getActionTypeStyles}
            getGoalTypeStyles={getGoalTypeStyles}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
