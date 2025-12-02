import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles, ArrowRight, Brain, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { celebrateBigWin, celebrateSuccess } from '@/utils/celebration';
import { useNavigate } from 'react-router-dom';

interface RecordingCelebrationProps {
  show: boolean;
  actionsCount: number;
  onViewActions: () => void;
  onRecordAnother: () => void;
  onDismiss: () => void;
}

export function RecordingCelebration({
  show,
  actionsCount,
  onViewActions,
  onRecordAnother,
  onDismiss,
}: RecordingCelebrationProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (show && actionsCount > 0) {
      // Trigger confetti celebration
      if (actionsCount >= 3) {
        celebrateBigWin();
      } else {
        celebrateSuccess({ particleCount: 80, spread: 60 });
      }
    }
  }, [show, actionsCount]);

  const getMessage = () => {
    if (actionsCount === 0) {
      return {
        title: "Recording Saved!",
        subtitle: "Your conversation has been captured safely.",
        emoji: "✅",
      };
    }
    if (actionsCount === 1) {
      return {
        title: "1 Action Found!",
        subtitle: "I found a commitment you made. Let's make sure you follow through!",
        emoji: "🎯",
      };
    }
    if (actionsCount <= 3) {
      return {
        title: `${actionsCount} Actions Discovered!`,
        subtitle: "Great conversation! I've captured what you committed to.",
        emoji: "⭐",
      };
    }
    return {
      title: `${actionsCount} Actions Found!`,
      subtitle: "Wow! That was a productive meeting! Your actions are ready to schedule.",
      emoji: "🚀",
    };
  };

  const message = getMessage();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-gradient-to-br from-primary/10 via-background to-green-500/10 border-2 border-primary/20 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 10 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="h-8 w-8 text-yellow-400" />
                </motion.div>
              </div>
            </motion.div>

            {/* Message */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-4xl mb-2 block">{message.emoji}</span>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {message.title}
                </h2>
                <p className="text-muted-foreground">
                  {message.subtitle}
                </p>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              {actionsCount > 0 && (
                <Button
                  onClick={() => {
                    onDismiss();
                    navigate('/next-steps');
                  }}
                  className="w-full gap-2 bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90"
                  size="lg"
                >
                  <Target className="h-5 w-5" />
                  View My Actions
                  <ArrowRight className="h-5 w-5" />
                </Button>
              )}
              
              <Button
                onClick={onRecordAnother}
                variant="outline"
                className="w-full gap-2"
                size="lg"
              >
                <Brain className="h-5 w-5" />
                Record Another
              </Button>
              
              <Button
                onClick={onDismiss}
                variant="ghost"
                className="w-full text-muted-foreground"
              >
                Close
              </Button>
            </motion.div>

            {/* Encouragement */}
            {actionsCount > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-xs text-muted-foreground mt-4"
              >
                💡 Tip: Schedule your actions within 24 hours for best follow-through!
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
