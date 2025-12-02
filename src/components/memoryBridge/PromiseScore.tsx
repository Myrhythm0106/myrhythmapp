import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, TrendingUp, Star, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PromiseScoreProps {
  completedCount: number;
  totalCount: number;
  streakDays: number;
  className?: string;
}

export function PromiseScore({ completedCount, totalCount, streakDays, className }: PromiseScoreProps) {
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  // Determine score level
  const getScoreLevel = (rate: number) => {
    if (rate >= 90) return { label: 'Champion', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: Trophy };
    if (rate >= 75) return { label: 'Rising Star', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Star };
    if (rate >= 50) return { label: 'Building Momentum', color: 'text-green-500', bg: 'bg-green-500/10', icon: TrendingUp };
    return { label: 'Getting Started', color: 'text-muted-foreground', bg: 'bg-muted/50', icon: CheckCircle2 };
  };

  const scoreLevel = getScoreLevel(completionRate);
  const Icon = scoreLevel.icon;

  const getMotivationalMessage = () => {
    if (completionRate >= 90) return "You're absolutely crushing it! 🏆";
    if (completionRate >= 75) return "Outstanding commitment! Keep it up! ⭐";
    if (completionRate >= 50) return "Great progress! Every step counts! 💪";
    if (totalCount === 0) return "Your journey begins with the first action! 🚀";
    return "Building habits takes time - you've got this! 🌱";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={className}
    >
      <Card className={cn('border-2 overflow-hidden', scoreLevel.bg)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className={cn('w-12 h-12 rounded-full flex items-center justify-center', scoreLevel.bg)}
              >
                <Icon className={cn('h-6 w-6', scoreLevel.color)} />
              </motion.div>
              <div>
                <h3 className="font-bold text-lg">Promise Score</h3>
                <Badge variant="outline" className={scoreLevel.color}>
                  {scoreLevel.label}
                </Badge>
              </div>
            </div>
            
            {/* Streak Badge */}
            {streakDays > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5 bg-orange-500/10 text-orange-600 px-3 py-1.5 rounded-full"
              >
                <Flame className="h-4 w-4" />
                <span className="font-bold">{streakDays}</span>
                <span className="text-xs">day streak</span>
              </motion.div>
            )}
          </div>

          {/* Progress Display */}
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-4xl font-bold">{completionRate}</span>
                <span className="text-xl text-muted-foreground">%</span>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{completedCount}</span> of{' '}
                <span>{totalCount}</span> promises kept
              </div>
            </div>
            
            <Progress 
              value={completionRate} 
              className="h-3"
            />
            
            {/* Motivational Message */}
            <motion.p
              key={completionRate}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-center text-muted-foreground italic"
            >
              {getMotivationalMessage()}
            </motion.p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{completedCount}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{totalCount - completedCount}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{streakDays}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
