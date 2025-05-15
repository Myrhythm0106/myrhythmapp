
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { usePomodoroContext } from "./PomodoroContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PomodoroButtonProps extends ButtonProps {
  title?: string;
}

export function PomodoroButton({ 
  title = "Focus Timer",
  variant = "default", 
  size = "default",
  className 
}: PomodoroButtonProps) {
  const { state, startTimer } = usePomodoroContext();
  
  // Using properties from state object
  const buttonText = state.isRunning 
    ? `Pause ${state.mode}` 
    : title;

  const handleClick = () => {
    // If timer isn't active, start it with the title as the task name
    if (!state.isActive) {
      startTimer(title || "Focus Session");
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={variant} 
            size={size} 
            className={className}
            onClick={handleClick}
          >
            <Timer className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to start your Focus Timer</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
