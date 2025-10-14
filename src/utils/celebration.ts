import confetti from 'canvas-confetti';

export const celebrateSuccess = (options?: {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
}) => {
  const defaults = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  };

  confetti({
    ...defaults,
    ...options
  });
};

export const celebrateBigWin = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
};

export const celebrateActionComplete = () => {
  celebrateSuccess({
    particleCount: 50,
    spread: 50,
    origin: { y: 0.7 }
  });
};
