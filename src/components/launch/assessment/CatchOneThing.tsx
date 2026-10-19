import React, { useMemo, useState } from 'react';
import { addDays, format } from 'date-fns';
import { Check, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { buildSlipLine, buildThreeR } from '@/launch/compass/myCompass';
import { placementRule, readControlStyle } from '@/launch/calendar/controlStyle';

const KEPT_KEY = 'myrhythm_first_kept_item_v1';

interface Props { answers: Record<string, unknown> }

/**
 * The report's opening: MyRhythm proves the promise by catching one real thing,
 * placed in the person's own sharp time. Nothing is saved without a tap.
 */
export function CatchOneThing({ answers }: Props) {
  const { user } = useAuth();
  const slip = useMemo(() => buildSlipLine(answers), [answers]);
  const threeR = useMemo(() => buildThreeR(answers), [answers]);
  const [text, setText] = useState('');
  const [kept, setKept] = useState<string | null>(() => {
    try { return localStorage.getItem(KEPT_KEY); } catch { return null; }
  });
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [time, setTime] = useState(slip.keepTime);
  const [savedId, setSavedId] = useState<string | null>(null);
  const rule = placementRule(readControlStyle(user?.id));
  const tomorrow = addDays(new Date(), 1);
  const timeChoices = Array.from(new Set([slip.keepTime, '09:30', '14:00'])).slice(0, 3);

  const keep = async () => {
    const title = text.trim();
    if (!title) return;
    setSaving(true);
    if (user) {
      const { data } = await supabase.from('calendar_events').insert({
        user_id: user.id, title, time, type: 'task',
        description: 'Caught in my first MyRhythm snapshot', date: format(tomorrow, 'yyyy-MM-dd'),
        status: 'pending', source: 'manual', requires_acceptance: false, is_system_generated: false,
        watchers: [], reminder_level: 'steady', reminder_offsets_minutes: [720, 30],
        recurrence_pattern: 'none', recurrence_interval: 1, recurrence_end_date: null,
      } as never).select('id').single();
      setSavedId((data as { id?: string } | null)?.id ?? null);
    }
    try { localStorage.setItem(KEPT_KEY, title); } catch {/* noop */}
    setKept(title);
    setConfirming(false);
    setSaving(false);
  };

  const undo = async () => {
    if (savedId) await supabase.from('calendar_events').delete().eq('id', savedId);
    try { localStorage.removeItem(KEPT_KEY); } catch {/* noop */}
    setSavedId(null); setKept(null);
  };

  const start = () => (rule.confirmFirst ? setConfirming(true) : keep());

  const levelTone = (l: string) => l === 'Strong' ? 'text-launch-teal' : l === 'Building' ? 'text-launch-ink' : 'text-launch-ember';

  return (
    <section aria-labelledby="catch-title" className="px-5 md:px-12 py-8 md:py-10 bg-launch-cream border-b border-launch-gold/30">
      <p className="text-xs uppercase tracking-[0.2em] font-semibold text-launch-ember">Let MyRhythm show me</p>
      <h2 id="catch-title" className="mt-1 font-display text-2xl md:text-3xl text-launch-ink">What can’t I afford to forget this week?</h2>
      <p className="mt-2 text-base text-launch-ink/75">Type one real thing. For example: “Call the surgery about my results” or “Mum’s birthday on Saturday”.</p>

      {!kept ? (
        <Textarea value={text} onChange={(e) => setText(e.target.value)} aria-label="One thing I can’t afford to forget"
          placeholder="One thing on my mind…" className="mt-4 min-h-[88px] text-base" />
      ) : (
        <p className="mt-4 rounded-2xl border-2 border-launch-teal bg-launch-teal/10 p-4 text-lg font-semibold text-launch-ink">
          <Check className="inline h-5 w-5 mr-2 text-launch-teal" />Done. MyRhythm has it: “{kept}”
        </p>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-launch-gold/40 bg-launch-ivory p-5">
          <h3 className="text-lg font-semibold text-launch-ink">What usually happens to it</h3>
          <ol className="mt-3 space-y-3">
            {slip.without.map((p) => (
              <li key={p.when} className="border-l-2 border-launch-ink/20 pl-3">
                <p className="text-sm text-launch-ink/60">{p.when}</p>
                <p className="text-base font-semibold text-launch-ink">{p.text}</p>
              </li>
            ))}
            {slip.innerVoice && (
              <li className="border-l-2 border-launch-ember pl-3">
                <p className="text-sm text-launch-ink/60">And then I tell myself</p>
                <p className="text-base font-bold text-launch-ember">{slip.innerVoice}</p>
              </li>
            )}
          </ol>
        </article>
        <article className="rounded-2xl border-2 border-launch-teal/50 bg-launch-ivory p-5">
          <h3 className="text-lg font-semibold text-launch-ink">The same thing, with MyRhythm</h3>
          <ol className="mt-3 space-y-3">
            {slip.withMyRhythm.map((p) => (
              <li key={p.word} className="border-l-2 border-launch-teal pl-3">
                <p className="text-base font-bold text-launch-teal">{p.word}</p>
                <p className="text-base text-launch-ink">{p.text}</p>
              </li>
            ))}
          </ol>
        </article>
      </div>

      {!kept && !confirming && (
        <Button variant="action" className="mt-5 w-full min-h-[56px] text-base" disabled={!text.trim() || saving} onClick={start}>
          <ShieldCheck />Keep this for me, tomorrow at {slip.keepTime}
        </Button>
      )}
      {!kept && confirming && (
        <div className="mt-5 rounded-2xl border-2 border-launch-teal/50 bg-launch-ivory p-4">
          <p className="text-base font-semibold text-launch-ink">
            {rule.offerTimes ? 'Which time tomorrow works for me?' : `Shall I put it in my day tomorrow at ${time}?`}
          </p>
          {rule.offerTimes && (
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Time tomorrow">
              {timeChoices.map((t) => (
                <Button key={t} type="button" role="radio" aria-checked={time === t} variant="outline" onClick={() => setTime(t)}
                  className={`min-h-[56px] text-base ${time === t ? 'border-launch-teal bg-launch-teal/10 text-launch-ink' : 'border-launch-ink/30 text-launch-ink'}`}>
                  {t}
                </Button>
              ))}
            </div>
          )}
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button variant="action" className="min-h-[56px] flex-1 text-base" disabled={saving} onClick={keep}>Yes, keep it at {time}</Button>
            <Button variant="outline" className="min-h-[56px] flex-1 text-base border-launch-ink/30 text-launch-ink" onClick={() => setConfirming(false)}>Not yet</Button>
          </div>
        </div>
      )}
      {kept && rule.undo && savedId && (
        <Button variant="outline" className="mt-3 min-h-[56px] text-base border-launch-ink/30 text-launch-ink" onClick={undo}>Undo</Button>
      )}

      <h3 className="mt-8 text-lg font-semibold text-launch-ink">My picture right now</h3>
      <ul className="mt-3 grid gap-3 md:grid-cols-3">
        {threeR.map((r) => (
          <li key={r.word} className="rounded-2xl border border-launch-gold/40 bg-launch-ivory p-4">
            <p className="font-display text-xl text-launch-ink">{r.word}</p>
            <p className={`text-sm font-bold ${levelTone(r.level)}`}>{r.level}</p>
            <p className="mt-2 text-base text-launch-ink/80">{r.reason}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-launch-ink/60">These describe everyday patterns from my answers. They are not a test score or a diagnosis.</p>
    </section>
  );
}
