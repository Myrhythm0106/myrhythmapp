import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

type Threshold = '5min' | '1min' | '10s' | 'zero';

const CHIME_MUTED_KEY = 'mb_chime_muted';

function playChime(pattern: 'warn' | 'danger') {
  try {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(CHIME_MUTED_KEY) === '1') return;
    const AudioCtx =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const beeps = pattern === 'danger' ? 2 : 1;
    for (let i = 0; i < beeps; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = pattern === 'danger' ? 880 : 660;
      const start = now + i * 0.25;
      const end = start + 0.18;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(end + 0.05);
    }
    setTimeout(() => ctx.close().catch(() => {}), 1500);
  } catch {
    // silent fail — chime is nice-to-have
  }
}

function silenceChimeAction() {
  try {
    localStorage.setItem(CHIME_MUTED_KEY, '1');
    toast.success('Chime silenced on this device');
  } catch {
    /* noop */
  }
}

interface Options {
  /** Whether recording is currently active. Hook is inert when false. */
  active: boolean;
  /** Live remaining seconds before auto-stop / limit. */
  remainingSec: number;
  /** Key that identifies this recording session — resets fired thresholds when it changes. */
  sessionKey: string | number | null;
}

/**
 * Fires on-screen toasts + soft chime at 5 min, 1 min, 10 s, and 0 s
 * as a recording approaches its limit. Each threshold fires exactly
 * once per session.
 */
export function useRecordingCountdownAlerts({
  active,
  remainingSec,
  sessionKey,
}: Options) {
  const firedRef = useRef<Set<Threshold>>(new Set());
  const lastSessionRef = useRef<string | number | null>(null);

  // Reset fired thresholds when a new session begins
  useEffect(() => {
    if (sessionKey !== lastSessionRef.current) {
      firedRef.current = new Set();
      lastSessionRef.current = sessionKey;
    }
  }, [sessionKey]);

  useEffect(() => {
    if (!active) return;
    const fired = firedRef.current;

    const fire = (t: Threshold, run: () => void) => {
      if (fired.has(t)) return;
      fired.add(t);
      run();
    };

    if (remainingSec <= 0) {
      fire('zero', () => {
        toast.success("Time's up — your recording has been saved", {
          duration: 6000,
        });
      });
      return;
    }

    if (remainingSec <= 10) {
      fire('10s', () => {
        toast.error(`${Math.ceil(remainingSec)} seconds left — wrapping up`, {
          duration: 5000,
          className: 'animate-pulse',
        });
        playChime('danger');
      });
      return;
    }

    if (remainingSec <= 60) {
      fire('1min', () => {
        toast.error('1 minute left — recording will auto-stop', {
          description: 'Finish your thought — we\'ll save everything.',
          duration: 8000,
          action: {
            label: 'Silence chime',
            onClick: silenceChimeAction,
          },
        });
        playChime('danger');
      });
      return;
    }

    if (remainingSec <= 5 * 60) {
      fire('5min', () => {
        toast.warning('5 minutes left — wrap up your thought', {
          description: 'You can keep going, just keep an eye on the timer.',
          duration: 6000,
          action: {
            label: 'Silence chime',
            onClick: silenceChimeAction,
          },
        });
        playChime('warn');
      });
    }
  }, [active, remainingSec]);
}
