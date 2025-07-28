
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

interface PrimarySecondaryValue {
  primary: string;
  secondary: string[];
}

export function RhythmQuestionCard({ question, value, onValueChange }: RhythmQuestionCardProps) {
  
  const handleValueChange = (newValue: string) => {
    onValueChange(newValue);
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      // This will trigger the parent component's auto-advance logic
    }, 500);
  };

  const parsePrimarySecondaryValue = (val: any): PrimarySecondaryValue => {
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        return { primary: parsed.primary || '', secondary: parsed.secondary || [] };
      } catch {
        return { primary: val, secondary: [] };
      }
    }
    return { primary: '', secondary: [] };
  };

  const handlePrimarySecondaryChange = (primary: string, secondary: string[]) => {
    const newValue = JSON.stringify({ primary, secondary });
    onValueChange(newValue);
  };

  const renderQuestion = () => {
    if (question.type === 'primary_secondary') {
      const currentValue = parsePrimarySecondaryValue(value);
      
      return (
        <div className="space-y-6">
          {/* Primary Answer Section */}
          <div className="space-y-3">
            <h4 className="text-base font-medium text-foreground">What's your main answer?</h4>
            <div className="space-y-2">
              {question.options?.map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg border-2 hover:bg-muted/50 transition-all duration-200 hover:border-sunrise-amber-200">
                  <input
                    type="radio"
                    name={`${question.id}_primary`}
                    value={option.value}
                    checked={currentValue.primary === option.value}
                    onChange={(e) => handlePrimarySecondaryChange(e.target.value, currentValue.secondary)}
                    className="w-5 h-5 text-sunrise-amber-500 focus:ring-sunrise-amber-500 focus:ring-2"
                  />
                  <span className="text-foreground font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Secondary Answer Section - Only show if primary is selected */}
          {currentValue.primary && question.secondaryPrompt && (
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-muted-foreground">{question.secondaryPrompt}</h4>
              <div className="space-y-2">
                {question.options?.filter(option => option.value !== currentValue.primary).map((option) => (
                  <label key={option.value} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={currentValue.secondary.includes(option.value)}
                      onChange={(e) => {
                        const newSecondary = e.target.checked
                          ? [...currentValue.secondary, option.value]
                          : currentValue.secondary.filter(v => v !== option.value);
                        handlePrimarySecondaryChange(currentValue.primary, newSecondary);
                      }}
                      className="w-4 h-4 text-sunrise-amber-400 focus:ring-sunrise-amber-400 rounded"
                    />
                    <span className="text-muted-foreground text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

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
