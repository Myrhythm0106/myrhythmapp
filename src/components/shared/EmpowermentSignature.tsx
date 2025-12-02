import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmpowermentSignatureProps {
  variant?: 'default' | 'minimal' | 'prominent';
  className?: string;
  context?: 'completion' | 'milestone' | 'struggle' | 'general';
}

// Growth mindset messages categorized by context
const growthMessages = {
  completion: [
    "Another promise kept! You're building trust with yourself. 🌟",
    "Every small win rewires your brain for success. Keep going! 💪",
    "This momentum you're building? It's changing your neural pathways. ⚡",
    "You showed up. That's the hardest part. Celebrate this! 🎉",
    "Consistency beats perfection. You're doing amazing. 🌱"
  ],
  milestone: [
    "Look at how far you've come! Your brain is thanking you. 🧠✨",
    "This streak is proof of your incredible resilience. 🔥",
    "You're not just completing tasks—you're rewiring your brain for success! 🚀",
    "Every milestone is a new neural pathway strengthened. Keep building! 🏗️",
    "Your future self is grateful for the work you're doing today. 💜"
  ],
  struggle: [
    "Tough days don't define you—how you respond does. You've got this. 💪",
    "Progress isn't always visible, but every effort counts. 🌱",
    "Your brain is more adaptable than you know. One step at a time. 🧠",
    "It's okay to rest. Recovery is part of growth. 💙",
    "Even the smallest step forward is still forward. Keep going. 🌟"
  ],
  general: [
    "Your brain has amazing potential. You're unlocking it daily. 🧠✨",
    "Every choice you make shapes who you become. Choose growth. 🌱",
    "Small consistent actions create extraordinary results. 💫",
    "You're stronger than yesterday. Keep building momentum. 💪",
    "The best time to start was yesterday. The second best time is now. 🚀",
    "Your commitment to yourself matters. Keep showing up. 🌟",
    "Progress over perfection. You're on the right path. ✨",
    "Each day is a new opportunity to build the life you want. 🌅",
    "Your brain is constantly adapting. Feed it positivity. 🧠💜",
    "Believe in your ability to change. Neuroplasticity is real. 🔥"
  ]
};

export function EmpowermentSignature({ 
  variant = 'default', 
  className = '',
  context = 'general'
}: EmpowermentSignatureProps) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = growthMessages[context] || growthMessages.general;

  useEffect(() => {
    // Select a random message on mount
    const randomIndex = Math.floor(Math.random() * messages.length);
    setMessageIndex(randomIndex);
    setCurrentMessage(messages[randomIndex]);
  }, [context]);

  const refreshMessage = () => {
    const newIndex = (messageIndex + 1) % messages.length;
    setMessageIndex(newIndex);
    setCurrentMessage(messages[newIndex]);
  };

  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={cn("text-center py-2", className)}
      >
        <p className="text-xs text-muted-foreground/80 italic">
          {currentMessage}
        </p>
      </motion.div>
    );
  }

  if (variant === 'prominent') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={cn(
          "bg-gradient-to-r from-memory-emerald-50 via-brain-health-50 to-clarity-teal-50",
          "border border-brain-health-200/30 rounded-lg p-4",
          className
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-memory-emerald-500 to-brain-health-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-sm font-medium text-brain-health-700"
              >
                {currentMessage}
              </motion.p>
            </AnimatePresence>
          </div>
          <button
            onClick={refreshMessage}
            className="p-1.5 rounded-full hover:bg-brain-health-100 transition-colors"
            aria-label="Get new message"
          >
            <RefreshCw className="h-4 w-4 text-brain-health-500" />
          </button>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "bg-gradient-to-r from-memory-emerald-500/10 via-brain-health-500/10 to-clarity-teal-500/10",
        "backdrop-blur-sm border-t border-brain-health-200/30",
        "py-2 px-4",
        className
      )}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
        <Heart className="h-3 w-3 text-brain-health-500 flex-shrink-0" />
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs text-brain-health-600 text-center italic"
          >
            {currentMessage}
          </motion.p>
        </AnimatePresence>
        <button
          onClick={refreshMessage}
          className="p-1 rounded-full hover:bg-brain-health-100/50 transition-colors flex-shrink-0"
          aria-label="Get new message"
        >
          <RefreshCw className="h-3 w-3 text-brain-health-400" />
        </button>
      </div>
    </motion.div>
  );
}

// Context-specific empowerment messages for use throughout the app
export const contextualMessages = {
  actionComplete: () => growthMessages.completion[Math.floor(Math.random() * growthMessages.completion.length)],
  streakMilestone: () => growthMessages.milestone[Math.floor(Math.random() * growthMessages.milestone.length)],
  strugglingDay: () => growthMessages.struggle[Math.floor(Math.random() * growthMessages.struggle.length)],
  general: () => growthMessages.general[Math.floor(Math.random() * growthMessages.general.length)],
};
