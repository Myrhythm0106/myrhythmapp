import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { FULL_PICTURE_LETTERS } from '@/data/launchAssessmentBanks';
import { isCheckInDue, loadFullPicture, snoozeFullPicture } from '@/launch/framework/yes';

/** Gentle 2-minute MYRHYTHM check-in, one letter every few days. */
export function HomeFullPictureCard() {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);
  let hasSnapshot = false;
  try {
    hasSnapshot = !!JSON.parse(localStorage.getItem('myrhythm_launch_mode') || '{}')?.assessmentResults;
  } catch {/* noop */}
  const state = loadFullPicture();
  const next = FULL_PICTURE_LETTERS.find((l) => !state.completedLetters.includes(l.slot));
  if (hidden || !hasSnapshot || !next || !isCheckInDue(state)) return null;
  const done = state.completedLetters.length;

  return (
    <div className="rounded-3xl bg-launch-ivory border border-launch-gold/30 p-5">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-4 w-4 text-launch-gold" />
        <h3 className="font-semibold text-launch-ink">2-minute check-in: {next.word}</h3>
      </div>
      <p className="text-sm text-launch-ink/65 mb-4">
        My full MYRHYTHM picture · {done} of {FULL_PICTURE_LETTERS.length} done. Each one makes my plan a little smarter.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigate('/launch/assessment?mode=full')}
          className="min-h-[56px] px-5 rounded-full bg-launch-teal text-white text-sm font-semibold"
        >
          Start check-in
        </button>
        <button
          type="button"
          onClick={() => { snoozeFullPicture(2); setHidden(true); }}
          className="min-h-[56px] px-5 rounded-full border border-launch-gold/40 text-launch-ink text-sm font-semibold"
        >
          Not today
        </button>
      </div>
    </div>
  );
}
