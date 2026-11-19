import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { savedPeakHours } from '@/launch/scheduling/suggestSlots';

type Tile = { label: string; value: string; hint: string; to: string };

/** Three quiet figures. A figure only shows when it has something to say. */
export function HomeAtAGlance({ doneToday }: { doneToday: number }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [waiting, setWaiting] = useState<number | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('extracted_actions').select('id', { count: 'exact', head: true })
      .eq('user_id', user.id).is('calendar_event_id', null).not('status', 'in', '(done,completed,declined,dismissed)')
      .then(({ count }) => setWaiting(count ?? 0));
  }, [user?.id]);

  const peaks = savedPeakHours(user?.id);
  const tiles: Tile[] = [];
  if (waiting) tiles.push({ label: 'Promises I made', value: String(waiting), hint: 'Steps from my conversations waiting for a time', to: '/launch/commit' });
  if (doneToday > 0) tiles.push({ label: 'Done today', value: String(doneToday), hint: 'People can count on me', to: '/launch/calendar?view=day' });
  tiles.push({
    label: 'My best focus time',
    value: peaks ? `${peaks[0]}–${peaks[peaks.length - 1]}` : '09:00–12:00',
    hint: peaks ? 'From my answers. New steps go here first' : 'A starting guess. I can tune it in my questions',
    to: peaks ? '/launch/calendar' : '/launch/assessment',
  });

  return (
    <section aria-label="At a glance" className="grid gap-3 sm:grid-cols-3">
      {tiles.slice(0, 3).map(t => (
        <button key={t.label} type="button" onClick={() => navigate(t.to)}
          className="exec-card group min-h-[120px] rounded-3xl p-5 text-left transition hover:-translate-y-0.5">
          <p className="font-worksans text-[11px] font-semibold uppercase tracking-[0.22em] text-launch-moss">{t.label}</p>
          <p className="mt-2 font-instrument text-4xl leading-none text-launch-ink tabular-nums">{t.value}</p>
          <p className="mt-2 text-sm text-launch-ink/65">{t.hint}</p>
        </button>
      ))}
    </section>
  );
}
