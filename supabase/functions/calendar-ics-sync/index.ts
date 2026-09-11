// Subscribe to any calendar that publishes an ICS feed (Apple/iCloud, Fastmail,
// most work calendars). Read-only: we pull busy times in so MyRhythm stops
// suggesting a slot that is already taken.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

interface ParsedEvent {
  uid: string;
  title: string;
  date: string;
  time: string | null;
  endTime: string | null;
  allDay: boolean;
  location: string | null;
}

function unfold(ics: string): string[] {
  const raw = ics.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  for (const line of raw) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && out.length) {
      out[out.length - 1] += line.slice(1);
    } else {
      out.push(line);
    }
  }
  return out;
}

function parseDt(value: string): { date: string; time: string | null; allDay: boolean } | null {
  const m = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
  if (!m) return null;
  const [, y, mo, d, hh, mm, ss, z] = m;
  if (!hh) return { date: `${y}-${mo}-${d}`, time: null, allDay: true };
  if (z) {
    const utc = new Date(Date.UTC(+y, +mo - 1, +d, +hh, +mm, +(ss ?? '0')));
    return {
      date: utc.toISOString().slice(0, 10),
      time: utc.toISOString().slice(11, 19),
      allDay: false,
    };
  }
  return { date: `${y}-${mo}-${d}`, time: `${hh}:${mm}:${ss ?? '00'}`, allDay: false };
}

function parseIcs(ics: string): ParsedEvent[] {
  const lines = unfold(ics);
  const events: ParsedEvent[] = [];
  let cur: Record<string, string> | null = null;
  for (const line of lines) {
    if (line.startsWith('BEGIN:VEVENT')) cur = {};
    else if (line.startsWith('END:VEVENT')) {
      if (cur) {
        const start = parseDt(cur.DTSTART ?? '');
        if (start) {
          const end = parseDt(cur.DTEND ?? '');
          events.push({
            uid: cur.UID || `${cur.DTSTART}-${cur.SUMMARY ?? ''}`,
            title: (cur.SUMMARY || 'Busy').slice(0, 300),
            date: start.date,
            time: start.time,
            endTime: end?.time ?? null,
            allDay: start.allDay,
            location: cur.LOCATION ? cur.LOCATION.slice(0, 300) : null,
          });
        }
      }
      cur = null;
    } else if (cur) {
      const idx = line.indexOf(':');
      if (idx > 0) {
        const key = line.slice(0, idx).split(';')[0].toUpperCase();
        cur[key] = line.slice(idx + 1).replace(/\\,/g, ',').replace(/\\n/gi, ' ');
      }
    }
  }
  return events;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return json({ error: 'Not signed in' }, 401);

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    const userId = userData?.user?.id;
    if (userErr || !userId) return json({ error: 'Not signed in' }, 401);

    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
    const rawUrl = typeof body.feedUrl === 'string' ? body.feedUrl.trim() : '';

    // Which feeds to sync: a newly supplied one, or every saved ICS feed.
    let targets: { id: string; url: string }[] = [];

    if (rawUrl) {
      const normalised = rawUrl.replace(/^webcal:\/\//i, 'https://');
      let parsed: URL;
      try {
        parsed = new URL(normalised);
      } catch {
        return json({ error: 'That does not look like a calendar link.' }, 400);
      }
      if (parsed.protocol !== 'https:') {
        return json({ error: 'The calendar link needs to start with https:// or webcal://' }, 400);
      }

      const { data: saved, error: saveErr } = await admin
        .from('calendar_integrations')
        .upsert(
          {
            user_id: userId,
            provider: 'ics',
            account_email: parsed.hostname,
            account_name: 'Subscribed calendar',
            is_active: true,
            sync_enabled: true,
            sync_settings: { feed_url: parsed.toString() },
          },
          { onConflict: 'user_id,provider,account_email' },
        )
        .select('id')
        .maybeSingle();

      if (saveErr || !saved) {
        // No unique constraint to upsert on: fall back to a plain insert.
        const { data: inserted, error: insErr } = await admin
          .from('calendar_integrations')
          .insert({
            user_id: userId,
            provider: 'ics',
            account_email: parsed.hostname,
            account_name: 'Subscribed calendar',
            is_active: true,
            sync_enabled: true,
            sync_settings: { feed_url: parsed.toString() },
          })
          .select('id')
          .single();
        if (insErr || !inserted) return json({ error: 'Could not save that calendar.' }, 500);
        targets = [{ id: inserted.id as string, url: parsed.toString() }];
      } else {
        targets = [{ id: saved.id as string, url: parsed.toString() }];
      }
    } else {
      const { data: rows } = await admin
        .from('calendar_integrations')
        .select('id, sync_settings')
        .eq('user_id', userId)
        .eq('provider', 'ics')
        .eq('is_active', true);
      targets = (rows ?? [])
        .map((r) => ({
          id: r.id as string,
          url: (r.sync_settings as Record<string, unknown> | null)?.feed_url as string,
        }))
        .filter((t) => !!t.url);
    }

    if (targets.length === 0) return json({ imported: 0, feeds: 0 });

    let imported = 0;
    const errors: string[] = [];

    for (const target of targets) {
      const res = await fetch(target.url, { headers: { Accept: 'text/calendar' } });
      if (!res.ok) {
        errors.push(`Feed responded ${res.status}`);
        continue;
      }
      const text = await res.text();
      const events = parseIcs(text);

      const horizon = new Date();
      horizon.setDate(horizon.getDate() + 120);
      const from = new Date();
      from.setDate(from.getDate() - 7);

      const rows = events
        .filter((e) => {
          const d = new Date(`${e.date}T00:00:00`);
          return d >= from && d <= horizon;
        })
        .slice(0, 500)
        .map((e) => ({
          user_id: userId,
          integration_id: target.id,
          external_event_id: e.uid,
          title: e.title,
          date: e.date,
          time: e.time,
          end_time: e.endTime,
          location: e.location,
          is_all_day: e.allDay,
          source: 'ics',
          status: 'confirmed',
          last_synced: new Date().toISOString(),
        }));

      if (rows.length) {
        const { error: upErr } = await admin
          .from('external_calendar_events')
          .upsert(rows, { onConflict: 'integration_id,external_event_id' });
        if (upErr) {
          errors.push(upErr.message);
        } else {
          imported += rows.length;
        }
      }

      await admin
        .from('calendar_integrations')
        .update({ last_sync: new Date().toISOString() })
        .eq('id', target.id);
    }

    return json({ imported, feeds: targets.length, errors });
  } catch (err) {
    console.error('calendar-ics-sync failed:', err);
    return json({ error: err instanceof Error ? err.message : 'Unexpected error' }, 500);
  }
});
