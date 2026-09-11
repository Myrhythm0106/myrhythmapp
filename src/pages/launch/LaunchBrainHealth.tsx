import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchHeroBand } from '@/components/launch/LaunchHeroBand';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { ChevronDown, Loader2, Minus, TrendingDown, TrendingUp, RotateCcw } from 'lucide-react';
import { listAssessmentRuns, type StoredAssessmentRun } from '@/launch/assessment/assessmentHistory';
import { MYRHYTHM_LETTERS, FRAMEWORK_DISCLAIMER } from '@/launch/framework/myrhythm';
import { getAssessmentBank, normalizeAnswer, type LetterId } from '@/data/launchAssessmentBanks';

function readPersona(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('myrhythm_user_type');
  } catch {
    return null;
  }
}

function shortDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso.slice(0, 10);
  }
}

function meaningFor(total: number) {
  if (total >= 75) return 'Strong footing right now. Protect what is working.';
  if (total >= 55) return 'Steady, with a couple of places worth some attention.';
  if (total >= 35) return 'A demanding stretch. Smaller days will serve me better.';
  return 'A heavy season. One thing at a time is the right pace.';
}

/** Simple, honest trend line — no axes, no clutter. */
function TrendLine({ points }: { points: { at: string; total: number }[] }) {
  if (points.length < 2) return null;
  const w = 320;
  const h = 80;
  const xs = points.map((_, i) => (i / (points.length - 1)) * (w - 12) + 6);
  const ys = points.map((p) => h - 8 - (Math.max(0, Math.min(100, p.total)) / 100) * (h - 16));
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24" role="img" aria-label="My scores over time">
      <path d={d} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="#c9a84c" />
      ))}
    </svg>
  );
}

