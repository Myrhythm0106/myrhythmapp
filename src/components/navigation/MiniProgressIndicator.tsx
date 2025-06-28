
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MiniProgressIndicatorProps {
  currentStep: string;
  totalSteps: number;
  completedSteps: number;
  onToggleMap: () => void;
  className?: string;
}

export function MiniProgressIndicator({
  currentStep,
  totalSteps,
  completedSteps,
  onToggleMap,
  className
}: MiniProgressIndicatorProps) {
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggleMap}
      className={cn(
        "flex items-center gap-2 h-8 px-3 bg-background/95 backdrop-blur-sm",
        className
      )}
    >
      <MapPin className="h-3 w-3 text-primary" />
      <span className="text-xs font-medium">{currentStep}</span>
      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
        {completedSteps}/{totalSteps}
      </Badge>
      <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <ChevronRight className="h-3 w-3" />
    </Button>
  );
}
