
import React from "react";
import { Action } from "../types/goalTypes";
import { ActionItemDetailed } from "../ActionItemDetailed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Unlink } from "lucide-react";

interface UnlinkedActionsProps {
  actions: Action[];
  detailedActions?: boolean;
}

export function UnlinkedActions({ actions, detailedActions = false }: UnlinkedActionsProps) {
  if (actions.length === 0) return null;

  return (
    <Card className="border-l-4 border-l-gray-400 bg-gray-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Unlink className="h-4 w-4 text-gray-600" />
          Unlinked Actions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Actions not assigned to any specific goal
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          {actions.map((action) => (
            <ActionItemDetailed
              key={action.id}
              action={{
                ...action,
                time: action.scheduledTime || "No time set"
              }}
              showDetails={detailedActions}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
