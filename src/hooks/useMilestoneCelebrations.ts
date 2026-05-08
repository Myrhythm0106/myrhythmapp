import { useCallback } from 'react';
import { toast } from 'sonner';
import { celebrateSuccess, celebrateBigWin } from '@/utils/celebration';

export type CelebrationType = 'mini' | 'badge' | 'unlock' | 'profile' | 'team' | 'voice' | 'big';

interface MilestoneMessages {
  [key: string]: {
    title: string;
    description: string;
  };
}

const MILESTONE_MESSAGES: MilestoneMessages = {
  launch: {
    title: 'Journey Launched',
    description: 'You took the first step toward empowerment.'
  },
  discover: {
    title: 'Identity Discovered',
    description: 'Your profile is ready to personalise your experience.'
  },
  path: {
    title: 'Path Chosen',
    description: 'Your route is set.'
  },
  profile: {
    title: 'Rhythm Profile Built',
    description: 'Your cognitive patterns are mapped.'
  },
  foundation: {
    title: 'Foundation Built',
    description: 'Your support network is activated.'
  },
  voice: {
    title: 'Voice Activated',
    description: 'Your words now become actions.'
  },
  victory: {
    title: 'Victory Claimed',
    description: 'You are officially empowered.'
  }
};

export function useMilestoneCelebrations() {
  const celebrateMilestone = useCallback((type: CelebrationType, stepId: string) => {
    const message = MILESTONE_MESSAGES[stepId] || {
      title: 'Milestone Complete',
      description: 'Keep building momentum.'
    };

    switch (type) {
      case 'mini':
        celebrateSuccess({ particleCount: 30, spread: 40 });
        break;
      case 'badge':
        celebrateSuccess({ particleCount: 50, spread: 60 });
        break;
      case 'unlock':
        celebrateSuccess({ particleCount: 70, spread: 80 });
        break;
      case 'profile':
        celebrateSuccess({ particleCount: 80, spread: 90 });
        break;
      case 'team':
        celebrateSuccess({ particleCount: 60, spread: 70 });
        break;
      case 'voice':
        celebrateSuccess({ particleCount: 70, spread: 80 });
        break;
      case 'big':
        celebrateBigWin();
        break;
    }

    toast.success(message.title, {
      description: message.description,
      duration: 4000,
    });
  }, []);

  const celebrateStepComplete = useCallback((stepId: string) => {
    const celebrationMap: Record<string, CelebrationType> = {
      launch: 'mini',
      discover: 'badge',
      path: 'unlock',
      profile: 'profile',
      foundation: 'team',
      voice: 'voice',
      victory: 'big'
    };

    const type = celebrationMap[stepId] || 'mini';
    celebrateMilestone(type, stepId);
  }, [celebrateMilestone]);

  return { celebrateMilestone, celebrateStepComplete };
}
