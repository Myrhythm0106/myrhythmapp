import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mapToPersona, type Persona } from '@/launch/persona/usePersona';

const SERIF: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif" };

export default function LaunchWelcome() {
  const navigate = useNavigate();
  const [persona, setPersona] = useState<Persona>('recovery');

  useEffect(() => {
    const direct = localStorage.getItem('myrhythm_user_type');
    let raw: string | null = direct;
    if (!raw) {
      const saved = localStorage.getItem('myrhythm_launch_mode');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          raw = data?.assessmentResults?.userType ?? data?.selectedUserType ?? null;
        } catch { /* noop */ }
      }
    }
    setPersona(mapToPersona(raw));
  }, []);

  const content = getMessage(persona);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1C1917] antialiased">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12 lg:py-20 min-h-screen flex items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-10 gap-10 lg:gap-16 items-center">

          {/* Content (60%) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="md:col-span-6 flex flex-col"
          >
            <header className="mb-10 lg:mb-12">
              <span className="block text-[10px] tracking-[0.3em] uppercase font-medium text-stone-400 mb-6 lg:mb-8">
                Welcome to MyRhythm
              </span>
              <h1
                style={SERIF}
                className="text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-stone-900 mb-6 lg:mb-8"
              >
                {content.headline}
              </h1>
              <div className="max-w-md">
                <p style={SERIF} className="text-lg text-stone-600 leading-relaxed italic">
                  {content.subtitle}
                </p>
                <p className="text-sm text-stone-400 mt-4 tracking-tight">
                  We'll meet you wherever you are in your rhythm.
                </p>
              </div>
            </header>

            <div className="border-t border-stone-200 mb-10 lg:mb-12">
              {content.highlights.map((h, i) => (
                <motion.div
                  key={h}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.08 }}
                  className="flex items-center py-5 lg:py-6 border-b border-stone-100"
                >
                  <span
                    style={SERIF}
                    className="italic text-teal-700 text-xl w-12 shrink-0"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-stone-800 font-medium tracking-tight">{h}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col items-start gap-5">
              <button
                onClick={() => navigate('/launch/home')}
                className="bg-[#0D9488] hover:bg-[#0B7A70] text-white px-10 py-4 font-medium text-sm tracking-[0.12em] transition-colors rounded-[2px] shadow-sm min-h-[56px]"
              >
                LET'S BEGIN
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="text-stone-400 hover:text-stone-600 text-[11px] tracking-[0.18em] uppercase font-medium transition-colors min-h-[44px]"
              >
                Sign in to existing account
              </button>
            </div>

            <p className="text-[10px] text-stone-300 mt-12 max-w-md leading-relaxed">
              MyRhythm does not diagnose, treat, or cure any condition. It is a daily-life support tool that keeps you in control of who can act on your behalf.
            </p>
          </motion.div>

          {/* Visual (40%) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="hidden md:block md:col-span-4 h-full min-h-[520px] relative"
          >
            <div className="absolute inset-0 bg-[#F5F3F0] rounded-sm overflow-hidden flex items-center justify-center">
              <svg
                viewBox="0 0 400 600"
                className="w-full h-full opacity-70 mix-blend-multiply"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="welcome-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0D9488" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#E7E5E4" stopOpacity="0.25" />
                  </linearGradient>
                </defs>
                <circle cx="350" cy="200" r="250" fill="url(#welcome-grad)" />
                <rect x="-50" y="400" width="300" height="300" fill="#EEEAE3" transform="rotate(15 100 550)" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="#E7E5E4" strokeWidth="1" />
                <line x1="200" y1="0" x2="200" y2="600" stroke="#E7E5E4" strokeWidth="1" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border border-stone-300/60 relative flex items-center justify-center">
                  <div className="w-16 h-px bg-stone-300" />
                  <div className="h-16 w-px bg-stone-300 absolute" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-8 bg-[#FDFCFB] p-5 max-w-[200px] border border-stone-100 hidden lg:block">
              <p className="text-[10px] text-stone-400 leading-relaxed uppercase tracking-[0.12em]">
                Clinical-standard care,<br />refined for personal use.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

function getMessage(persona: Persona) {
  switch (persona) {
    case 'recovery':
      return {
        headline: 'Your path forward starts now',
        subtitle: "We've shaped MyRhythm around recovery. Your support circle stays close to everything you do.",
        highlights: [
          'Support circle, front and centre',
          'Memory Bridge for clinical conversations',
          'A gentle path to track real progress',
        ],
      };
    case 'caregiver':
      return {
        headline: "You're not in this alone",
        subtitle: "We'll help you support someone you love, while protecting your own rhythm too.",
        highlights: [
          'Coordinate care without losing your day',
          'Capture appointments accurately, together',
          'Switch between self and supporting view',
        ],
      };
    case 'productivity':
      return {
        headline: 'Clear, defended days',
        subtitle: "We've set MyRhythm up for leverage — vision down to the daily focus block, signal over noise.",
        highlights: [
          'Vision through quarter, week, and day',
          'Protect deep work on the calendar',
          'Capture meetings as a searchable record',
        ],
      };
    case 'student':
      return {
        headline: 'Pace the term well',
        subtitle: "We've set MyRhythm up for study — lectures captured, revision paced, recall protected.",
        highlights: [
          'Study blocks that respect your energy',
          'Capture lectures and revision notes',
          'See which subjects are gaining ground',
        ],
      };
  }
}
