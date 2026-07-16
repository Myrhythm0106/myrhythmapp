import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mapToPersona, type Persona } from '@/launch/persona/usePersona';
import { EditionBadge } from '@/components/launch/EditionBadge';
import { MemoryFirstChip } from '@/components/launch/MemoryFirstChip';
import { MEMORY_FIRST_DESIGN_TAGLINE } from '@/config/appDescription';
import { LaunchPageHeader } from '@/components/launch/LaunchPageHeader';
import { LaunchQuickActions } from '@/components/launch/LaunchQuickActions';
import { MyRhythmLetterBar } from '@/components/launch/MyRhythmLetterBar';
import { foundingMemberConfig, isFoundingMemberActive } from '@/config/pricing';
import type { LetterId } from '@/data/launchAssessmentBanks';


// Emerald Prestige palette — page-scoped
const INK = '#064e3b';      // deep emerald
const MOSS = '#0d7a5f';     // mid emerald
const GOLD = '#c9a84c';     // warm gold
const CREAM = '#f5f0e0';    // cream

const SORA: React.CSSProperties = { fontFamily: "'Sora', sans-serif" };
const MANROPE: React.CSSProperties = { fontFamily: "'Manrope', sans-serif" };

interface BHSnapshot {
  total: number;
  letters: Record<string, number>;
}

const LETTER_ORDER: Array<{ id: LetterId; letter: string }> = [
  { id: 'mindset', letter: 'M' },
  { id: 'yesReality', letter: 'Y' },
  { id: 'rhythm', letter: 'R' },
  { id: 'harnessSupport', letter: 'H' },
  { id: 'yourVictories', letter: 'Y' },
  { id: 'transform', letter: 'T' },
  { id: 'heal', letter: 'H' },
  { id: 'multiply', letter: 'M' },
];

