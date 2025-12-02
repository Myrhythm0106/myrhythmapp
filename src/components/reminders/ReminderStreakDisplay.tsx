import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ReminderStreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  compact?: boolean;
}

export function ReminderStreakDisplay({
  currentStreak,
  longestStreak,
  totalCompletions,
  compact = false
}: ReminderStreakDisplayProps) {
  // Get streak tier and styling
  const getStreakTier = () => {
    if (currentStreak >= 30) return { tier: 'legendary', color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Trophy };
    if (currentStreak >= 14) return { tier: 'champion', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: Trophy };
    if (currentStreak >= 7) return { tier: 'rising', color: 'text-orange-500', bg: 'bg-orange-500/10', icon: Flame };
    if (currentStreak >= 3) return { tier: 'building', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: TrendingUp };
    return { tier: 'starting', color: 'text-muted-foreground', bg: 'bg-muted', icon: Star };
  };

  const { tier, color, bg, icon: Icon } = getStreakTier();

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full", bg)}>
        <Icon className={cn("h-4 w-4", color)} />
        <span className={cn("font-bold", color)}>{currentStreak}</span>
        <span className="text-xs text-muted-foreground">day streak</span>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Current streak - main focus */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                scale: currentStreak > 0 ? [1, 1.1, 1] : 1 
              }}
              transition={{ 
                repeat: currentStreak >= 7 ? Infinity : 0, 
                duration: 2 
              }}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                bg
              )}
            >
              <Icon className={cn("h-6 w-6", color)} />
            </motion.div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className={cn("text-3xl font-bold", color)}>
                  {currentStreak}
                </span>
                <span className="text-sm text-muted-foreground">days</span>
              </div>
              <p className="text-xs text-muted-foreground capitalize">
                {tier === 'starting' ? 'Start your streak!' : `${tier} streak`}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-foreground">
                {longestStreak}
              </div>
              <div className="text-xs text-muted-foreground">Best</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {totalCompletions}
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </div>

        {/* Progress to next milestone */}
        {currentStreak > 0 && currentStreak < 30 && (
          <div className="mt-3">
            {(() => {
              const nextMilestone = currentStreak < 3 ? 3 : currentStreak < 7 ? 7 : currentStreak < 14 ? 14 : 30;
              const progress = (currentStreak / nextMilestone) * 100;
              return (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{nextMilestone - currentStreak} days to {nextMilestone}-day milestone</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={cn("h-full rounded-full", 
                        currentStreak >= 7 ? "bg-orange-500" : "bg-primary"
                      )}
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
