import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CheckCircle2, Users, Send, X, Flame, BellRing } from 'lucide-react';
import { LaunchButton } from './LaunchButton';
import confetti from 'canvas-confetti';

interface CompletionCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  actionTitle: string;
  onNotifySupport?: (note?: string) => void;
  streakCount?: number;
  isPersonalBest?: boolean;
  /** How many circle members were already told automatically. */
  notifiedCount?: number;
  /** Total finished in the last 7 days, used for the milestone line. */
  doneThisWeek?: number;
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

/** A warmer line for the moments that deserve one — not every single tick. */
function milestoneLine(streakCount?: number, doneThisWeek?: number): string | null {
  if (doneThisWeek === 1) return 'That is the first one this week. The rest gets easier from here.';
  if (doneThisWeek && doneThisWeek % 10 === 0) return `${doneThisWeek} finished this week. That is real follow-through.`;
  if (doneThisWeek && doneThisWeek % 5 === 0) return `${doneThisWeek} finished this week. Momentum is building.`;
  if (streakCount && streakCount % 7 === 0) return `${streakCount} days in a row. Steady wins this.`;
  return null;
}

export function CompletionCelebration({
  isOpen,
  onClose,
  actionTitle,
  onNotifySupport,
  streakCount,
  isPersonalBest,
  notifiedCount = 0,
  doneThisWeek
}: CompletionCelebrationProps) {
  const [note, setNote] = useState('');
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setNote('');
      setNotified(false);
      return;
    }
    if (prefersReducedMotion()) return;

    const isMilestone = Boolean(milestoneLine(streakCount, doneThisWeek));
    confetti({
      particleCount: isMilestone ? 120 : 50,
      spread: isMilestone ? 80 : 55,
      origin: { y: 0.6 }
    });
  }, [isOpen, streakCount, doneThisWeek]);

  const handleNotify = () => {
    onNotifySupport?.(note);
    setNotified(true);
  };

  const milestone = milestoneLine(streakCount, doneThisWeek);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-3xl border-0 bg-gradient-to-br from-brand-emerald-50 to-amber-50 p-0 overflow-hidden">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>

        <div className="text-center p-8">
          {/* Celebration Icon */}
          <div className="w-16 h-16 mx-auto mb-4 bg-memory-emerald-100 rounded-2xl flex items-center justify-center ring-1 ring-memory-emerald-200">
            <CheckCircle2 className="h-8 w-8 text-memory-emerald-700" strokeWidth={1.75} />
          </div>

          {/* Main Message */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Well executed.
          </h2>
          
          <p className="text-gray-600 mb-4">
            I completed: <span className="font-semibold text-brand-emerald-700">{actionTitle}</span>
          </p>

          {milestone && (
            <p className="text-sm text-brand-emerald-700 mb-4">{milestone}</p>
          )}

          {/* Streak Info */}
          {streakCount && streakCount > 1 && (
            <div className="inline-flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 mb-4 border border-brand-orange-100">
              <Flame className="h-4 w-4 text-brand-orange-600" strokeWidth={1.75} />
              <span className="font-semibold text-brand-orange-700 tabular-nums">{streakCount}-day streak</span>
              {isPersonalBest && (
                <span className="text-[10px] uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  Personal best
                </span>
              )}
            </div>
          )}

          {/* Who already knows */}
          {notifiedCount > 0 && (
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2 mb-2">
              <BellRing className="h-4 w-4" strokeWidth={1.75} />
              {notifiedCount === 1
                ? '1 person from my circle has been told.'
                : `${notifiedCount} people from my circle have been told.`}
            </p>
          )}

          {/* Notify Support Circle */}
          {onNotifySupport && !notified && (
            <div className="mt-6 space-y-3">
              <p className="text-sm text-gray-500">
                Add a personal note for my support circle?
              </p>
              
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a personal note (optional)"
                className="w-full p-3 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-emerald-500"
                rows={2}
              />
              
              <LaunchButton 
                onClick={handleNotify}
                className="w-full"
              >
                <Users className="h-5 w-5" />
                Share with Support Circle
              </LaunchButton>
            </div>
          )}

          {notified && (
            <div className="mt-6 p-4 bg-brand-emerald-100 rounded-xl">
              <p className="text-brand-emerald-700 font-medium flex items-center justify-center gap-2">
                <Send className="h-4 w-4" />
                My support circle has been notified.
              </p>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="mt-6 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
