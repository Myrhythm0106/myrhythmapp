
import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";

interface StepHeaderProps {
  step: number;
  title: string;
  description: string;
}

export function StepHeader({ step, title, description }: StepHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <div className="text-sm font-medium">
        Step {step} of 3
      </div>
    </div>
  );
}
