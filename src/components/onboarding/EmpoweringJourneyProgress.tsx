import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, User, Map, Brain, Users, Mic, Trophy, 
  CheckCircle, Circle, Sparkles 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useJourneyProgress } from '@/hooks/useJourneyProgress';
import { useMilestoneCelebrations } from '@/hooks/useMilestoneCelebrations';
import { EmpoweringTerm } from '@/components/ui/EmpoweringTerm';

interface JourneyStep {
  id: string;
  empoweringTitle: string;
  plainTitle: string;
  description: string;
  icon: React.ElementType;
  celebrationEmoji: string;
}

const EMPOWERING_JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'launch',
    empoweringTitle: 'Launch Your Journey',
    plainTitle: 'Get Started',
    description: 'Take the first step toward empowerment',
    icon: Rocket,
    celebrationEmoji: '🚀'
  },
  {
    id: 'discover',
    empoweringTitle: 'Discover Your Identity',
    plainTitle: 'User Profile',
    description: 'Tell us who you are',
    icon: User,
    celebrationEmoji: '👤'
  },
  {
    id: 'path',
    empoweringTitle: 'Choose Your Path',
    plainTitle: 'Guided or Explorer',
    description: 'Select your navigation style',
    icon: Map,
    celebrationEmoji: '🛤️'
  },
  {
    id: 'profile',
    empoweringTitle: 'Build Your Rhythm Profile',
    plainTitle: 'Assessment',
    description: 'Discover your cognitive rhythm',
    icon: Brain,
    celebrationEmoji: '🧠'
  },
  {
    id: 'foundation',
    empoweringTitle: 'Build Your Foundation',
    plainTitle: 'Support Circle',
    description: 'Invite your accountability network',
    icon: Users,
    celebrationEmoji: '💪'
  },
  {
    id: 'voice',
    empoweringTitle: 'Activate Your Voice',
    plainTitle: 'Memory Bridge',
    description: 'Capture your first conversation',
    icon: Mic,
    celebrationEmoji: '🎤'
  },
  {
    id: 'victory',
    empoweringTitle: 'Claim Your First Victory',
    plainTitle: 'Complete First Action',
    description: 'Schedule and complete a commitment',
    icon: Trophy,
    celebrationEmoji: '🏆'
  }
];

interface EmpoweringJourneyProgressProps {
  variant?: 'full' | 'mini' | 'compact';
  className?: string;
  showCelebrations?: boolean;
}

