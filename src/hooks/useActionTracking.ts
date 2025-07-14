
import { useUserProgress } from './useUserProgress';
import { toast } from 'sonner';

export function useActionTracking() {
  const { trackActionCompletion, trackFeatureUse, metrics } = useUserProgress();

  const trackAction = (actionType: string, showFeedback = true) => {
    trackActionCompletion();
    
    if (showFeedback) {
      const encouragements = [
        "Great job! Keep building momentum! 🚀",
        "Another step forward! You're doing amazing! ⭐",
        "Consistency is key - well done! 💪",
        "Progress made! Every action counts! 🎯"
      ];
      
      const message = encouragements[Math.floor(Math.random() * encouragements.length)];
      toast.success(message);
    }

    // Check if this action might unlock something
    if (metrics.readinessScore % 10 === 9) { // Near unlock thresholds
      setTimeout(() => {
        toast.info("You're close to unlocking new features! Keep going! 🌟");
      }, 1000);
    }
  };

  const trackFeatureUsage = (featureId: string) => {
    trackFeatureUse(featureId);
  };

  return {
    trackAction,
    trackFeatureUsage,
    metrics
  };
}
