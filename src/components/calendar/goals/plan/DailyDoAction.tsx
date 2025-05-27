
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyDoActionProps {
  action: {
    id: string;
    title: string;
    measurement: string;
    timing: string;
    dueDate: string;
    completed: boolean;
  };
  onComplete: () => void;
  onEdit: () => void;
}

export function DailyDoAction({ action, onComplete, onEdit }: DailyDoActionProps) {
  return (
    <div 
      className={cn(
        "p-4 border rounded-lg transition-all",
        action.completed 
          ? "bg-green-50 border-green-200" 
          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onComplete}
          className={cn(
            "mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
            action.completed
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-primary"
          )}
        >
          {action.completed && <CheckCircle2 className="h-3 w-3" />}
        </button>
        
        <div className="flex-1">
          <div className={cn(
            "space-y-1",
            action.completed && "opacity-75"
          )}>
            <p className={cn(
              "font-medium",
              action.completed && "line-through"
            )}>
              What I'll do: {action.title}
            </p>
            <p className="text-sm text-gray-600">
              How I'll know: {action.measurement}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {action.timing}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {action.dueDate}
              </Badge>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="opacity-50 hover:opacity-100"
        >
          <Edit3 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
