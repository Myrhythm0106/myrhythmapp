import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Brain, CheckCircle2, Sparkles, AlertTriangle, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export type ProcessingStage = 'idle' | 'saving' | 'transcribing' | 'extracting' | 'completed' | 'error';

interface EnhancedProcessingProgressProps {
  stage: ProcessingStage;
  actionsCount?: number;
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
}

const stageConfig = {
  idle: {
    icon: Mic,
    label: 'Ready to Record',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/50',
    progress: 0,
  },
  saving: {
    icon: Loader2,
    label: 'Saving Recording...',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    progress: 15,
  },
  transcribing: {
    icon: Mic,
    label: 'Transcribing Audio...',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    progress: 45,
  },
  extracting: {
    icon: Brain,
    label: 'Finding Your Actions...',
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10',
    progress: 75,
  },
  completed: {
    icon: CheckCircle2,
    label: 'Processing Complete!',
    color: 'text-green-600',
    bgColor: 'bg-green-500/10',
    progress: 100,
  },
  error: {
    icon: AlertTriangle,
    label: 'Processing Failed',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    progress: 0,
  },
};

export function EnhancedProcessingProgress({ 
  stage, 
  actionsCount = 0, 
  errorMessage,
  onRetry,
  className 
}: EnhancedProcessingProgressProps) {
  const config = stageConfig[stage];
  const Icon = config.icon;
  const isAnimating = ['saving', 'transcribing', 'extracting'].includes(stage);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn('rounded-xl p-6', config.bgColor, className)}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon */}
          <motion.div
            animate={isAnimating ? { scale: [1, 1.1, 1], rotate: stage === 'saving' ? 360 : 0 } : {}}
            transition={{ duration: 1.5, repeat: isAnimating ? Infinity : 0 }}
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center',
              stage === 'completed' ? 'bg-green-500' : stage === 'error' ? 'bg-destructive' : 'bg-primary'
            )}
          >
            <Icon className={cn('h-8 w-8', stage === 'completed' || stage === 'error' ? 'text-white' : 'text-primary-foreground')} />
          </motion.div>

          {/* Label */}
          <div>
            <h3 className={cn('text-lg font-semibold', config.color)}>
              {config.label}
            </h3>
            
            {stage === 'transcribing' && (
              <p className="text-sm text-muted-foreground mt-1">
                Converting speech to text... usually takes 30-60 seconds
              </p>
            )}
            
            {stage === 'extracting' && (
              <p className="text-sm text-muted-foreground mt-1">
                AI is discovering commitments and action items...
              </p>
            )}
            
            {stage === 'completed' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm text-muted-foreground mt-1">
                  {actionsCount > 0 
                    ? `🎉 Found ${actionsCount} action${actionsCount !== 1 ? 's' : ''} ready to review!`
                    : 'Recording processed successfully!'
                  }
                </p>
              </motion.div>
            )}
            
            {stage === 'error' && (
              <div className="mt-2 space-y-2">
                <p className="text-sm text-muted-foreground">
                  {errorMessage || 'Something went wrong. Your recording is saved safely.'}
                </p>
                {onRetry && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="mt-2"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {isAnimating && (
            <div className="w-full max-w-xs space-y-2">
              <Progress value={config.progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{config.progress}%</span>
                {stage === 'transcribing' && <span>~30-60 seconds</span>}
                {stage === 'extracting' && <span>Almost done...</span>}
              </div>
            </div>
          )}

          {/* Motivational Messages */}
          {isAnimating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span>
                {stage === 'saving' && "Your memory is being captured..."}
                {stage === 'transcribing' && "Every word matters..."}
                {stage === 'extracting' && "Finding what you committed to..."}
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
