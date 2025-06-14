
import React, { useState, useEffect } from "react";
import { VictoryCelebration } from "@/components/celebrations/VictoryCelebration";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";

interface EncouragementEngineProps {
  userType?: UserType;
  triggerType?: 'assessment_complete' | 'payment_success' | 'goal_created' | 'daily_win' | 'streak_milestone';
  customMessage?: string;
  milestone?: number;
}

export function EncouragementEngine({ 
  userType, 
  triggerType, 
  customMessage,
  milestone 
}: EncouragementEngineProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'daily_win' | 'streak_milestone' | 'goal_progress'>('daily_win');
  const [celebrationMessage, setCelebrationMessage] = useState('');

  useEffect(() => {
    if (triggerType) {
      handleTrigger(triggerType);
    }
  }, [triggerType]);

  const handleTrigger = (trigger: string) => {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    
    let message = '';
    let type: 'daily_win' | 'streak_milestone' | 'goal_progress' = 'daily_win';

    switch (trigger) {
      case 'assessment_complete':
        message = getAssessmentCompleteMessage(userType, timeOfDay);
        type = 'goal_progress';
        break;
      case 'payment_success':
        message = getPaymentSuccessMessage(userType, timeOfDay);
        type = 'goal_progress';
        break;
      case 'goal_created':
        message = getGoalCreatedMessage(userType, timeOfDay);
        type = 'goal_progress';
        break;
      case 'daily_win':
        message = getDailyWinMessage(userType, timeOfDay);
        type = 'daily_win';
        break;
      case 'streak_milestone':
        message = getStreakMilestoneMessage(userType, milestone);
        type = 'streak_milestone';
        break;
    }

    setCelebrationMessage(customMessage || message);
    setCelebrationType(type);
    setShowCelebration(true);
  };

  const getAssessmentCompleteMessage = (userType?: UserType, timeOfDay?: string) => {
    const baseMessages = [
      "🎉 You've taken the first powerful step in your journey!",
      "✨ What an incredible accomplishment - you've completed your assessment!",
      "🌟 This is just the beginning of something amazing!",
      "💪 You should feel proud - this was a big step forward!"
    ];

    const userSpecificMessages = {
      'brain-injury-recovery': [
        "You've shown incredible courage in taking this assessment - that's the spirit that will carry you forward!",
        "Every step forward matters, and you've just taken a big one!",
        "Your willingness to understand your journey shows real strength!"
      ],
      'cognitive-optimization': [
        "You're investing in your cognitive growth - that's the mindset of a high achiever!",
        "Taking this assessment shows you're serious about optimizing your potential!",
        "This is exactly the kind of strategic thinking that leads to breakthroughs!"
      ],
      'caregiver-support': [
        "What you're doing for your loved one (and yourself) is truly selfless and powerful!",
        "You're building the foundation for better support - what an act of love!",
        "Your dedication to understanding this journey shows incredible heart!"
      ],
      'wellness-productivity': [
        "You're taking control of your wellness journey - that's the first step to transformation!",
        "This assessment is your roadmap to a more productive, balanced life!",
        "You're prioritizing what matters most - your wellbeing and growth!"
      ]
    };

    const specific = userType ? userSpecificMessages[userType] : [];
    const allMessages = [...baseMessages, ...specific];
    
    return allMessages[Math.floor(Math.random() * allMessages.length)];
  };

  const getPaymentSuccessMessage = (userType?: UserType, timeOfDay?: string) => {
    const messages = [
      "🎉 Welcome to your personalized MyRhythm experience!",
      "✨ Your support circle will now be notified of your progress!",
      "🚀 You're fully equipped for success - let's make it happen!",
      "💫 Everything you need is now unlocked - time to thrive!"
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getGoalCreatedMessage = (userType?: UserType, timeOfDay?: string) => {
    const messages = [
      "🎯 Your first goal is set - momentum is building!",
      "✨ Goals turn dreams into plans - you're on your way!",
      "🌟 Every journey begins with a single goal - you've got this!",
      "💪 Goal created! Now let's make it happen together!"
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getDailyWinMessage = (userType?: UserType, timeOfDay?: string) => {
    const messages = [
      "🌟 Daily win achieved! You're building unstoppable momentum!",
      "✨ Another step forward - consistency is your superpower!",
      "🎉 Every win matters, and you just scored another one!",
      "💪 Daily progress adds up to life-changing results!"
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getStreakMilestoneMessage = (userType?: UserType, milestone?: number) => {
    return `🔥 ${milestone} days of consistency! Your dedication is inspiring!`;
  };

  const handleCloseCelebration = () => {
    setShowCelebration(false);
  };

  if (!showCelebration) return null;

  return (
    <VictoryCelebration
      isVisible={showCelebration}
      onClose={handleCloseCelebration}
      type={celebrationType}
      milestone={milestone}
      message={celebrationMessage}
    />
  );
}

// Hook for easy usage throughout the app
export const useEncouragement = () => {
  const [encouragementTrigger, setEncouragementTrigger] = useState<{
    type: string;
    userType?: UserType;
    customMessage?: string;
    milestone?: number;
  } | null>(null);

  const triggerEncouragement = (
    type: 'assessment_complete' | 'payment_success' | 'goal_created' | 'daily_win' | 'streak_milestone',
    options?: {
      userType?: UserType;
      customMessage?: string;
      milestone?: number;
    }
  ) => {
    setEncouragementTrigger({
      type,
      userType: options?.userType,
      customMessage: options?.customMessage,
      milestone: options?.milestone
    });

    // Clear after a short delay to allow re-triggering
    setTimeout(() => {
      setEncouragementTrigger(null);
    }, 100);
  };

  return {
    encouragementTrigger,
    triggerEncouragement,
    EncouragementComponent: encouragementTrigger ? (
      <EncouragementEngine
        triggerType={encouragementTrigger.type as any}
        userType={encouragementTrigger.userType}
        customMessage={encouragementTrigger.customMessage}
        milestone={encouragementTrigger.milestone}
      />
    ) : null
  };
};
