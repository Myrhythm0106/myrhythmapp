import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Users, CalendarCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EditionBadge } from './EditionBadge';
import { FeedbackDialog } from './FeedbackDialog';

const STORAGE_KEY = 'mr:first-run-done';

const steps = [
  {
    icon: Mic,
    title: 'Capture your first moment',
    body: 'A meeting, a thought, anything. MyRhythm turns voice into searchable notes and follow-ups.',
    cta: 'Open Memory Bridge',
    path: '/launch/memory',
  },
  {
    icon: Users,
    title: 'Add one Anchor',
    body: 'Invite a trusted person to your Support Circle. You choose exactly what they can see.',
    cta: 'Invite someone',
    path: '/launch/support',
  },
  {
    icon: CalendarCheck,
    title: 'See your day take shape',
    body: 'Your dashboard adapts to your energy and rhythm. Come back any time to plan or pause.',
    cta: 'Got it',
    path: null,
  },
];

export function FirstRunOverlay() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEY)) {
      // small delay so the dashboard mounts first
      const t = setTimeout(() => setOpen(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={dismiss}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-[#FDFCFB] rounded-2xl shadow-2xl p-6 md:p-10"
        >
          <button
            onClick={dismiss}
            aria-label="Dismiss first-run guide"
            className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-500"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400">
                Your first 3 minutes
              </p>
              <EditionBadge variant="chip" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-stone-900">
              Three things and you're set
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {steps.map((s) => (
              <div
                key={s.title}
                className="rounded-xl border border-stone-200 bg-white p-5 flex flex-col"
              >
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-stone-900 mb-1">{s.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed flex-1">{s.body}</p>
                <button
                  onClick={() => {
                    if (s.path) {
                      dismiss();
                      navigate(s.path);
                    } else {
                      dismiss();
                    }
                  }}
                  className="mt-4 text-sm font-medium text-teal-700 hover:text-teal-800 text-left"
                >
                  {s.cta} →
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={dismiss}
              className="text-xs text-stone-400 hover:text-stone-600 tracking-[0.15em] uppercase min-h-[44px]"
            >
              Skip — I'll explore on my own
            </button>
            <button
              onClick={() => setFeedbackOpen(true)}
              className="text-xs text-teal-700 hover:text-teal-800 tracking-[0.15em] uppercase font-medium min-h-[44px]"
            >
              Tell us how this felt →
            </button>
          </div>
        </motion.div>
      </motion.div>
      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </AnimatePresence>
  );
}
