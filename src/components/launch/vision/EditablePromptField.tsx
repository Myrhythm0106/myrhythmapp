import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Suggestion {
  text: string;
  emoji?: string;
}

interface EditablePromptFieldProps {
  question: string;
  questionIcon?: React.ReactNode;
  helpText?: string;
  suggestions: Suggestion[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  optional?: boolean;
  className?: string;
}

export function EditablePromptField({
  question,
  questionIcon,
  helpText,
  suggestions,
  value,
  onChange,
  placeholder = "Type your own or tap a suggestion above...",
  maxLength = 200,
  rows = 3,
  optional = false,
  className
}: EditablePromptFieldProps) {
  const handleSuggestionClick = (suggestion: Suggestion) => {
    // Set the text, user can then edit it
    onChange(suggestion.text);
  };

  const selectedSuggestion = suggestions.find(s => s.text === value);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Question Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {questionIcon}
          <h3 className="text-lg font-semibold text-foreground">
            {question}
          </h3>
          {optional && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Optional
            </span>
          )}
        </div>
        {helpText && (
          <p className="text-sm text-muted-foreground">
            {helpText}
          </p>
        )}
      </div>

      {/* Suggestion Badges */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => {
          const isSelected = value === suggestion.text;
          return (
            <motion.button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium",
                "border-2 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-brain-health-400/50",
                isSelected
                  ? "bg-brain-health-100 border-brain-health-400 text-brain-health-700"
                  : "bg-card border-border hover:border-brain-health-300 hover:bg-brain-health-50/50 text-foreground"
              )}
            >
              {suggestion.emoji && (
                <span className="text-base">{suggestion.emoji}</span>
              )}
              <span className="text-left">{suggestion.text}</span>
              {isSelected && (
                <Check className="h-4 w-4 text-brain-health-600 ml-1" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Editable Text Field */}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className={cn(
            "w-full resize-none text-base leading-relaxed",
            "bg-card border-2 border-border rounded-xl",
            "focus:border-brain-health-400 focus:ring-2 focus:ring-brain-health-400/20",
            "placeholder:text-muted-foreground/60",
            "transition-all duration-200"
          )}
        />
        
        {/* Character Count */}
        {maxLength && (
          <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
            {value.length}/{maxLength}
          </div>
        )}
      </div>

      {/* Edit Hint */}
      {selectedSuggestion && value === selectedSuggestion.text && (
        <p className="text-xs text-brain-health-600 flex items-center gap-1">
          <span>✏️</span>
          <span>Feel free to edit and personalize this!</span>
        </p>
      )}
    </div>
  );
}
