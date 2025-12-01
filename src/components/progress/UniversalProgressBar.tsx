import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { useDailyWelcome } from '@/hooks/useDailyWelcome';
import { getPersonaLanguage, getPersonaFromUserType } from '@/utils/personaLanguage';
import { useProfile } from '@/hooks/useProfile';
import { Sparkles, Flame, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UniversalProgressBarProps {
  className?: string;
  showMessage?: boolean;
  compact?: boolean;
}

export function UniversalProgressBar({ 
  className, 
  showMessage = true,
  compact = false 
}: UniversalProgressBarProps) {
  const { progressStats, isLoading } = useDailyWelcome();
  const { profile } = useProfile();
  
  const persona = getPersonaFromUserType(profile?.user_type || null);
  const lang = getPersonaLanguage(persona);

  if (isLoading) {
    return null;
  }

  const { completedToday, totalToday, completedThisWeek, currentStreak } = progressStats;
  
  // Calculate progress percentage
  const progressPercentage = totalToday > 0 
    ? Math.round((completedToday / totalToday) * 100) 
    : 0;

  // Generate encouraging message based on progress
  const getProgressMessage = (): string => {
    if (completedToday === 0 && totalToday === 0) {
      return "Ready to add your first task today?";
    }
    if (completedToday === 0) {
      return "You've got this! Start with one small step.";
    }
    if (completedToday === totalToday && totalToday > 0) {
      return `${lang.victory || "Amazing!"} You completed everything today! ${lang.victoryEmoji || "🎉"}`;
    }
    if (progressPercentage >= 75) {
      return "Almost there! You're doing incredible work.";
    }
    if (progressPercentage >= 50) {
      return "Halfway through! Keep the momentum going.";
    }
    if (progressPercentage >= 25) {
      return "Great start! Every completed task is a win.";
    }
    return lang.encouragement || "Every small step matters. You're doing great.";
  };

  // Don't show if no data
  if (totalToday === 0 && completedThisWeek === 0 && currentStreak === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex-1 min-w-0">
          <Progress value={progressPercentage} className="h-2" />
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {completedToday}/{totalToday}
        </span>
        {currentStreak > 0 && (
          <span className="flex items-center gap-1 text-xs text-orange-500">
            <Flame className="h-3 w-3" />
            {currentStreak}
          </span>
        )}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-lg p-4 border border-primary/10",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Today's Progress</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            {completedToday}/{totalToday} completed
          </span>
          {currentStreak > 0 && (
            <span className="flex items-center gap-1 text-orange-500">
              <Flame className="h-4 w-4" />
              {currentStreak} day streak
            </span>
          )}
          {completedThisWeek >= 10 && (
            <span className="flex items-center gap-1 text-yellow-500">
              <Trophy className="h-4 w-4" />
              {completedThisWeek} this week
            </span>
          )}
        </div>
      </div>

      <Progress value={progressPercentage} className="h-3 mb-2" />

      {showMessage && (
        <p className="text-sm text-muted-foreground">
          {getProgressMessage()}
        </p>
      )}
    </motion.div>
  );
}
