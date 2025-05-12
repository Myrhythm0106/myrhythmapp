
import React from "react";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { usePomodoroContext } from "./PomodoroContext";

interface PomodoroButtonProps {
  title?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function PomodoroButton({ 
  title = "Focus Session", 
  variant = "default", 
  size = "default" 
}: PomodoroButtonProps) {
  const { startTimer } = usePomodoroContext();
  
  const handleStartPomodoro = () => {
    startTimer(title);
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={variant} 
            size={size} 
            onClick={handleStartPomodoro}
            className="flex items-center gap-1"
          >
            <Timer className="h-4 w-4" />
            <span>Pomodoro</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Start a Pomodoro focus session</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
