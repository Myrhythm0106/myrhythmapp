
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Timer, Brain } from "lucide-react";
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
                className={compact ? "h-8 px-2 border-purple-200 text-purple-700 hover:bg-purple-50" : "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 hover:from-purple-200 hover:to-blue-200"}
              >
                <Timer className="h-4 w-4 mr-1" />
                {compact ? "" : "Memory1st Focus Timer"}
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <p>Start your gentle, Memory1st focus session</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 border-2 border-purple-200/50">
        <DialogHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Memory1st Focus: {title}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">Gentle focus for your brain's natural rhythm</p>
            </div>
          </div>
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
