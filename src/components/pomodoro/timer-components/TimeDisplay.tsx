
import React from "react";

interface TimeDisplayProps {
  formattedTime: string;
}

export function TimeDisplay({ formattedTime }: TimeDisplayProps) {
  return (
    <div className="text-4xl font-bold text-center">
      {formattedTime}
    </div>
  );
}
