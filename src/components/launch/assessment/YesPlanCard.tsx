import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { YES_LETTERS, loadFullPicture } from '@/launch/framework/yes';
import { FULL_PICTURE_LETTERS } from '@/data/launchAssessmentBanks';

function readAnswers(): Record<string, { primary?: string } | undefined> {
  try {
    return JSON.parse(localStorage.getItem('myrhythm_launch_mode') || '{}')?.assessmentResults?.answers ?? {};
  } catch {
    return {};
  }
}

/** What each YES week sets up, based on the person's own answers. */
function weekLines(a: ReturnType<typeof readAnswers>): Record<'Y' | 'E' | 'S', string> {
  const p = (id: string) => a[id]?.primary ?? '';
  const slip = p('memorySlips');
  const y =
    slip === 'appointments' ? 'Reminders the evening before appointments, and again on the day.'
    : slip === 'what-was-said' ? 'Record or type after conversations, so a written note is always there.'
    : slip === 'half-done' ? 'Gentle nudges back to things I started.'
    : slip === 'where-things-are' ? 'Quick notes for where things are, captured in seconds.'
    : 'Simple, well-timed reminders for what matters.';
  const e =
    p('habitSleep') === 'under-6' ? 'One rest habit: a steady wind-down time, and lighter days after poor nights.'
    : p('habitMove') === 'rarely' ? 'One movement habit: a short walk at a time that suits me.'
    : p('habitCalm') === 'spiral' ? 'One calm habit: a short pause before the busiest part of my day.'
    : 'One energy habit I choose, with breaks that suit my pace.';
  const best = p('planningRhythm');
  const s = best && best !== 'varies'
    ? `My most important tasks planned for the ${best}, with lighter times when my energy dips.`
    : 'My calendar learns my best times gently, with lighter times when energy dips.';
  return { Y: y, E: e, S: s };
}

export function YesPlanCard() {
  const navigate = useNavigate();
  const answers = readAnswers();
  if (!answers.memorySlips && !answers.habitSleep) return null;
  const lines = weekLines(answers);
  const done = loadFullPicture().completedLetters.length;
  const total = FULL_PICTURE_LETTERS.length;

  return (
    <section className="p-8 md:p-10 border-b border-launch-ink/5 bg-launch-ivory">
      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-launch-gold mb-2">My first 3 weeks</p>
      <h2 className="text-2xl font-display font-bold text-launch-ink mb-1">My YES plan</h2>
      <p className="text-sm text-launch-ink/65 mb-5">Set up from my own answers. I can change any part.</p>
      <ol className="space-y-3 mb-6">
        {YES_LETTERS.map((l) => (
          <li key={l.id} className="flex items-start gap-3 rounded-2xl border border-launch-gold/30 bg-launch-cream p-4">
            <span className="w-10 h-10 rounded-full bg-launch-teal text-white flex items-center justify-center font-bold flex-shrink-0">{l.id}</span>
            <div>
              <p className="font-semibold text-launch-ink">Week {l.week} · {l.word}</p>
              <p className="text-sm text-launch-ink/75 mt-0.5">{lines[l.id]}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => navigate('/launch/home')}
          className="inline-flex items-center justify-center gap-2 min-h-[56px] px-6 rounded-full bg-launch-ember text-white font-semibold"
        >
          Start week 1 <ArrowRight className="h-4 w-4" />
        </button>
        {done < total && (
          <button
            type="button"
            onClick={() => navigate('/launch/assessment?mode=full')}
            className="inline-flex items-center justify-center min-h-[56px] px-6 rounded-full border border-launch-gold/50 text-launch-ink font-semibold"
          >
            {done > 0 ? `Continue my full picture (${done} of ${total})` : 'Do my full picture now · about 15 min'}
          </button>
        )}
      </div>
      <p className="text-xs text-launch-ink/55 mt-4">
        Otherwise, a 2-minute check-in for one MYRHYTHM letter appears on Home every few days, so my full picture is ready by the end of week 3.
      </p>
    </section>
  );
}
