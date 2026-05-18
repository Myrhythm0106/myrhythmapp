import React from 'react';
import { motion } from 'framer-motion';
import { useDemoOrLive } from '@/contexts/DemoModeContext';
import { IChooseHeart } from './IChooseHeart';
import { useStage } from '@/launch/stage/useStage';
import { usePersona } from '@/launch/persona/usePersona';
import { useSubject } from '@/launch/persona/SubjectContext';

function timeBucket(): 'morning' | 'afternoon' | 'evening' {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

const GREETINGS = {
  morning: 'Good morning',
  afternoon: 'Good afternoon',
  evening: 'Good evening',
};

/**
 * Minimal home variant rendered when the active stage is Pause.
 * No scaffolds, no wins, no composer, no capture prompts.
 * Just acknowledgement, the #IChoose heart, and a quiet way out when ready.
 */
export function QuietHomePause() {
  const { fixtures } = useDemoOrLive();
  const { setStage } = useStage();
  const { persona, isCaregiver } = usePersona();
  const { subject, supportedName } = useSubject();

  const effectivePersona = isCaregiver && subject === 'supporting' ? 'recovery' : persona;
  const name = isCaregiver && subject === 'supporting' ? supportedName : fixtures.name;
  const greeting = GREETINGS[timeBucket()];

  const restLine = (() => {
    switch (effectivePersona) {
      case 'recovery': return 'Today, the only thing is rest.';
      case 'caregiver': return 'Today, the system can wait. Breathe.';
      case 'productivity': return 'Today, no plans. A real pause.';
      case 'student': return 'Today, a genuine break. Nothing else.';
      default: return 'Today, the only thing is rest.';
    }
  })();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <p className="text-sm text-brain-health-600">{greeting}, {name}.</p>
        <span className="inline-block text-[11px] px-2 py-1 rounded-full bg-white/70 border border-brain-health-100 text-brain-health-600">
          Pause
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center text-lg md:text-xl text-brain-health-800 leading-relaxed max-w-md mx-auto"
      >
        {restLine}
      </motion.p>

      <IChooseHeart />

      <div className="text-center pt-6">
        <button
          type="button"
          onClick={() => setStage('ready')}
          className="text-xs text-brain-health-500 hover:text-brain-health-800 underline-offset-4 hover:underline transition-colors min-h-[44px] px-3"
        >
          When you're ready, move to Ready
        </button>
      </div>

      <p className="text-center text-[11px] text-brain-health-400 pt-4 pb-8 max-w-sm mx-auto leading-relaxed">
        MyRhythm supports daily structure and reflection. It does not diagnose, treat, or replace clinical care.
      </p>
    </div>
  );
}