export function EmpoweringJourneyProgress({ 
  variant = 'full',
  className,
  showCelebrations = true
}: EmpoweringJourneyProgressProps) {
  const { 
    progress, 
    isStepCompleted, 
    isStepCurrent, 
    getCompletionPercentage,
    shouldCelebrate,
    markMilestoneCelebrated
  } = useJourneyProgress();
  
  const { celebrateStepComplete } = useMilestoneCelebrations();

  // Trigger celebrations for newly completed steps
  useEffect(() => {
    if (!showCelebrations) return;
    
    EMPOWERING_JOURNEY_STEPS.forEach(step => {
      if (shouldCelebrate(step.id)) {
        celebrateStepComplete(step.id);
        markMilestoneCelebrated(step.id);
      }
    });
  }, [progress.completedSteps, shouldCelebrate, celebrateStepComplete, markMilestoneCelebrated, showCelebrations]);

  const completionPercentage = getCompletionPercentage();

  if (variant === 'mini') {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-sunrise-amber-500" />
          <span className="text-sm font-medium text-foreground">
            Journey Progress
          </span>
          <span className="text-sm text-muted-foreground ml-auto">
            {completionPercentage}%
          </span>
        </div>
        <div className="flex items-center gap-1">
          {EMPOWERING_JOURNEY_STEPS.map((step, index) => {
            const completed = isStepCompleted(step.id);
            const current = isStepCurrent(step.id);
            const Icon = step.icon;
            
            return (
              <React.Fragment key={step.id}>
                <motion.div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full transition-all",
                    completed && "bg-memory-emerald-100 text-memory-emerald-600",
                    current && "bg-clarity-teal-100 text-clarity-teal-600 ring-2 ring-clarity-teal-400",
                    !completed && !current && "bg-muted text-muted-foreground"
                  )}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: current ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {completed ? (
                    <span className="text-sm">{step.celebrationEmoji}</span>
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </motion.div>
                {index < EMPOWERING_JOURNEY_STEPS.length - 1 && (
                  <div className={cn(
                    "flex-1 h-1 rounded-full transition-all",
                    completed ? "bg-memory-emerald-400" : "bg-muted"
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn("bg-card border rounded-xl p-4", className)}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sunrise-amber-500" />
            <span className="font-semibold text-foreground">Your Empowerment Journey</span>
          </div>
          <span className="text-sm font-medium text-brain-health-600">
            {progress.completedSteps.length}/{EMPOWERING_JOURNEY_STEPS.length} complete
          </span>
        </div>
        <Progress value={completionPercentage} className="h-2 mb-3" />
        <div className="flex flex-wrap gap-2">
          {EMPOWERING_JOURNEY_STEPS.map(step => {
            const completed = isStepCompleted(step.id);
            const current = isStepCurrent(step.id);
            
            return (
              <div
                key={step.id}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all",
                  completed && "bg-memory-emerald-100 text-memory-emerald-700",
                  current && "bg-clarity-teal-100 text-clarity-teal-700 ring-1 ring-clarity-teal-400",
                  !completed && !current && "bg-muted text-muted-foreground"
                )}
              >
                {completed ? step.celebrationEmoji : ''} {step.plainTitle}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={cn("bg-card border rounded-2xl p-6", className)}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sunrise-amber-100 text-sunrise-amber-700 mb-3">
          <Sparkles className="h-5 w-5" />
          <span className="font-medium">Your Empowerment Journey</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Building Your Foundation
        </h2>
        <p className="text-muted-foreground">
          Every step brings you closer to living empowered
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-brain-health-600">
            {progress.completedSteps.length} of {EMPOWERING_JOURNEY_STEPS.length} milestones
          </span>
        </div>
        <div className="relative">
          <Progress value={completionPercentage} className="h-3" />
          {/* Milestone markers */}
          <div className="absolute inset-0 flex justify-between items-center px-1">
            {EMPOWERING_JOURNEY_STEPS.map((step, index) => {
              const position = (index / (EMPOWERING_JOURNEY_STEPS.length - 1)) * 100;
              const completed = isStepCompleted(step.id);
              
              return (
                <div
                  key={step.id}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    completed ? "bg-memory-emerald-500" : "bg-muted-foreground/30"
                  )}
                  style={{ marginLeft: index === 0 ? 0 : 'auto' }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        <AnimatePresence>
          {EMPOWERING_JOURNEY_STEPS.map((step, index) => {
            const completed = isStepCompleted(step.id);
            const current = isStepCurrent(step.id);
            const Icon = step.icon;
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl transition-all",
                  completed && "bg-memory-emerald-50 border border-memory-emerald-200",
                  current && "bg-clarity-teal-50 border border-clarity-teal-300 shadow-sm",
                  !completed && !current && "bg-muted/30 border border-transparent"
                )}
              >
                {/* Step indicator */}
                <motion.div
                  className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
                    completed && "bg-memory-emerald-100",
                    current && "bg-clarity-teal-100",
                    !completed && !current && "bg-muted"
                  )}
                  animate={current ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 2, repeat: current ? Infinity : 0 }}
                >
                  {completed ? (
                    <span className="text-2xl">{step.celebrationEmoji}</span>
                  ) : (
                    <Icon className={cn(
                      "h-6 w-6",
                      current ? "text-clarity-teal-600" : "text-muted-foreground"
                    )} />
                  )}
                </motion.div>

                {/* Step content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <EmpoweringTerm 
                      term={step.empoweringTitle}
                      plainText={step.plainTitle}
                      showPlainInline
                      className={cn(
                        "font-semibold",
                        completed && "text-memory-emerald-700",
                        current && "text-clarity-teal-700",
                        !completed && !current && "text-muted-foreground"
                      )}
                    />
                    {current && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-clarity-teal-200 text-clarity-teal-700 rounded-full">
                        You're here
                      </span>
                    )}
                  </div>
                  <p className={cn(
                    "text-sm",
                    completed || current ? "text-foreground/70" : "text-muted-foreground"
                  )}>
                    {step.description}
                  </p>
                </div>

                {/* Status indicator */}
                <div className="flex-shrink-0">
                  {completed ? (
                    <CheckCircle className="h-6 w-6 text-memory-emerald-500" />
                  ) : current ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Circle className="h-6 w-6 text-clarity-teal-400 fill-clarity-teal-200" />
                    </motion.div>
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground/30" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Encouragement message */}
      <div className="mt-6 text-center">
        {completionPercentage === 100 ? (
          <p className="text-memory-emerald-600 font-medium">
            🎉 Congratulations! You've completed your empowerment journey!
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            {completionPercentage < 30 
              ? "Every journey begins with a single step. You're doing great!"
              : completionPercentage < 60
              ? "Building momentum! Keep going, you're making real progress."
              : completionPercentage < 90
              ? "Almost there! Your foundation is nearly complete."
              : "Just one more step to claim your victory!"}
          </p>
        )}
      </div>
    </div>
  );
}
