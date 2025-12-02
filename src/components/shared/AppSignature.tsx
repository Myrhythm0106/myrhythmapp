import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface AppSignatureProps {
  variant?: 'default' | 'light' | 'dark';
  className?: string;
  context?: 'completion' | 'milestone' | 'struggle' | 'general';
}

const growthMessages = {
  completion: [
    "Another promise kept! You're building trust with yourself. 🌟",
    "Every small win rewires your brain for success. 💪",
    "This momentum? It's changing your neural pathways. ⚡"
  ],
  milestone: [
    "Look at how far you've come! Your brain is thanking you. 🧠✨",
    "This streak proves your incredible resilience. 🔥",
    "You're rewiring your brain for success! 🚀"
  ],
  struggle: [
    "Tough days don't define you—how you respond does. 💪",
    "Progress isn't always visible, but every effort counts. 🌱",
    "One step at a time. You've got this. 💙"
  ],
  general: [
    "Every promise you keep builds trust. You're building something amazing. 💪",
    "Your brain has amazing potential. You're unlocking it daily. 🧠✨",
    "Small consistent actions create extraordinary results. 💫",
    "You're stronger than yesterday. Keep building momentum. 💪",
    "Progress over perfection. You're on the right path. ✨"
  ]
};

export function AppSignature({ variant = 'default', className = '', context = 'general' }: AppSignatureProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = growthMessages[context] || growthMessages.general;
  
  useEffect(() => {
    setMessageIndex(Math.floor(Math.random() * messages.length));
  }, [context]);

  const refreshMessage = () => {
    setMessageIndex((prev) => (prev + 1) % messages.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={`text-center py-6 ${className}`}
    >
      <div className="flex items-center justify-center gap-2">
        <p className={`text-sm italic ${
          variant === 'light' 
            ? 'text-white/70' 
            : variant === 'dark' 
              ? 'text-foreground/70' 
              : 'text-muted-foreground'
        }`}>
          {messages[messageIndex]}
        </p>
        <button
          onClick={refreshMessage}
          className={`p-1 rounded-full transition-colors ${
            variant === 'light' 
              ? 'hover:bg-white/10' 
              : 'hover:bg-muted'
          }`}
          aria-label="Get new message"
        >
          <RefreshCw className={`h-3 w-3 ${
            variant === 'light' ? 'text-white/50' : 'text-muted-foreground/50'
          }`} />
        </button>
      </div>
    </motion.div>
  );
}
