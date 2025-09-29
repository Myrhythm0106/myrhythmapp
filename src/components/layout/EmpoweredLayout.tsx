import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressiveCelebrations } from '@/hooks/useProgressiveCelebrations';
import { ProgressiveCelebration } from '@/components/ui/ProgressiveCelebration';
import { SmartOnboardingTip } from '@/components/ui/SmartOnboardingTip';

interface EmpoweredLayoutProps {
  children: React.ReactNode;
  showOnboardingTips?: boolean;
}

export function EmpoweredLayout({ 
  children, 
  showOnboardingTips = true 
}: EmpoweredLayoutProps) {
  const {
    showCelebration,
    currentMilestone,
    completeCelebration
  } = useProgressiveCelebrations();

  // Smart onboarding tips based on user progress
  const getSmartTips = () => {
    return [
      {
        id: 'voice_quality',
        title: 'Pro Tip: Better Audio Quality',
        description: 'For best results, record in a quiet environment and speak clearly. MyRhythm works best when it can clearly understand your voice.',
        action: 'Test Your Microphone',
        importance: 'medium' as const
      },
      {
        id: 'action_patterns',
        title: 'Smart Pattern Recognition',
        description: 'MyRhythm learns from your recording patterns to better identify actions and commitments over time.',
        importance: 'low' as const
      },
      {
        id: 'calendar_sync',
        title: 'Enhanced Calendar Integration',
        description: 'Connect your calendar for even smarter scheduling suggestions with conflict detection.',
        action: 'Connect Calendar',
        importance: 'high' as const
      }
    ];
  };

  const smartTips = showOnboardingTips ? getSmartTips() : [];

  return (
    <div className="relative min-h-screen">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>

      {/* Smart Onboarding Tips */}
      {showOnboardingTips && (
        <div className="fixed bottom-4 right-4 z-40 max-w-sm space-y-3">
          <AnimatePresence>
            {smartTips.slice(0, 2).map((tip, index) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <SmartOnboardingTip
                  tip={tip}
                  onDismiss={() => {
                    // Handle tip dismissal
                  }}
                  onAction={() => {
                    // Handle tip action
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Progressive Celebrations */}
      <AnimatePresence>
        {showCelebration && currentMilestone && (
          <ProgressiveCelebration
            milestone={currentMilestone}
            onContinue={completeCelebration}
          />
        )}
      </AnimatePresence>
    </div>
  );
}