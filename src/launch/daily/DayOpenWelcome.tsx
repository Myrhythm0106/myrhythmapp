import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { getDailyStatement } from '@/data/iChooseStatements';
import { useLaunchCalendarEvents } from '@/hooks/useLaunchCalendarEvents';
import { cn } from '@/lib/utils';
import watercolourBrain from '@/assets/watercolour-brain.png';

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

/** A quiet, collapsed row that reveals its content in place when tapped. */
function RevealRow({
  label,
  summary,
  children,
}: {
  label: string;
  summary?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t day-open-hair">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex min-h-[56px] w-full items-center justify-between gap-4 py-3 text-left"
      >
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <span className="font-hind text-[13px] font-semibold uppercase tracking-[0.18em] day-open-ivory-80">
            {label}
          </span>
          {summary && (
            <span className="font-hind text-sm day-open-ivory-60">{summary}</span>
          )}
        </span>
        <ChevronDown
          className={cn('h-5 w-5 shrink-0 transition-transform duration-300 day-open-ivory-60', open && 'rotate-180')}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * The first screen of the day. Ink ground, one teal signal, one decision.
 * Everything beyond the opening beat stays folded away until asked for.
 */
export function DayOpenWelcome({ name }: DayOpenWelcomeProps) {
  const [open, setOpen] = useState(false);
  const [vision, setVision] = useState('');
  const key = useMemo(() => todayKey(), []);
  const opener = OPENERS[bucket()];
  const statement = useMemo(() => getDailyStatement(), []);
  const today = useMemo(() => new Date(), []);
  const { events } = useLaunchCalendarEvents(today, today);

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

  const pending = useMemo(
    () => (events ?? [])
      .filter((e) => e.status === 'pending')
      .sort((a, b) => (a.time || '').localeCompare(b.time || '')),
    [events]
  );

  const shapeSummary = pending.length
    ? `${pending.length} ${pending.length === 1 ? 'commitment' : 'commitments'}${pending[0]?.time ? ` · first at ${pending[0].time}` : ''}`
    : 'Nothing scheduled — the day is open';

  const dateLine = new Date()
    .toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })
    .toUpperCase();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.55, ease: 'easeOut' as const },
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="day-open fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto px-6 py-12"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome to a new day"
        >
          <div className="day-open-wash pointer-events-none absolute inset-0" />

          <div className="relative grid w-full max-w-5xl grid-cols-1 items-center gap-8 lg:grid-cols-[3fr_2fr] lg:gap-14">
            {/* Artwork — right on desktop, above the words on mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.9, ease: 'easeOut' }}
              className="relative order-first mx-auto flex w-full max-w-[220px] items-center justify-center lg:order-last lg:max-w-none"
            >
              <div className="day-open-glow pointer-events-none absolute inset-[-18%]" />
              <motion.img
                src={watercolourBrain}
                alt=""
                aria-hidden="true"
                width={1024}
                height={1024}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-full object-contain"
              />
            </motion.div>

            {/* Words */}
            <div className="text-left">
              <motion.div {...rise(0.1)}>
                <p className="font-hind text-[11px] font-semibold uppercase tracking-[0.32em] day-open-ivory-60">
                  {dateLine} · {bucket()}
                </p>
                <div className="mt-3 h-px w-full border-t day-open-hair" />
              </motion.div>

              <motion.h1
                {...rise(0.16)}
                className="font-archivo mt-6 text-4xl uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl day-open-ivory"
              >
                {opener.hello}{name ? `, ${name}` : ''}.
              </motion.h1>

              <motion.p
                {...rise(0.22)}
                className="font-hind mt-5 max-w-xl text-base leading-relaxed sm:text-lg day-open-ivory-80"
              >
                {opener.line}
              </motion.p>

              <motion.div {...rise(0.28)} className="mt-8 flex gap-4">
                <span className="day-open-rule w-[3px] shrink-0 rounded-full" aria-hidden="true" />
                <p className="font-hind text-lg font-medium leading-snug sm:text-xl day-open-ivory">
                  {statement}
                </p>
              </motion.div>

              <motion.div {...rise(0.34)} className="mt-9">
                {vision && (
                  <RevealRow label="My vision">
                    <p className="font-hind text-base leading-relaxed day-open-ivory-80">{vision}</p>
                  </RevealRow>
                )}

                <RevealRow label="Today's shape" summary={shapeSummary}>
                  {pending.length ? (
                    <ul className="space-y-2">
                      {pending.slice(0, 6).map((e) => (
                        <li key={e.id} className="flex items-baseline justify-between gap-4">
                          <span className="font-hind text-base day-open-ivory-80">{e.title}</span>
                          <span className="font-hind text-sm tabular-nums day-open-ivory-60">{e.time}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-hind text-base day-open-ivory-80">
                      One small thing is enough. I can plan it after this.
                    </p>
                  )}
                </RevealRow>
                <div className="border-t day-open-hair" />
              </motion.div>

              <motion.button
                {...rise(0.4)}
                onClick={dismiss}
                className="font-hind day-open-cta mt-8 inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl px-6 text-base font-semibold shadow-lg transition"
              >
                Start my day
                <ArrowRight className="h-5 w-5" />
              </motion.button>

              <motion.p {...rise(0.46)} className="font-hind mt-4 text-xs day-open-ivory-45">
                This is a daily welcome, not medical advice.
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
