import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceCommandButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onToggle: () => void;
  lastTranscript?: string | null;
  size?: 'default' | 'large';
  className?: string;
}

export function VoiceCommandButton({
  isListening,
  isSupported,
  onToggle,
  lastTranscript,
  size = 'large',
  className
}: VoiceCommandButtonProps) {
  if (!isSupported) {
    return null;
  }

  const sizeClasses = size === 'large' 
    ? 'h-16 w-16 rounded-full' 
    : 'h-12 w-12 rounded-full';

  const iconSize = size === 'large' ? 'w-7 h-7' : 'w-5 h-5';

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <motion.div
        animate={isListening ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Button
          onClick={onToggle}
          className={cn(
            sizeClasses,
            "transition-all duration-300 shadow-lg",
            isListening 
              ? "bg-red-500 hover:bg-red-600 ring-4 ring-red-200 dark:ring-red-900" 
              : "bg-primary hover:bg-primary/90"
          )}
          aria-label={isListening ? "Stop listening" : "Start voice command"}
        >
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="listening"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Mic className={cn(iconSize, "text-white animate-pulse")} />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Mic className={cn(iconSize, "text-white")} />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Status text */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <p className="text-sm font-medium text-primary flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              I'm listening...
            </p>
            {lastTranscript && (
              <p className="text-xs text-muted-foreground mt-1">
                Heard: "{lastTranscript}"
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint when not listening */}
      {!isListening && (
        <p className="text-xs text-muted-foreground text-center">
          Tap to use voice
        </p>
      )}
    </div>
  );
}
