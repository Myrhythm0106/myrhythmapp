
import React from "react";
import { cn } from "@/lib/utils";
import { Section } from "./rhythmAssessmentData";

interface RhythmSectionHeaderProps {
  section: Section;
}

export function RhythmSectionHeader({ section }: RhythmSectionHeaderProps) {
  const IconComponent = section.icon;

  return (
    <div className={cn("p-6 text-white bg-gradient-to-r", section.gradient)}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <IconComponent className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium opacity-90">Phase: {section.phase}</span>
            <span className="text-sm opacity-75">– {section.phaseDescription}</span>
          </div>
          <h2 className="text-2xl font-bold">{section.title}</h2>
        </div>
      </div>
    </div>
  );
}
