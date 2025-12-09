import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Circle, Sparkles, ChevronRight } from 'lucide-react';
import { LaunchCard } from './LaunchCard';
import { cn } from '@/lib/utils';

interface PowerMove {
  title: string;
  done: boolean;
}

interface PowerMovesSectionProps {
  moves?: PowerMove[];
  onViewAll?: () => void;
  className?: string;
}

export function PowerMovesSection({ 
  moves = [
    { title: 'Morning routine', done: true },
    { title: 'Review calendar', done: true },
    { title: 'Call Dr. Smith', done: false },
  ],
  onViewAll,
  className 
}: PowerMovesSectionProps) {
  const completedCount = moves.filter(m => m.done).length;
  const totalCount = moves.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const getCelebrationMessage = () => {
    if (completionPercentage === 100) return "You crushed it! All power moves complete! 🎉";
    if (completionPercentage >= 75) return "Almost there! You're on fire! 🔥";
    if (completionPercentage >= 50) return "Halfway champion! Keep pushing! 💪";
    if (completionPercentage > 0) return "Great start! Momentum is building! 🚀";
    return "Ready to conquer today? Let's go! ⚡";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={className}
    >
      <LaunchCard className="relative overflow-hidden border-2 border-brain-health-200/50 bg-gradient-to-br from-white via-brain-health-50/30 to-memory-emerald-50/30">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-brain-health-500 to-memory-emerald-500 shadow-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-brain-health-800 text-lg">Today's Power Moves</h3>
              <p className="text-xs text-brain-health-600">{getCelebrationMessage()}</p>
            </div>
          </div>
          
          {/* Progress Badge */}
          <motion.div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-memory-emerald-500/10 to-brain-health-500/10 border border-memory-emerald-300/30"
            animate={{ scale: completionPercentage === 100 ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 1, repeat: completionPercentage === 100 ? Infinity : 0 }}
          >
            <Sparkles className="h-4 w-4 text-memory-emerald-600" />
            <span className="text-sm font-bold text-memory-emerald-700">
              {completedCount}/{totalCount} crushed!
            </span>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-2 bg-brain-health-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-memory-emerald-500 via-brain-health-500 to-clarity-teal-500 rounded-full"
            />
          </div>
        </div>
        
        {/* Power Moves List */}
        <div className="space-y-3">
          {moves.map((move, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                move.done 
                  ? "bg-gradient-to-r from-memory-emerald-100/80 to-brain-health-100/50 border border-memory-emerald-200/50" 
                  : "bg-white/80 border border-brain-health-200/30 hover:border-brain-health-300/50 hover:shadow-sm"
              )}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {move.done ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <CheckCircle2 className="h-6 w-6 text-memory-emerald-500" />
                  </motion.div>
                ) : (
                  <Circle className="h-6 w-6 text-brain-health-300" />
                )}
              </motion.div>
              <span className={cn(
                "text-sm font-medium flex-1",
                move.done ? "text-memory-emerald-700 line-through" : "text-brain-health-800"
              )}>
                {move.title}
              </span>
              {move.done && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs text-memory-emerald-600 font-medium"
                >
                  ✨ Done!
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        {onViewAll && (
          <motion.button 
            onClick={onViewAll}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 py-3 text-sm font-bold text-brain-health-600 hover:text-brain-health-700 flex items-center justify-center gap-2 rounded-xl hover:bg-brain-health-100/50 transition-colors"
          >
            View all power moves
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        )}
      </LaunchCard>
    </motion.div>
  );
}
