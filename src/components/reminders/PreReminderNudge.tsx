import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPreReminderPrefix } from '@/data/reminderMotivations';

interface PreReminderNudgeProps {
  title: string;
  timeUntil: string;
  motivation?: string | null;
  location?: string | null;
  onDismiss: () => void;
  isVisible: boolean;
}

export function PreReminderNudge({
  title,
  timeUntil,
  motivation,
  location,
  onDismiss,
  isVisible
}: PreReminderNudgeProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium">
                  {getPreReminderPrefix()}
                </p>
                <h4 className="font-semibold text-foreground truncate mt-0.5">
                  {title}
                </h4>
                
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {timeUntil}
                  </span>
                  {location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {location}
                    </span>
                  )}
                </div>
                
                {motivation && (
                  <p className="text-xs text-primary/80 mt-2 italic">
                    💡 "{motivation}"
                  </p>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 h-8 w-8 rounded-full"
                onClick={onDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
