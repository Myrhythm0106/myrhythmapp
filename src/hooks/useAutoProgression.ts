
import { useEffect, useState } from 'react';

interface UseAutoProgressionProps {
  isFormValid: boolean;
  onProgress: () => void;
  delay?: number;
  enabled?: boolean;
}

export function useAutoProgression({ 
  isFormValid, 
  onProgress, 
  delay = 7000,
  enabled = true 
}: UseAutoProgressionProps) {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled || !isFormValid) {
      setCountdown(null);
      return;
    }

    setCountdown(delay / 1000);
    
    const timer = setTimeout(() => {
      onProgress();
      setCountdown(null);
    }, delay);

    const countdownInterval = setInterval(() => {
      setCountdown(prev => prev ? prev - 1 : null);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [isFormValid, onProgress, delay, enabled]);

  const cancelProgression = () => {
    setCountdown(null);
  };

  return { countdown, cancelProgression };
}
