import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Forgetting to stop should never cost anything.
 *
 * After a sustained stretch of quiet, a gentle "still going?" prompt appears
 * with a visible countdown. If nobody answers, the capture finishes itself and
 * saves — which is exactly what the person would have wanted.
 */
export interface QuietEndOptions {
  /** capture is live and not paused */
  active: boolean;
  /** seconds of continuous near-silence, from useMicLevel */
  silentSeconds: number;
  /** minutes of quiet before the grace prompt (null disables the whole thing) */
  quietMinutes: number | null;
  /** seconds the person has to say "keep going" */
  graceSeconds?: number;
  onFinish: (reason: 'quiet') => void;
}

export function useQuietEnd({
  active,
  silentSeconds,
  quietMinutes,
  graceSeconds = 30,
  onFinish,
}: QuietEndOptions) {
  const [promptOpen, setPromptOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(graceSeconds);
  const snoozeUntilRef = useRef(0);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  // Reset everything the moment capture stops.
  useEffect(() => {
    if (!active) {
      setPromptOpen(false);
      snoozeUntilRef.current = 0;
    }
  }, [active]);

  // Enough quiet? Offer the grace prompt.
  useEffect(() => {
    if (!active || promptOpen || !quietMinutes) return;
    if (Date.now() < snoozeUntilRef.current) return;
    if (silentSeconds >= quietMinutes * 60) {
      setSecondsLeft(graceSeconds);
      setPromptOpen(true);
    }
  }, [active, promptOpen, quietMinutes, silentSeconds, graceSeconds]);

  // Grace countdown — unanswered means finish and save.
  useEffect(() => {
    if (!promptOpen) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          setPromptOpen(false);
          finishRef.current('quiet');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [promptOpen]);

  const keepGoing = useCallback(() => {
    setPromptOpen(false);
    // Don't nag: give a full quiet window again before asking anything.
    snoozeUntilRef.current = Date.now() + (quietMinutes ?? 10) * 60 * 1000;
  }, [quietMinutes]);

  const finishNow = useCallback(() => {
    setPromptOpen(false);
    finishRef.current('quiet');
  }, []);

  return { promptOpen, secondsLeft, keepGoing, finishNow };
}
