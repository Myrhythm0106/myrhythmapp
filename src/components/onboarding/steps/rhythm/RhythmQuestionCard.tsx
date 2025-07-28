
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MyrhythmQuestion } from "./data/myrhythmQuestions";

interface RhythmQuestionCardProps {
  question: MyrhythmQuestion;
  value: string | number | string[] | undefined;
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

  const renderQuestion = () => {
    if (question.type === 'multiple_choice') {
      return (
        <div className="space-y-3">
          {question.options?.map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onValueChange(e.target.value)}
                className="w-4 h-4 text-sunrise-amber-500 focus:ring-sunrise-amber-500"
              />
              <span className="text-foreground">{option.label}</span>
            </label>
          ))}
        </div>
      );
    }

    if (question.type === 'multiple_select') {
      return (
        <div className="space-y-3">
          {question.options?.map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <input
                type="checkbox"
                value={option.value}
                checked={Array.isArray(value) ? value.includes(option.value) : false}
                onChange={(e) => {
                  const currentValues = Array.isArray(value) ? value : (typeof value === 'string' && value ? value.split(',') : []);
                  const newValues = e.target.checked
                    ? [...currentValues, option.value]
                    : currentValues.filter((v: string) => v !== option.value);
                  onValueChange(newValues.join(','));
                }}
                className="w-4 h-4 text-sunrise-amber-500 focus:ring-sunrise-amber-500 rounded"
              />
              <span className="text-foreground">{option.label}</span>
            </label>
          ))}
        </div>
      );
    }

    if (question.type === 'scale') {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4, 5].map((scaleValue) => (
              <label key={scaleValue} className="flex flex-col items-center cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={scaleValue}
                  checked={value === scaleValue.toString()}
                  onChange={(e) => onValueChange(e.target.value)}
                  className="w-4 h-4 text-sunrise-amber-500 focus:ring-sunrise-amber-500 mb-2"
                />
                <span className="text-sm text-muted-foreground">{scaleValue}</span>
              </label>
            ))}
          </div>
          {question.labels && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{question.labels[1]}</span>
              <span>{question.labels[3]}</span>
              <span>{question.labels[5]}</span>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground">
        {question.question}
      </h3>
      
      {renderQuestion()}
    </div>
  );
}
