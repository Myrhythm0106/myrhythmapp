
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
  
  const handleValueChange = (newValue: string) => {
    onValueChange(newValue);
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      // This will trigger the parent component's auto-advance logic
    }, 500);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">
        {question.text}
      </h3>
      
      <RadioGroup
        value={value?.toString() || ""}
        onValueChange={handleValueChange}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {scaleLabels.map((label, index) => {
          const optionValue = (index + 1).toString();
          const isSelected = value === (index + 1);
          return (
            <div key={optionValue} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={optionValue}
                id={`${question.id}-${optionValue}`}
                className="sr-only"
              />
              <Label
                htmlFor={`${question.id}-${optionValue}`}
                className={cn(
                  "flex-1 p-4 text-center border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-beacon-400 hover:bg-beacon-50",
                  isSelected 
                    ? "border-beacon-500 bg-beacon-100 text-beacon-800 shadow-md ring-2 ring-beacon-200 transform scale-105" 
                    : "border-gray-200 bg-white hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "font-semibold text-lg mb-1",
                  isSelected ? "text-beacon-700" : "text-gray-700"
                )}>
                  {index + 1}
                </div>
                <div className={cn(
                  "text-xs leading-tight",
                  isSelected ? "text-beacon-600" : "text-gray-600"
                )}>
                  {label}
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
