import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceCommandHintsProps {
  isVisible?: boolean;
  onDismiss?: () => void;
}

const COMMANDS = [
  { command: '"Done"', description: 'Complete the current step' },
  { command: '"Skip"', description: 'Move to the next step' },
  { command: '"Schedule"', description: 'Plan when to do it' },
  { command: '"Read it"', description: 'Hear the step read aloud' },
];

export function VoiceCommandHints({ isVisible: controlledVisible, onDismiss }: VoiceCommandHintsProps) {
  const [dismissed, setDismissed] = useState(false);
  const [showHints, setShowHints] = useState(false);

  // Check localStorage for first-time hint dismissal
  useEffect(() => {
    const hintsShown = localStorage.getItem('voiceCommandHintsShown');
    if (!hintsShown) {
      setShowHints(true);
      localStorage.setItem('voiceCommandHintsShown', 'true');
    }
  }, []);

  const isVisible = controlledVisible !== undefined ? controlledVisible : (showHints && !dismissed);

  const handleDismiss = () => {
    setDismissed(true);
    setShowHints(false);
    onDismiss?.();
  };

  const handleShowHints = () => {
    setShowHints(true);
    setDismissed(false);
  };

  return (
    <>
      {/* Collapsed hint button */}
      {!isVisible && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShowHints}
          className="text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="w-4 h-4 mr-1" />
          Voice commands
        </Button>
      )}

      {/* Expanded hints panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Mic className="w-4 h-4 text-primary" />
                  Voice Commands
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {COMMANDS.map(({ command, description }) => (
                  <div key={command} className="text-xs">
                    <span className="font-medium text-primary">{command}</span>
                    <span className="text-muted-foreground ml-1">— {description}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