export default function LaunchBrainHealth() {
  const navigate = useNavigate();
  const [runs, setRuns] = useState<StoredAssessmentRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAnswers, setOpenAnswers] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listAssessmentRuns(24)
      .then((r) => active && setRuns(r))
      .catch(() => undefined)
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const bank = useMemo(() => getAssessmentBank(readPersona()), []);
  const latest = runs[0];
  const previous = runs[1];

  const trend = useMemo(
    () =>
      [...runs]
        .reverse()
        .map((r) => ({ at: r.completedAt ?? r.createdAt, total: r.total })),
    [runs]
  );

  return (
    <LaunchLayout>
      <LaunchHeroBand
        eyebrow="Brain health"
        title="How I'm tracking"
        subtitle="My score today, what shaped it, and how it has moved since last time."
      />

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-launch-ink/60">
            <Loader2 className="h-4 w-4 animate-spin" />
            Looking up my snapshots…
          </div>
        )}

        {!loading && !latest && (
          <LaunchCard className="bg-launch-ivory border-launch-gold/30">
            <h3 className="font-semibold text-launch-ink mb-1">No snapshot yet</h3>
            <p className="text-sm text-launch-ink/65 mb-4">
              Eight questions, about three minutes. Once I've done it, my score and how it moves over
              time will live here.
            </p>
            <button
              type="button"
              onClick={() => navigate('/launch/assessment')}
              className="inline-flex items-center gap-2 min-h-[56px] px-5 rounded-full bg-launch-ink text-launch-cream text-sm font-semibold hover:bg-launch-moss transition-colors"
            >
              Take my assessment
            </button>
          </LaunchCard>
        )}

        {latest && (
          <>
            {/* Today's score */}
            <LaunchCard className="bg-launch-ivory border-launch-gold/30">
              <p className="font-hind text-[11px] font-semibold uppercase tracking-[0.28em] text-launch-ink/55">
                My score · {shortDate(latest.completedAt ?? latest.createdAt)}
              </p>
              <div className="flex items-end gap-3 mt-1">
                <span className="font-archivo text-5xl leading-none text-launch-ink">{latest.total}</span>
                <span className="text-sm text-launch-ink/55 pb-1.5">out of 100</span>
                {previous && (
                  <span className="ml-auto inline-flex items-center gap-1 text-sm text-launch-ink/70 pb-1.5">
                    {latest.total > previous.total ? (
                      <TrendingUp className="h-4 w-4 text-launch-moss" />
                    ) : latest.total < previous.total ? (
                      <TrendingDown className="h-4 w-4 text-launch-ember" />
                    ) : (
                      <Minus className="h-4 w-4" />
                    )}
                    {latest.total === previous.total
                      ? 'Held steady'
                      : `${latest.total > previous.total ? '+' : ''}${latest.total - previous.total} since last time`}
                  </span>
                )}
              </div>
              <p className="text-sm text-launch-ink/70 mt-2">{meaningFor(latest.total)}</p>
            </LaunchCard>

            {/* Trend */}
            {trend.length > 1 && (
              <LaunchCard className="bg-launch-ivory border-launch-gold/30">
                <h3 className="font-semibold text-launch-ink mb-2">Every snapshot so far</h3>
                <TrendLine points={trend} />
                <div className="flex justify-between text-xs text-launch-ink/55 mt-1">
                  <span>{shortDate(trend[0].at)}</span>
                  <span>{shortDate(trend[trend.length - 1].at)}</span>
                </div>
              </LaunchCard>
            )}

            {/* Eight letters */}
            <LaunchCard className="bg-launch-ivory border-launch-gold/30">
              <h3 className="font-semibold text-launch-ink mb-3">The eight parts of my rhythm</h3>
              <ul className="space-y-2">
                {MYRHYTHM_LETTERS.map((l) => {
                  const now = latest.scores?.letters?.[l.id as LetterId];
                  const before = previous?.scores?.letters?.[l.id as LetterId];
                  const pct = typeof now === 'number' ? Math.round((now / 3) * 100) : null;
                  const moved =
                    typeof now === 'number' && typeof before === 'number'
                      ? now > before
                        ? 'up'
                        : now < before
                        ? 'down'
                        : 'held'
                      : null;
                  return (
                    <li key={l.id} className="flex items-center gap-3">
                      <span className="w-6 shrink-0 font-archivo text-launch-ember">{l.letter}</span>
                      <span className="w-32 shrink-0 text-sm text-launch-ink truncate">{l.word}</span>
                      <span className="flex-1 h-2 rounded-full bg-launch-cream overflow-hidden">
                        <span
                          className="block h-full rounded-full bg-launch-teal"
                          style={{ width: `${pct ?? 0}%` }}
                        />
                      </span>
                      <span className="w-16 shrink-0 text-right text-xs text-launch-ink/60">
                        {moved === 'up' ? 'up' : moved === 'down' ? 'down' : moved === 'held' ? 'held' : '—'}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="text-xs text-launch-ink/50 mt-3">{FRAMEWORK_DISCLAIMER}</p>
            </LaunchCard>

            {/* Past runs with answers */}
            <LaunchCard className="bg-launch-ivory border-launch-gold/30">
              <h3 className="font-semibold text-launch-ink mb-3">My answers, run by run</h3>
              <ul className="space-y-2">
                {runs.map((run) => {
                  const open = openAnswers === run.id;
                  return (
                    <li key={run.id} className="rounded-2xl border border-launch-gold/30 bg-launch-cream/50">
                      <button
                        type="button"
                        onClick={() => setOpenAnswers(open ? null : run.id)}
                        aria-expanded={open}
                        className="w-full min-h-[56px] flex items-center justify-between gap-3 px-4 text-left"
                      >
                        <span className="text-sm text-launch-ink">
                          {shortDate(run.completedAt ?? run.createdAt)} · score {run.total}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-launch-ink/50 transition-transform ${open ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {open && (
                        <div className="px-4 pb-4 space-y-3">
                          {bank ? (
                            bank.questions.map((q) => {
                              const ans = normalizeAnswer(run.answers?.[q.id]);
                              const label =
                                q.options.find((o) => o.value === ans?.primary)?.label ?? ans?.primary;
                              return (
                                <div key={q.id}>
                                  <p className="text-xs uppercase tracking-wide text-launch-ink/45">{q.word}</p>
                                  <p className="text-sm text-launch-ink/80">{q.title}</p>
                                  <p className="text-sm font-medium text-launch-ink">
                                    {label ?? 'Not answered'}
                                  </p>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-sm text-launch-ink/65">
                              My answers were saved, but I need to know which set of questions I took to
                              show them back. Retaking will fix that.
                            </p>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </LaunchCard>

            <button
              type="button"
              onClick={() => navigate('/launch/assessment')}
              className="inline-flex items-center gap-2 min-h-[56px] px-5 rounded-full bg-launch-ink text-launch-cream text-sm font-semibold hover:bg-launch-moss transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Take it again
            </button>

            <p className="text-xs text-launch-ink/50 pb-8">
              This is a self-check I fill in myself. It is not a diagnosis and it is not a medical test.
            </p>
          </>
        )}
      </div>
    </LaunchLayout>
  );
}
