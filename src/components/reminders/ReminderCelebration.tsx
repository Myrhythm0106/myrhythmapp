import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Flame, Sparkles, Share2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getCelebrationMessage } from '@/data/reminderMotivations';
import { celebrateBigWin, celebrateSuccess } from '@/utils/celebration';

interface ReminderCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentStreak: number;
  totalCompletions: number;
  isNewRecord?: boolean;
  onShare?: () => void;
}

export function ReminderCelebration({
  isOpen,
  onClose,
  title,
  currentStreak,
  totalCompletions,
  isNewRecord = false,
  onShare
}: ReminderCelebrationProps) {
  const [celebrationMessage, setCelebrationMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCelebrationMessage(getCelebrationMessage());
      
      // Trigger confetti based on streak
      if (isNewRecord || currentStreak >= 7) {
        celebrateBigWin();
      } else {
        celebrateSuccess({ particleCount: Math.min(currentStreak * 20, 150) });
      }
    }
  }, [isOpen, currentStreak, isNewRecord]);

  // Get streak milestone message
  const getStreakMessage = () => {
    if (currentStreak >= 30) return "🏆 LEGENDARY! 30+ day streak!";
    if (currentStreak >= 14) return "⭐ Two weeks strong! Incredible!";
    if (currentStreak >= 7) return "🔥 One week streak! You're on fire!";
    if (currentStreak >= 3) return "💪 3 days! Building momentum!";
    if (currentStreak >= 1) return "✨ Great start! Keep going!";
    return "🌱 First step taken!";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-gradient-to-b from-primary/10 to-background border-primary/20">
        <div className="relative p-6 text-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Animated trophy/star */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30"
          >
            {isNewRecord ? (
              <Trophy className="h-12 w-12 text-white" />
            ) : currentStreak >= 7 ? (
              <Flame className="h-12 w-12 text-white" />
            ) : (
              <Star className="h-12 w-12 text-white" />
            )}
          </motion.div>

          {/* Main celebration message */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-foreground mb-2"
          >
            {celebrationMessage}
          </motion.h2>

          {/* Task completed */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-4"
          >
            You completed: <strong>{title}</strong>
          </motion.p>

          {/* Streak display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-xl p-4 mb-4 border border-primary/20"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <span className="text-3xl font-bold">{currentStreak}</span>
              <span className="text-lg text-muted-foreground">day streak</span>
            </div>
            <p className="text-sm font-medium text-primary">
              {getStreakMessage()}
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-6 mb-6"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{totalCompletions}</div>
              <div className="text-xs text-muted-foreground">Total Tasks</div>
            </div>
            {isNewRecord && (
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">🏆 NEW</div>
                <div className="text-xs text-muted-foreground">Personal Best!</div>
              </div>
            )}
          </motion.div>

          {/* Brain benefit reminder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-primary/5 rounded-lg p-3 mb-4"
          >
            <p className="text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 inline mr-1 text-primary" />
              Every task you complete strengthens your brain's reliability circuits
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-2"
          >
            <Button 
              onClick={onClose}
              className="flex-1"
              size="lg"
            >
              Continue
            </Button>
            {onShare && (
              <Button 
                variant="outline"
                size="lg"
                onClick={onShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
