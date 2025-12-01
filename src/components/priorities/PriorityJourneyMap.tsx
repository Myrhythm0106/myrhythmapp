import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { usePriorities } from '@/contexts/PriorityContext';
import { getPersonaLanguage, getPersonaFromUserType } from '@/utils/personaLanguage';
import { useProfile } from '@/hooks/useProfile';
import { 
  Star, 
  Calendar, 
  CalendarDays, 
  CalendarCheck, 
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowDown,
  Sparkles,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriorityJourneyMapProps {
  className?: string;
  collapsible?: boolean;
  showProgress?: boolean;
}

export function PriorityJourneyMap({ 
  className, 
  collapsible = true,
  showProgress = true 
}: PriorityJourneyMapProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const { profile } = useProfile();
  const {
    dailyPriorities,
    weeklyPriorities,
    monthlyPriorities,
    yearlyPriorities,
    hasAnyPriorities,
    getDailyProgress,
    getWeeklyProgress,
    getMonthlyProgress,
    getYearlyProgress
  } = usePriorities();

  const persona = getPersonaFromUserType(profile?.user_type || null);
  const lang = getPersonaLanguage(persona);

  // Priority levels configuration
  const levels = [
    {
      key: 'yearly',
      label: 'Your Year',
      icon: Star,
      priorities: yearlyPriorities,
      progress: getYearlyProgress(),
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      borderColor: 'border-amber-200 dark:border-amber-800',
      description: 'Your vision for this year'
    },
    {
      key: 'monthly',
      label: 'This Month',
      icon: CalendarDays,
      priorities: monthlyPriorities,
      progress: getMonthlyProgress(),
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
      description: 'Monthly milestones'
    },
    {
      key: 'weekly',
      label: 'This Week',
      icon: Calendar,
      priorities: weeklyPriorities,
      progress: getWeeklyProgress(),
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      borderColor: 'border-green-200 dark:border-green-800',
      description: 'Weekly focus areas'
    },
    {
      key: 'daily',
      label: 'Today',
      icon: CalendarCheck,
      priorities: dailyPriorities,
      progress: getDailyProgress(),
      color: 'from-primary to-primary/80',
      bgColor: 'bg-primary/5',
      borderColor: 'border-primary/20',
      description: "Today's priorities"
    }
  ];

  // Check if any priorities exist
  const hasAny = levels.some(level => hasAnyPriorities(level.priorities));

  if (!hasAny) {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardContent className="p-6 text-center">
          <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            No priorities set yet. Start with your yearly vision and work down to today!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5 text-pink-500" />
            Your Priority Journey
          </CardTitle>
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Every step today builds toward your yearly vision
        </p>
      </CardHeader>

      <AnimatePresence initial={false}>
        {(isExpanded || !collapsible) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-2 pb-4">
              <div className="relative space-y-3">
                {levels.map((level, index) => {
                  const Icon = level.icon;
                  const hasPriorities = hasAnyPriorities(level.priorities);
                  const isLast = index === levels.length - 1;

                  return (
                    <div key={level.key} className="relative">
                      {/* Connection line */}
                      {!isLast && (
                        <div className="absolute left-5 top-14 w-0.5 h-6 bg-gradient-to-b from-muted-foreground/30 to-muted-foreground/10 flex items-center justify-center">
                          <ArrowDown className="h-3 w-3 text-muted-foreground/50 absolute -bottom-1" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "relative rounded-lg border p-4 transition-all",
                          level.bgColor,
                          level.borderColor,
                          !hasPriorities && "opacity-50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className={cn(
                            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br text-white",
                            level.color
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-foreground">
                                {level.label}
                              </span>
                              {showProgress && level.progress.total > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  {level.progress.completed}/{level.progress.total}
                                </span>
                              )}
                            </div>

                            {hasPriorities ? (
                              <div className="space-y-1">
                                {level.priorities.p1 && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground w-6">P1</span>
                                    <span className="text-sm font-medium truncate">{level.priorities.p1}</span>
                                  </div>
                                )}
                                {level.priorities.p2 && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground w-6">P2</span>
                                    <span className="text-sm text-muted-foreground truncate">{level.priorities.p2}</span>
                                  </div>
                                )}
                                {level.priorities.p3 && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground w-6">P3</span>
                                    <span className="text-sm text-muted-foreground truncate">{level.priorities.p3}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                {level.description}
                              </p>
                            )}

                            {/* Progress bar */}
                            {showProgress && level.progress.total > 0 && (
                              <div className="mt-2">
                                <Progress 
                                  value={level.progress.percentage} 
                                  className="h-1.5" 
                                />
                              </div>
                            )}
                          </div>

                          {/* Completion indicator */}
                          {level.progress.completed === level.progress.total && level.progress.total > 0 && (
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Motivational message */}
              <div className="mt-4 p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/10">
                <p className="text-sm text-center text-muted-foreground">
                  {lang.encouragement || "Every small step matters. You're doing great."}
                </p>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
