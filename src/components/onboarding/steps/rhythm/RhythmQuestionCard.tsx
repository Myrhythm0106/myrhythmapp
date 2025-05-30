
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Question, scaleLabels } from "./rhythmAssessmentData";

interface RhythmQuestionCardProps {
  question: Question;
  value: number | undefined;
  onValueChange: (value: string) => void;
}

export function RhythmQuestionCard({ question, value, onValueChange }: RhythmQuestionCardProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">
        {question.text}
      </h3>
      
      <RadioGroup
        value={value?.toString() || ""}
        onValueChange={onValueChange}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {scaleLabels.map((label, index) => {
          const isSelected = value === (index + 1);
          return (
            <div key={index + 1} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={(index + 1).toString()} 
                id={`${question.id}-${index + 1}`}
                className="hidden"
              />
              <Label
                htmlFor={`${question.id}-${index + 1}`}
                className={cn(
                  "flex-1 p-3 text-center border-2 rounded-lg cursor-pointer transition-all hover:border-beacon-300",
                  isSelected 
                    ? "border-beacon-500 bg-beacon-50 text-beacon-700" 
                    : "border-gray-200"
                )}
              >
                <div className="font-medium text-sm">{index + 1}</div>
                <div className="text-xs text-gray-600 mt-1">{label}</div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
