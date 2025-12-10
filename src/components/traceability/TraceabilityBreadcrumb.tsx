import React from 'react';
import { ChevronRight, Sparkles, Target, Star, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTraceability, VisionItem, GoalItem, PriorityItem, TaskItem } from '@/contexts/TraceabilityContext';

interface TraceabilityBreadcrumbProps {
  taskId: string;
  compact?: boolean;
  className?: string;
}

const TraceabilityBreadcrumb: React.FC<TraceabilityBreadcrumbProps> = ({
  taskId,
  compact = false,
  className
}) => {
  const { getTraceabilityPath } = useTraceability();
  const path = getTraceabilityPath(taskId);

  if (!path) return null;

  const hasPath = path.vision || path.goal || path.priority;
  if (!hasPath) return null;

  return (
    <div className={cn(
      "flex items-center gap-1 text-muted-foreground flex-wrap",
      compact ? "text-xs" : "text-sm",
      className
    )}>
      {path.vision && (
        <>
          <span className="flex items-center gap-1">
            <Sparkles className={cn("text-amber-500", compact ? "w-3 h-3" : "w-4 h-4")} />
            <span className="truncate max-w-[100px]">
              {path.vision.yearly_theme || `Vision ${path.vision.year}`}
            </span>
          </span>
          <ChevronRight className={cn(compact ? "w-3 h-3" : "w-4 h-4")} />
        </>
      )}
      
      {path.goal && (
        <>
          <span className="flex items-center gap-1">
            <Target className={cn("text-primary", compact ? "w-3 h-3" : "w-4 h-4")} />
            <span className="truncate max-w-[100px]">{path.goal.title}</span>
          </span>
          {path.priority && <ChevronRight className={cn(compact ? "w-3 h-3" : "w-4 h-4")} />}
        </>
      )}
      
      {path.priority && (
        <span className="flex items-center gap-1">
          <Star className={cn("text-orange-500", compact ? "w-3 h-3" : "w-4 h-4")} />
          <span className="truncate max-w-[100px]">{path.priority.title}</span>
        </span>
      )}
    </div>
  );
};

export default TraceabilityBreadcrumb;
