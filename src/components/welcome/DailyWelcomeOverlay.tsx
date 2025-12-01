import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useDailyWelcome } from '@/hooks/useDailyWelcome';
import { usePriorities } from '@/contexts/PriorityContext';
import { useProfile } from '@/hooks/useProfile';
import { useAssessmentToScheduling } from '@/hooks/useAssessmentToScheduling';
import { getPersonaLanguage, getPersonaFromUserType } from '@/utils/personaLanguage';
import { 
  Sun, 
  Moon, 
  CloudSun, 
  Target, 
  Sparkles, 
  Heart,
  Battery,
  BatteryLow,
  BatteryMedium,
  ChevronRight,
  Volume2
} from 'lucide-react';

interface DailyWelcomeOverlayProps {
  onClose?: () => void;
}

export function DailyWelcomeOverlay({ onClose }: DailyWelcomeOverlayProps) {
  const { 
    shouldShowWelcome, 
    isLoading, 
    progressStats, 
    dismissWelcome,
    getTimeBasedGreeting 
  } = useDailyWelcome();
  
  const { dailyPriorities, weeklyPriorities, yearlyPriorities, hasAnyPriorities } = usePriorities();
  const { profile } = useProfile();
  const { scheduleMapping } = useAssessmentToScheduling();
  const [selectedMood, setSelectedMood] = useState<'good' | 'okay' | 'rest' | null>(null);

  // Get persona-specific language
  const persona = getPersonaFromUserType(profile?.user_type || null);
  const lang = getPersonaLanguage(persona);

  // Don't render if not needed
  if (isLoading || !shouldShowWelcome) {
    return null;
  }

  const userName = profile?.name?.split(' ')[0] || 'there';
  const greeting = getTimeBasedGreeting();
  const hasPriorities = hasAnyPriorities(dailyPriorities);

  // Mood options with brain-injury-friendly labels
  const moodOptions = [
    { value: 'good' as const, label: lang.moodLabels?.[0] || 'Good energy', icon: Battery, color: 'text-green-500' },
    { value: 'okay' as const, label: lang.moodLabels?.[1] || 'Okay', icon: BatteryMedium, color: 'text-yellow-500' },
    { value: 'rest' as const, label: lang.moodLabels?.[2] || 'Need rest', icon: BatteryLow, color: 'text-orange-500' }
  ];

  const handleMoodSelect = (mood: 'good' | 'okay' | 'rest') => {
    setSelectedMood(mood);
  };

  const handleContinue = () => {
    dismissWelcome(selectedMood || undefined);
    onClose?.();
  };

  // Calculate progress percentage
  const progressPercentage = progressStats.totalToday > 0 
    ? Math.round((progressStats.completedToday / progressStats.totalToday) * 100) 
    : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-lg"
        >
          <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 pb-4">
              {/* Greeting */}
              <div className="flex items-center gap-3 mb-2">
                {new Date().getHours() < 12 ? (
                  <Sun className="h-8 w-8 text-yellow-500" />
                ) : new Date().getHours() < 17 ? (
                  <CloudSun className="h-8 w-8 text-orange-400" />
                ) : (
                  <Moon className="h-8 w-8 text-indigo-400" />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {greeting}, {userName}!
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {lang.warmWelcome || "You're taking control of your day. That takes real strength."}
                  </p>
                </div>
              </div>

              {/* Voice option - always visible for cognitive accessibility */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  // Text-to-speech functionality
                  const utterance = new SpeechSynthesisUtterance(
                    `${greeting} ${userName}. ${lang.warmWelcome || "You're taking control of your day."}`
                  );
                  speechSynthesis.speak(utterance);
                }}
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Read aloud
              </Button>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Progress reminder - users forget their wins */}
              {(progressStats.completedThisWeek > 0 || progressStats.currentStreak > 0) && (
                <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-300">
                      {lang.progressAck || "Look at all you've accomplished!"}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-green-700 dark:text-green-400">
                    <span>✨ {progressStats.completedThisWeek} completed this week</span>
                    {progressStats.currentStreak > 0 && (
                      <span>🔥 {progressStats.currentStreak} day streak</span>
                    )}
                  </div>
                </div>
              )}

              {/* Today's Priorities - Max 3 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-foreground">
                    Today's Focus
                  </h2>
                </div>
                
                {hasPriorities ? (
                  <div className="space-y-2">
                    {dailyPriorities.p1 && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                          P1
                        </span>
                        <span className="font-medium">{dailyPriorities.p1}</span>
                      </div>
                    )}
                    {dailyPriorities.p2 && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-sm">
                          P2
                        </span>
                        <span>{dailyPriorities.p2}</span>
                      </div>
                    )}
                    {dailyPriorities.p3 && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground font-bold text-sm">
                          P3
                        </span>
                        <span className="text-muted-foreground">{dailyPriorities.p3}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm p-3 bg-muted/30 rounded-lg">
                    No priorities set yet. That's okay - you can add them anytime.
                  </p>
                )}
              </div>

              {/* Schedule reasoning - show WHY */}
              {scheduleMapping.displayReason && (
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 {scheduleMapping.displayReason}
                  </p>
                </div>
              )}

              {/* Connection to yearly vision */}
              {hasAnyPriorities(yearlyPriorities) && yearlyPriorities.p1 && (
                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Building toward your vision:</p>
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-500" />
                    {yearlyPriorities.p1}
                  </p>
                </div>
              )}

              {/* Mood check - simple 3 options */}
              <div>
                <p className="text-sm font-medium mb-3">How are you feeling?</p>
                <div className="flex gap-2">
                  {moodOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <Button
                        key={option.value}
                        variant={selectedMood === option.value ? "default" : "outline"}
                        className={`flex-1 h-auto py-3 flex flex-col items-center gap-1 ${
                          selectedMood === option.value ? '' : 'hover:bg-muted'
                        }`}
                        onClick={() => handleMoodSelect(option.value)}
                      >
                        <Icon className={`h-5 w-5 ${selectedMood === option.value ? 'text-primary-foreground' : option.color}`} />
                        <span className="text-xs">{option.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Single clear CTA - 48px minimum height */}
              <Button 
                onClick={handleContinue}
                className="w-full h-14 text-lg font-medium"
                size="lg"
              >
                {lang.ctaText || "Let's start your day"}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>

              {/* Today's progress bar */}
              {progressStats.totalToday > 0 && (
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Today's progress</span>
                    <span>{progressStats.completedToday}/{progressStats.totalToday}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
