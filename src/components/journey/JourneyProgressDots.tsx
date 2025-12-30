import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface JourneyProgressDotsProps {
  currentStep: number;
  totalSteps: number;
  variant?: 'compact' | 'expanded';
}

export function JourneyProgressDots({ 
  currentStep, 
  totalSteps,
  variant = 'compact' 
}: JourneyProgressDotsProps) {
  if (variant === 'compact') {
    // Compact: Show current/total as text
    return (
      <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
        <span className="text-brain-health-600">{currentStep}</span>
        <span>/</span>
        <span>{totalSteps}</span>
      </div>
    );
  }

  // Expanded: Show dots
  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <motion.div
            key={stepNumber}
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {isCompleted ? (
              // Completed step - checkmark
              <motion.div
                className="h-8 w-8 rounded-full bg-gradient-to-br from-brain-health-500 to-clarity-teal-500 flex items-center justify-center shadow-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Check className="h-4 w-4 text-white" strokeWidth={3} />
              </motion.div>
            ) : isCurrent ? (
              // Current step - highlighted dot with pulse
              <motion.div
                className="h-8 w-8 rounded-full bg-gradient-to-br from-brain-health-500 to-clarity-teal-500 shadow-lg"
                animate={{ 
                  boxShadow: [
                    "0 0 0 0 hsl(var(--brain-health-400) / 0.4)",
                    "0 0 0 8px hsl(var(--brain-health-400) / 0)",
                    "0 0 0 0 hsl(var(--brain-health-400) / 0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            ) : (
              // Future step - muted dot
              <div className="h-8 w-8 rounded-full bg-brain-health-200/60 border-2 border-brain-health-300/40" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
