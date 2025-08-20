import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface CheckInNudge {
  id: string;
  timestamp: number;
  type: 'morning' | 'afternoon' | 'evening' | 'activity';
  message: string;
}

const NUDGE_MESSAGES = {
  morning: [
    'Good morning! Ready for a quick 60-second check-in?',
    'How are you feeling this morning? Quick check-in?',
    'Start your day with a moment of reflection?'
  ],
  afternoon: [
    'How\'s your afternoon going? 60-second check-in?',
    'Quick energy check - how are you feeling?',
    'Mid-day reflection - want to check in?'
  ],
  evening: [
    'How was your day? Quick evening check-in?',
    'Wind down with a 60-second reflection?',
    'End your day with a gentle check-in?'
  ],
  activity: [
    'You\'ve been active for a while. Time for a quick check-in?',
    'How are you feeling right now? Quick 60-second reflection?',
    'Take a moment to check in with yourself?'
  ]
};

const STORAGE_KEY = 'myrhythm_checkin_nudges';

interface NudgeSettings {
  lastPrompt: number;
  promptCount: number;
  quietHours: { start: number; end: number };
  maxDailyPrompts: number;
}

export function useCheckInNudges() {
  const { user } = useAuth();
  const { hasFeature } = useSubscription();
  const subscribed = hasFeature('basicAccess');
  const [showNudge, setShowNudge] = useState(false);
  const [currentNudge, setCurrentNudge] = useState<CheckInNudge | null>(null);

  // Load settings from localStorage
  const getSettings = (): NudgeSettings => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {
        lastPrompt: 0,
        promptCount: 0,
        quietHours: { start: 22, end: 7 }, // 10 PM to 7 AM
        maxDailyPrompts: 2
      };
    } catch {
      return {
        lastPrompt: 0,
        promptCount: 0,
        quietHours: { start: 22, end: 7 },
        maxDailyPrompts: 2
      };
    }
  };

  const saveSettings = (settings: NudgeSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save nudge settings:', error);
    }
  };

  // Check if we should show a nudge
  const shouldTriggerNudge = (): boolean => {
    // Only for authenticated, paid users
    if (!user || !subscribed) return false;

    const settings = getSettings();
    const now = Date.now();
    const currentHour = new Date().getHours();
    
    // Check quiet hours
    const { start, end } = settings.quietHours;
    if (start > end) {
      // Overnight quiet hours (e.g., 22 to 7)
      if (currentHour >= start || currentHour < end) return false;
    } else {
      // Same day quiet hours
      if (currentHour >= start && currentHour < end) return false;
    }

    // Check daily limit
    const today = new Date().toDateString();
    const lastPromptDate = new Date(settings.lastPrompt).toDateString();
    
    if (today === lastPromptDate && settings.promptCount >= settings.maxDailyPrompts) {
      return false;
    }

    // Check minimum time between prompts (4 hours)
    const timeSinceLastPrompt = now - settings.lastPrompt;
    const minInterval = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
    
    return timeSinceLastPrompt >= minInterval;
  };

  // Generate appropriate nudge based on time
  const generateNudge = (): CheckInNudge => {
    const now = new Date();
    const hour = now.getHours();
    
    let type: CheckInNudge['type'];
    if (hour >= 6 && hour < 12) {
      type = 'morning';
    } else if (hour >= 12 && hour < 18) {
      type = 'afternoon';
    } else if (hour >= 18 && hour < 22) {
      type = 'evening';
    } else {
      type = 'activity';
    }

    const messages = NUDGE_MESSAGES[type];
    const message = messages[Math.floor(Math.random() * messages.length)];

    return {
      id: `nudge-${Date.now()}`,
      timestamp: Date.now(),
      type,
      message
    };
  };

  // Trigger a nudge check
  const triggerNudgeCheck = () => {
    if (shouldTriggerNudge()) {
      const nudge = generateNudge();
      setCurrentNudge(nudge);
      setShowNudge(true);

      // Update settings
      const settings = getSettings();
      const today = new Date().toDateString();
      const lastPromptDate = new Date(settings.lastPrompt).toDateString();
      
      saveSettings({
        ...settings,
        lastPrompt: Date.now(),
        promptCount: today === lastPromptDate ? settings.promptCount + 1 : 1
      });
    }
  };

  // Accept nudge and show check-in
  const acceptNudge = () => {
    setShowNudge(false);
    // Navigate to check-in (would be implemented by parent component)
    return currentNudge;
  };

  // Dismiss nudge
  const dismissNudge = () => {
    setShowNudge(false);
    setCurrentNudge(null);
  };

  // Auto-trigger on mount and periodically
  useEffect(() => {
    if (!user || !subscribed) return;

    // Initial check
    triggerNudgeCheck();

    // Set up periodic checks (every 30 minutes)
    const interval = setInterval(triggerNudgeCheck, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, subscribed]);

  return {
    showNudge,
    currentNudge,
    acceptNudge,
    dismissNudge,
    triggerNudgeCheck
  };
}