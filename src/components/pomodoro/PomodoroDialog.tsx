
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PomodoroTimer } from "./PomodoroTimer";
import { PomodoroSettings } from "./types";

interface PomodoroDialogProps {
  title: string;
  initialSettings?: Partial<PomodoroSettings>;
  compact?: boolean;
}

export function PomodoroDialog({ title, initialSettings, compact = false }: PomodoroDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setIsFirstTime(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button 
                variant={compact ? "outline" : "secondary"} 
                size={compact ? "sm" : "default"}
                className={compact ? "h-8 px-2" : ""}
              >
                <Timer className="h-4 w-4 mr-1" />
                {compact ? "" : "Focus Timer"}
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Click to start your Focus Timer</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Focus on: {title}</DialogTitle>
        </DialogHeader>
        <PomodoroTimer 
          taskTitle={title} 
          onClose={() => setIsOpen(false)} 
          initialSettings={initialSettings}
        />
      </DialogContent>
    </Dialog>
  );
}
