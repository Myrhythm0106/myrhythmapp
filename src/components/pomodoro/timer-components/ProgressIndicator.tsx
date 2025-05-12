
import React from "react";
import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  progress: number;
}

export function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  return (
    <Progress value={progress} className="h-2 w-full" />
  );
}
