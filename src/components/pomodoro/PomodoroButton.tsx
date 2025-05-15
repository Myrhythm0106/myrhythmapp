import React, { useContext } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { PomodoroContext } from "./PomodoroContext";

interface PomodoroButtonProps extends ButtonProps {
  title?: string;
}

export function PomodoroButton({ 
  title = "Focus Timer",
  variant = "default", 
  size = "default",
  className 
}: PomodoroButtonProps) {
  const { isRunning, currentPhase, openPomodoro } = useContext(PomodoroContext);
  
  const buttonText = isRunning ? `Pause ${currentPhase}` : title;

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={openPomodoro}
    >
      <Timer className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );
}
