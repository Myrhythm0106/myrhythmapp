import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, Trophy, Sparkles } from 'lucide-react';
import { LaunchCard } from './LaunchCard';
import { cn } from '@/lib/utils';

interface WinningWeekTrackerProps {
  completedDays?: number[];
  className?: string;
}

export function WinningWeekTracker({ 
  completedDays = [0, 1, 2], // Indices of completed days (0 = Monday)
  className 
}: WinningWeekTrackerProps) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const completedCount = completedDays.length;

  const getWeekMessage = () => {
    if (completedCount === 7) return "PERFECT WEEK! You're a legend! 👑";
    if (completedCount >= 5) return "Incredible week! Your brain is thriving! 🧠✨";
    if (completedCount >= 3) return "Strong momentum! Keep it going! 💪";
    if (completedCount > 0) return "Building your winning streak! 🌱";
    return "A fresh week of possibilities awaits! 🚀";
  };

  const currentDayIndex = (new Date().getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={className}
    >
      <LaunchCard className="relative overflow-hidden border-2 border-clarity-teal-200/50 bg-gradient-to-br from-white via-clarity-teal-50/30 to-brain-health-50/30">
        {/* Decorative elements */}
        <motion.div
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-clarity-teal-400 to-brain-health-400 blur-3xl"
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-clarity-teal-500 to-brain-health-500 shadow-lg">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-clarity-teal-800 text-lg">Your Winning Week</h3>
                <p className="text-xs text-clarity-teal-600">{getWeekMessage()}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-clarity-teal-500/10 to-brain-health-500/10 border border-clarity-teal-300/30">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-bold text-clarity-teal-700">
                {completedCount}/7
              </span>
            </div>
          </div>

          {/* Week Progress */}
          <div className="flex items-center justify-between gap-2 mt-4">
            {days.map((day, i) => {
              const isCompleted = completedDays.includes(i);
              const isToday = i === currentDayIndex;
              const isFuture = i > currentDayIndex;

              return (
                <motion.div
                  key={`${day}-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 + (i * 0.05) }}
                  className="flex-1 text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={cn(
                      "w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-all duration-300",
                      isCompleted && "bg-gradient-to-br from-memory-emerald-500 to-clarity-teal-500 text-white shadow-lg shadow-memory-emerald-500/30",
                      isToday && !isCompleted && "bg-gradient-to-br from-brain-health-200 to-clarity-teal-200 text-brain-health-700 ring-2 ring-brain-health-400 ring-offset-2",
                      !isCompleted && !isToday && !isFuture && "bg-rose-100 text-rose-400",
                      isFuture && "bg-gray-100 text-gray-400"
                    )}
                  >
                    {isCompleted ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        ✓
                      </motion.span>
                    ) : isToday ? (
                      <Sparkles className="h-4 w-4" />
                    ) : (
                      day
                    )}
                  </motion.div>
                  <span className={cn(
                    "text-xs font-medium",
                    isCompleted ? "text-memory-emerald-600" : isToday ? "text-brain-health-600" : "text-gray-400"
                  )}>
                    {day}
                  </span>
                  {isToday && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] text-brain-health-500 font-medium mt-0.5"
                    >
                      Today
                    </motion.p>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Week Celebration Message */}
          {completedCount >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-100/50 via-memory-emerald-100/50 to-clarity-teal-100/50 border border-amber-200/30 text-center"
            >
              <p className="text-sm font-medium text-amber-700">
                🏆 You're building a championship week!
              </p>
            </motion.div>
          )}
        </div>
      </LaunchCard>
    </motion.div>
  );
}
