import React from "react";
import { Badge } from "@/components/ui/badge";
import { UserType } from "@/types/user";

interface AssessmentPreviewHeaderProps {
  assessmentResult: any;
  userType: UserType;
}

export function AssessmentPreviewHeader({ assessmentResult, userType }: AssessmentPreviewHeaderProps) {
  const { overallScore, keyStrengths, areasForImprovement } = assessmentResult;

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "green";
    if (score >= 60) return "yellow";
    return "red";
  };

  const scoreColor = getScoreBadgeColor(overallScore);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Assessment Preview</h2>
        <Badge variant="secondary">
          Overall Score: {overallScore}%
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold">Key Strengths</h3>
          <ul>
            {keyStrengths.map((strength: string, index: number) => (
              <li key={index} className="text-sm">{strength}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Areas for Improvement</h3>
          <ul>
            {areasForImprovement.map((area: string, index: number) => (
              <li key={index} className="text-sm">{area}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

