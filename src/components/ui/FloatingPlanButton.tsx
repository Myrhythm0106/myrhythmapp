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
    <div className={cn("fixed top-4 right-4 z-50", className)}>
      <Button 
        onClick={onClick}
        className="bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 px-6 py-3"
      >
        <Zap className="mr-2 h-4 w-4" />
        Plan Next Step
      </Button>
    </div>
  );
}