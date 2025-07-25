import React from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingPlanButtonProps {
  onClick: () => void;
  className?: string;
}

export function FloatingPlanButton({ onClick, className }: FloatingPlanButtonProps) {
  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <Button 
        onClick={onClick}
      >
        <Zap className="mr-2 h-4 w-4" />
        Actions
      </Button>
    </div>
  );
}