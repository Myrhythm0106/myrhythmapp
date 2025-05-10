
import React from "react";
import { Badge } from "@/components/ui/badge";
import { User, Eye } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface WatchersDisplayProps {
  watchers: string[];
  maxVisible?: number;
  className?: string;
  compact?: boolean;
  showIcon?: boolean;
}

export function WatchersDisplay({ 
  watchers, 
  maxVisible = 2,
  className,
  compact = false,
  showIcon = true
}: WatchersDisplayProps) {
  if (!watchers || watchers.length === 0) return null;
  
  const visibleWatchers = watchers.slice(0, maxVisible);
  const hiddenCount = Math.max(0, watchers.length - maxVisible);
  
  return (
    <div className={cn("flex items-center gap-1 flex-wrap", className)}>
      {showIcon && <Eye className="h-3.5 w-3.5 text-muted-foreground" />}
      
      {visibleWatchers.map((watcher, index) => (
        <Badge 
          key={index} 
          variant="outline" 
          className={cn(
            "text-xs bg-background",
            compact && "py-0 h-5"
          )}
        >
          {watcher}
        </Badge>
      ))}
      
      {hiddenCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs bg-muted cursor-default",
                  compact && "py-0 h-5"
                )}
              >
                +{hiddenCount} more
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs space-y-1">
                {watchers.slice(maxVisible).map((watcher, i) => (
                  <div key={i}>{watcher}</div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
