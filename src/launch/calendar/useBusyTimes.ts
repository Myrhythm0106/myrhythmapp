import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BusySlot {
  title: string;
  date: string;
  time: string | null;
  endTime: string | null;
  allDay: boolean;
}

function toMinutes(hhmm: string | null): number | null {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(':');
  const n = Number(h) * 60 + Number(m ?? 0);
  return Number.isFinite(n) ? n : null;
}

/**
 * Busy times pulled in from a connected calendar (Google, Outlook, or a
 * subscribed link). Used to keep MyRhythm from offering a slot that is
 * already given away — advisory only, never blocking.
 */
export function useBusyTimes(dateISO: string) {
  const [busy, setBusy] = useState<BusySlot[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!userId || !dateISO) return;
      const { data } = await supabase
        .from('external_calendar_events')
        .select('title, date, time, end_time, is_all_day')
        .eq('user_id', userId)
        .eq('date', dateISO);
      if (!active) return;
      setBusy(
        (data ?? []).map((r) => ({
          title: (r.title as string) || 'Something already booked',
          date: r.date as string,
          time: (r.time as string) ?? null,
          endTime: (r.end_time as string) ?? null,
          allDay: !!r.is_all_day,
        }))
      );
    })();
    return () => {
      active = false;
    };
  }, [dateISO]);

  /** Returns the clashing entry's title, or null when the slot is free. */
  function clashAt(time: string, durationMinutes = 60): string | null {
    const start = toMinutes(time);
    if (start === null) return null;
    const end = start + durationMinutes;
    for (const b of busy) {
      if (b.allDay || !b.time) continue;
      const bs = toMinutes(b.time);
      const be = toMinutes(b.endTime) ?? (bs !== null ? bs + 60 : null);
      if (bs === null || be === null) continue;
      if (start < be && end > bs) return b.title;
    }
    return null;
  }

  return { busy, clashAt };
}
