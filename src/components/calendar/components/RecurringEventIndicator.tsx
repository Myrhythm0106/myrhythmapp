
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Repeat, RotateCcw } from "lucide-react";
import { getRecurringEventSummary, isRecurringEvent, isRecurringInstance } from "../utils/recurringEventUtils";

interface RecurringEventIndicatorProps {
  event: any;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function RecurringEventIndicator({ 
  event, 
  size = "sm", 
  showText = false 
}: RecurringEventIndicatorProps) {
  if (!isRecurringEvent(event) && !isRecurringInstance(event)) {
    return null;
  }

  const isInstance = isRecurringInstance(event);
  const icon = isInstance ? RotateCcw : Repeat;
  const IconComponent = icon;
  
  const iconSize = size === "lg" ? "h-5 w-5" : size === "md" ? "h-4 w-4" : "h-3 w-3";
  const badgeSize = size === "lg" ? "text-sm" : "text-xs";

  const summary = isRecurringEvent(event) ? getRecurringEventSummary(event) : "Part of recurring series";

  if (showText) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="secondary" 
              className={`${badgeSize} bg-primary/10 text-primary hover:bg-primary/20 cursor-help`}
            >
              <IconComponent className={`${iconSize} mr-1`} />
              {isInstance ? "Recurring" : "Series"}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">{summary}</p>
            {isInstance && (
              <p className="text-xs text-muted-foreground mt-1">
                Click to edit this occurrence or entire series
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center">
            <IconComponent 
              className={`${iconSize} text-primary cursor-help`}
              aria-label={isInstance ? "Recurring event instance" : "Recurring event series"}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{summary}</p>
          {isInstance && (
            <p className="text-xs text-muted-foreground mt-1">
              Part of a recurring series
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