export default function LaunchWelcome() {
  const navigate = useNavigate();
  const [persona, setPersona] = useState<Persona>('recovery');
  const [bhs, setBhs] = useState<BHSnapshot | null>(null);
  const [displayTotal, setDisplayTotal] = useState(0);

  useEffect(() => {
    const direct = localStorage.getItem('myrhythm_user_type');
    let raw: string | null = direct;
    const saved = localStorage.getItem('myrhythm_launch_mode');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (!raw) raw = data?.assessmentResults?.userType ?? data?.selectedUserType ?? null;
        const score = data?.brainHealthScore ?? data?.assessmentResults?.brainHealthScore;
        if (score && typeof score.total === 'number') {
          setBhs({ total: score.total, letters: score.letters || {} });
        }
      } catch { /* noop */ }
    }
    setPersona(mapToPersona(raw));
  }, []);

  // Tick the /100 number up from 0
  useEffect(() => {
    if (!bhs) return;
    const target = bhs.total;
    const start = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayTotal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bhs]);

  const content = getMessage(persona);

  return (
    <div className="min-h-screen w-full antialiased" style={{ backgroundColor: CREAM, color: INK, ...MANROPE }}>
      {/* Font links */}
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-4">
        <LaunchPageHeader fallbackPath="/launch/assessment" />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full bg-white shadow-2xl border border-[#064e3b]/10 flex flex-col overflow-hidden"
        >
          {/* Chip row */}
          <div className="p-6 flex flex-wrap gap-3 items-center bg-[#f5f0e0]/50 border-b border-[#064e3b]/5">
            <span className="px-3 py-1 text-[10px] tracking-[0.2em] font-bold uppercase border border-[#064e3b] text-[#064e3b]">
              Welcome to MyRhythm
            </span>
            <EditionBadge variant="chip" />
            <MemoryFirstChip />
          </div>

          {/* Hero Snapshot — DARK */}
          <div className="relative overflow-hidden p-8 md:p-12" style={{ backgroundColor: INK }}>
            {/* Topographic contour lines */}
            <svg
              className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
              viewBox="0 0 800 400"
              fill="none"
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              <path d="M-50 320C100 270 200 370 400 320C600 270 700 370 850 320" stroke={GOLD} strokeWidth="2" />
              <path d="M-50 260C100 210 200 310 400 260C600 210 700 310 850 260" stroke={GOLD} strokeWidth="1.5" />
              <path d="M-50 200C100 150 200 250 400 200C600 150 700 250 850 200" stroke={GOLD} strokeWidth="1" />
              <path d="M-50 140C100 90 200 190 400 140C600 90 700 190 850 140" stroke={GOLD} strokeWidth="0.75" />
              <path d="M-50 80C100 30 200 130 400 80C600 30 700 130 850 80" stroke={GOLD} strokeWidth="0.5" />
            </svg>

            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="md:max-w-xs">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-3" style={{ color: GOLD }}>
                  Your starting MYRHYTHM snapshot
                </p>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-7xl md:text-8xl font-extrabold tracking-tighter leading-none"
                    style={{ ...SORA, color: CREAM }}
                  >
                    {bhs ? displayTotal : '—'}
                  </span>
                  <span className="text-2xl font-light" style={{ color: `${CREAM}66` }}>
                    /100
                  </span>
                </div>
                <p className="mt-4 text-xs leading-relaxed" style={{ color: `${CREAM}99` }}>
                  Tap any letter for what it means and how to raise it.
                </p>
              </div>

              {/* Letter bars */}
              {bhs && (
                <div className="flex-1 grid grid-cols-8 gap-2 md:gap-3 h-48 md:h-56 items-end">
                  {LETTER_ORDER.map((l, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                      className="h-full flex"
                    >
                      <MyRhythmLetterBar
                        id={l.id}
                        letter={l.letter}
                        score={bhs.letters[l.id] ?? 0}
                        tone="dark"
                        height="h-full"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <p
              className="relative z-10 mt-10 text-[10px] uppercase tracking-widest pt-6 border-t italic"
              style={{ color: `${CREAM}55`, borderColor: `${CREAM}1a` }}
            >
              A snapshot only — not a clinical score. We'll track how this shifts as you build your rhythm.
            </p>
          </div>

          {/* Main body — magazine two-column */}
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Left: message + CTA */}
            <div className="md:col-span-7 p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#064e3b]/5">
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-3xl md:text-4xl font-bold leading-tight mb-6 uppercase"
                style={{ ...SORA, color: INK }}
              >
                {content.headline}
              </motion.h1>
              <p className="text-lg leading-relaxed italic mb-8" style={{ color: MOSS }}>
                {content.subtitle}
              </p>
              <p className="text-[11px] uppercase tracking-[0.2em] font-bold mb-10" style={{ color: `${INK}80` }}>
                We'll meet you wherever you are in your rhythm.
              </p>

              <div className="flex flex-col gap-4 max-w-sm">
                <button
                  onClick={() => navigate('/launch/payment')}
                  className="w-full py-5 px-8 font-bold text-xs tracking-[0.3em] uppercase transition-all cursor-pointer shadow-lg min-h-[56px]"
                  style={{ backgroundColor: INK, color: CREAM, ...SORA }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = MOSS)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = INK)}
                >
                  Continue
                </button>
                <button
                  onClick={() => navigate('/launch/signin')}
                  className="text-center text-[10px] uppercase tracking-[0.2em] font-bold transition-colors min-h-[44px] hover:text-[#064e3b]"
                  style={{ color: `${INK}66` }}
                >
                  Sign in to existing account
                </button>
              </div>
            </div>

            {/* Right: numbered highlights */}
            <div className="md:col-span-5 p-8 md:p-12" style={{ backgroundColor: `${CREAM}4d` }}>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8" style={{ color: GOLD }}>
                Shaped for you
              </p>
              <div className="space-y-10">
                {content.highlights.map((h, i) => (
                  <motion.div
                    key={h}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    className="flex gap-6"
                  >
                    <span className="text-sm font-bold pt-1 shrink-0" style={{ ...SORA, color: GOLD }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p
                      className="text-sm font-semibold leading-relaxed tracking-tight"
                      style={{
                        color: INK,
                        textDecoration: 'underline',
                        textDecorationColor: `${GOLD}33`,
                        textUnderlineOffset: '8px',
                      }}
                    >
                      {h}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer strip */}
          <div className="px-8 md:px-12 py-8 bg-white border-t border-[#064e3b]/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <p
                className="text-[10px] uppercase tracking-[0.15em] max-w-xl leading-loose"
                style={{ color: `${INK}66` }}
              >
                MyRhythm does not diagnose, treat, or cure any condition. It is a daily-life support tool that keeps
                you in control of who can act on your behalf.
              </p>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap"
                style={{ color: GOLD }}
              >
                {MEMORY_FIRST_DESIGN_TAGLINE}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <LaunchQuickActions />
    </div>
  );
}

function getMessage(persona: Persona) {
  switch (persona) {
    case 'recovery':
      return {
        headline: 'Your path forward starts now',
        subtitle:
          "We've shaped MyRhythm around Pathfinders — people rebuilding cognitive ground after a neurological event. Your support circle stays close to everything you do.",
        highlights: [
          'Support circle, front and centre',
          'Memory Bridge for clinical conversations',
          'A steady path to track real progress',
        ],
      };
    case 'caregiver':
      return {
        headline: "You're not in this alone",
        subtitle:
          "We've shaped MyRhythm around Anchors — the people who hold the line for someone else, while protecting their own rhythm too.",
        highlights: [
          'Coordinate care without losing your day',
          'Capture appointments accurately, together',
          'Switch between self and supporting view',
        ],
      };
    case 'productivity':
      return {
        headline: 'Clear, defended days',
        subtitle:
          "We've shaped MyRhythm around Operators — high-output professionals protecting their best thinking. Vision down to the daily focus block, signal over noise.",
        highlights: [
          'Vision through quarter, week, and day',
          'Protect deep work on the calendar',
          'Capture meetings as a searchable record',
        ],
      };
    case 'student':
      return {
        headline: 'Pace the term well',
        subtitle:
          "We've shaped MyRhythm around Scholars — pacing study toward recall, not burnout. Lectures captured, revision paced.",
        highlights: [
          'Study blocks that respect your energy',
          'Capture lectures and revision notes',
          'See which subjects are gaining ground',
        ],
      };
  }
}
