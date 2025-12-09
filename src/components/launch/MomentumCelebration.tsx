import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Heart, Trophy, Zap, Star } from 'lucide-react';
import { LaunchCard } from './LaunchCard';
import { useNavigate } from 'react-router-dom';

interface MomentumCelebrationProps {
  streak?: number;
  gratitudeCount?: number;
  className?: string;
}

export function MomentumCelebration({ 
  streak = 7, 
  gratitudeCount = 12,
  className 
}: MomentumCelebrationProps) {
  const navigate = useNavigate();

  const getStreakMessage = (days: number) => {
    if (days >= 30) return "Legendary! You're unstoppable! 👑";
    if (days >= 14) return "Amazing consistency! 🌟";
    if (days >= 7) return "On fire! Keep it burning! 🔥";
    if (days >= 3) return "Building momentum! 💪";
    return "Every day counts! 🌱";
  };

  const getStreakColor = (days: number) => {
    if (days >= 30) return "from-amber-500 to-orange-500";
    if (days >= 14) return "from-purple-500 to-brain-health-500";
    if (days >= 7) return "from-orange-500 to-red-500";
    return "from-memory-emerald-500 to-brain-health-500";
  };

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      {/* Streak Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <LaunchCard 
          variant="glass" 
          onClick={() => navigate('/launch/games')}
          className="relative overflow-hidden border-2 border-orange-200/50 bg-gradient-to-br from-orange-50 via-amber-50/50 to-red-50"
        >
          {/* Animated glow */}
          <motion.div
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-400 blur-2xl"
          />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getStreakColor(streak)} flex items-center justify-center shadow-lg`}
              >
                <Flame className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <motion.p 
                  className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {streak}
                </motion.p>
                <p className="text-xs font-bold text-orange-700 uppercase tracking-wide">
                  Day Streak
                </p>
              </div>
            </div>
            <p className="text-xs text-orange-600 font-medium mt-2">
              {getStreakMessage(streak)}
            </p>
          </div>
        </LaunchCard>
      </motion.div>

      {/* Gratitude Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <LaunchCard 
          variant="glass" 
          onClick={() => navigate('/launch/gratitude')}
          className="relative overflow-hidden border-2 border-rose-200/50 bg-gradient-to-br from-rose-50 via-pink-50/50 to-purple-50"
        >
          {/* Animated glow */}
          <motion.div
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 blur-2xl"
          />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg"
              >
                <Heart className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <motion.p 
                  className="text-3xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent"
                >
                  {gratitudeCount}
                </motion.p>
                <p className="text-xs font-bold text-rose-700 uppercase tracking-wide">
                  Gratitudes
                </p>
              </div>
            </div>
            <p className="text-xs text-rose-600 font-medium mt-2">
              Training your brain for joy! 💜
            </p>
          </div>
        </LaunchCard>
      </motion.div>
    </div>
  );
}
