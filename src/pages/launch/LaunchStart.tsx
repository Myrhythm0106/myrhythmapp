import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, ListChecks, Flag, Users } from 'lucide-react';
import { EditionBadge } from '@/components/launch/EditionBadge';

const STEPS = [
  {
    n: '01',
    Icon: Mic,
    title: 'Record or upload',
    body: 'Speak it, or upload audio you already have. Nothing is lost between the conversation and the plan.',
  },
  {
    n: '02',
    Icon: ListChecks,
    title: 'See actions and decisions',
    body: 'Owners, dates and the exact words they were said in.',
  },
  { n: '03', Icon: Flag, title: 'Milestones keep you on track' },
  { n: '04', Icon: Users, title: 'Loop in your circle' },
] as const;

const rise = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.08 * i, duration: 0.5, ease: 'easeOut' as const },
});

export default function LaunchStart() {
  const navigate = useNavigate();

  return (
    <div className="prestige relative min-h-screen w-full overflow-hidden">
      <div className="prestige-halo pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="prestige-grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-12 px-6 pb-[calc(4rem+env(safe-area-inset-bottom))] pt-[calc(2.5rem+env(safe-area-inset-top))] md:gap-16 md:px-10 md:py-16">
        {/* Brand */}
        <motion.header
          {...rise(0)}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="flex flex-col gap-4">
            <EditionBadge tone="onDark" />
            <h1 className="font-instrument text-5xl leading-[1.05] prestige-ivory md:text-7xl">
              MyRhythm
            </h1>
          </div>
          <p className="font-instrument max-w-sm text-xl italic leading-snug prestige-ivory-75 md:text-2xl">
            Four minutes to see how MyRhythm keeps your plan going after the conversation ends.
          </p>
        </motion.header>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
          {/* Hero tile */}
          <motion.div
            {...rise(1)}
            className="prestige-tile flex flex-col justify-between gap-10 rounded-3xl p-7 md:p-8"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium tracking-widest prestige-gold">{STEPS[0].n}</span>
              <Mic className="h-5 w-5 prestige-ivory-55" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-instrument text-3xl leading-tight prestige-ivory">{STEPS[0].title}</h2>
              <p className="mt-3 text-base leading-relaxed prestige-ivory-75">{STEPS[0].body}</p>
            </div>
          </motion.div>

          {/* Gold hairline: vertical on desktop, horizontal on mobile */}
          <div
            aria-hidden="true"
            className="prestige-rule mx-auto h-px w-2/3 self-center md:h-full md:w-px"
          />

          {/* Right stack */}
          <div className="grid grid-cols-1 gap-4">
            <motion.div
              {...rise(2)}
              className="prestige-tile flex flex-col justify-between gap-6 rounded-3xl p-7 md:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium tracking-widest prestige-gold">{STEPS[1].n}</span>
                <ListChecks className="h-5 w-5 prestige-ivory-55" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-instrument text-2xl leading-tight prestige-ivory md:text-3xl">
                  {STEPS[1].title}
                </h2>
                <p className="mt-2 text-base prestige-ivory-75">{STEPS[1].body}</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {STEPS.slice(2).map((s, i) => (
                <motion.div
                  key={s.n}
                  {...rise(3 + i)}
                  className="prestige-tile flex flex-col justify-between gap-8 rounded-3xl p-7 md:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium tracking-widest prestige-gold">{s.n}</span>
                    <s.Icon className="h-5 w-5 prestige-ivory-55" aria-hidden="true" />
                  </div>
                  <h2 className="font-instrument text-2xl leading-tight prestige-ivory">{s.title}</h2>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <motion.div {...rise(5)} className="flex flex-col items-center gap-10">
          <div className="flex w-full max-w-md flex-col items-center gap-6">
            <button
              onClick={() => navigate('/launch/memory?quick=1')}
              className="prestige-cta font-worksans flex h-14 w-full items-center justify-center gap-2 rounded-full text-lg font-semibold shadow-xl md:h-16"
            >
              <Mic className="h-5 w-5" aria-hidden="true" />
              Start a capture now
            </button>
            <button
              onClick={() => navigate('/launch/home')}
              className="border-b border-transparent pb-1 text-base font-medium prestige-ivory-55 transition-colors hover:border-[#c9a84c] hover:text-[#c9a84c]"
            >
              Open MyRhythm Home
            </button>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] prestige-ivory-40">Secure by design</p>
            <p className="max-w-lg text-sm prestige-ivory-55">
              Private by default · 30-day recording retention · Not a medical device.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
