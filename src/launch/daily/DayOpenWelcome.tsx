import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sunrise, Compass, ArrowRight } from 'lucide-react';
import { getDailyStatement } from '@/data/iChooseStatements';

const VISION_KEY = 'myrhythm.visionStatement.v1';

function todayKey(): string {
  const d = new Date();
  return `myrhythm.dayOpen.${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function bucket(): 'morning' | 'afternoon' | 'evening' {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

const OPENERS: Record<string, { hello: string; line: string }> = {
  morning: {
    hello: 'A new day is mine',
    line: "Nothing from yesterday gets to decide today. I set the pace, I set the tone.",
  },
  afternoon: {
    hello: 'The rest of today is mine',
    line: "However this morning went, I still hold the pen. One clear step forward is enough.",
  },
  evening: {
    hello: 'This evening is mine',
    line: "I get to close today well — gently, on my terms, with something to be proud of.",
  },
};

function loadVision(): string {
  try {
    const raw = localStorage.getItem(VISION_KEY);
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    return typeof parsed?.statement === 'string' ? parsed.statement.trim() : '';
  } catch {
    return '';
  }
}

interface DayOpenWelcomeProps {
  name?: string;
}

/**
 * Full-screen, once-a-day warm welcome. Confidence, control, vision — then out of the way.
 */
export function DayOpenWelcome({ name }: DayOpenWelcomeProps) {
  const [open, setOpen] = useState(false);
  const [vision, setVision] = useState('');
  const key = useMemo(() => todayKey(), []);
  const opener = OPENERS[bucket()];
  const statement = useMemo(() => getDailyStatement(), []);

  useEffect(() => {
    try {
      if (!localStorage.getItem(key)) setOpen(true);
    } catch {
      /* storage blocked — skip the overlay rather than trapping the user */
    }
    setVision(loadVision());
  }, [key]);

  const dismiss = () => {
    try { localStorage.setItem(key, new Date().toISOString()); } catch {}
    setOpen(false);
  };

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-launch-ink px-5 py-safe"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome to a new day"
        >
          {/* Warm sunrise wash */}
          <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(120%_80%_at_50%_100%,rgba(225,101,27,0.35),transparent_60%),radial-gradient(90%_60%_at_50%_0%,rgba(15,123,123,0.25),transparent_65%)]" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="relative w-full max-w-lg text-center"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-launch-ivory/10 ring-1 ring-launch-gold/40">
              <Sunrise className="h-8 w-8 text-launch-gold" />
            </div>

            <p className="text-[11px] uppercase tracking-[0.22em] text-launch-ivory/60">{today}</p>

            <h1 className="mt-3 text-3xl sm:text-4xl font-semibold leading-tight text-launch-ivory">
              {opener.hello}{name ? `, ${name}` : ''}.
            </h1>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-launch-ivory/80">
              {opener.line}
            </p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-7 text-lg sm:text-xl font-medium text-launch-gold"
            >
              {statement}
            </motion.p>

            {vision && (
              <div className="mt-7 rounded-2xl border border-launch-gold/25 bg-launch-ivory/5 p-4 text-left">
                <div className="mb-1.5 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-launch-ivory/60">
                  <Compass className="h-3.5 w-3.5" />
                  My vision
                </div>
                <p className="text-sm leading-relaxed text-launch-ivory/85">{vision}</p>
              </div>
            )}

            <button
              onClick={dismiss}
              className="mt-9 inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-launch-ember px-6 text-base font-semibold text-launch-ivory shadow-lg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-launch-gold"
            >
              Start my day
              <ArrowRight className="h-5 w-5" />
            </button>

            <p className="mt-4 text-xs text-launch-ivory/45">
              This is a daily welcome, not medical advice.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
