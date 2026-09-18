// A private, read-only calendar feed. Paste the link once into Google,
// Outlook or Apple Calendar and every dated MyRhythm step shows up there and
// keeps itself up to date. No sign-in, no account linking.
//
// Public on purpose (verify_jwt = false): calendar apps cannot send a bearer
// token. The opaque per-user token in the query string is the only key, and it
// can be regenerated from Settings at any time.

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const HORIZON_DAYS = 180;
const LOOKBACK_DAYS = 30;

function esc(text: string): string {
  return String(text ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function fold(line: string): string {
  if (line.length <= 73) return line;
  const out: string[] = [line.slice(0, 73)];
  let rest = line.slice(73);
  while (rest.length) {
    out.push(" " + rest.slice(0, 72));
    rest = rest.slice(72);
  }
  return out.join("\r\n");
}

function stamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/** Wall-clock date/time treated as UTC — calendars re-render in the viewer's zone. */
function instant(date: string, time?: string | null): Date {
  const [y, m, d] = (date || "").split("-").map(Number);
  const [hh, mm] = (time || "09:00").slice(0, 5).split(":").map(Number);
  return new Date(Date.UTC(y || 1970, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0));
}

function dayStamp(d: Date): string {
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

interface FeedItem {
  uid: string;
  title: string;
  date: string;
  time?: string | null;
  durationMinutes?: number;
  description?: string;
  allDay?: boolean;
}

function vevent(item: FeedItem): string[] {
  const lines = [
    "BEGIN:VEVENT",
    `UID:${item.uid}@myrhythmapp.com`,
    `DTSTAMP:${stamp(new Date())}`,
  ];

  if (item.allDay || !item.time) {
    const start = instant(item.date, "00:00");
    const end = new Date(start.getTime() + 86_400_000);
    lines.push(
      `DTSTART;VALUE=DATE:${dayStamp(start)}`,
      `DTEND;VALUE=DATE:${dayStamp(end)}`,
    );
  } else {
    const start = instant(item.date, item.time);
    const end = new Date(start.getTime() + (item.durationMinutes || 30) * 60_000);
    lines.push(`DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`);
  }

  lines.push(
    `SUMMARY:${esc(String(item.title || "MyRhythm step").slice(0, 180))}`,
    `DESCRIPTION:${esc(item.description || "From MyRhythm.")}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
  );
  return lines;
}

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const token = (url.searchParams.get("token") || "").trim();

    if (!token || token.length < 20) {
      return new Response("Calendar link is missing or incomplete.", { status: 400 });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { data: feed, error: feedError } = await admin
      .from("calendar_feed_tokens")
      .select("user_id, revoked_at")
      .eq("token", token)
      .maybeSingle();

    if (feedError) {
      console.error("calendar-feed token lookup failed:", feedError);
      return new Response("Could not read this calendar link.", { status: 500 });
    }
    if (!feed || feed.revoked_at) {
      return new Response("This calendar link is no longer active.", { status: 404 });
    }

    const userId = feed.user_id as string;
    const from = new Date(Date.now() - LOOKBACK_DAYS * 86_400_000).toISOString().slice(0, 10);
    const to = new Date(Date.now() + HORIZON_DAYS * 86_400_000).toISOString().slice(0, 10);

    const items: FeedItem[] = [];

    const { data: events } = await admin
      .from("calendar_events")
      .select("id, title, description, date, time, duration_minutes, status")
      .eq("user_id", userId)
      .gte("date", from)
      .lte("date", to)
      .limit(1000);

    for (const e of events || []) {
      if ((e as any).status === "cancelled") continue;
      items.push({
        uid: `event-${(e as any).id}`,
        title: (e as any).title,
        date: (e as any).date,
        time: (e as any).time,
        durationMinutes: (e as any).duration_minutes ?? 30,
        description: (e as any).description || "From MyRhythm.",
      });
    }

    const { data: actions } = await admin
      .from("extracted_actions")
      .select("id, action_text, reference_code, start_date, end_date, scheduled_date, scheduled_time, calendar_event_id, archived_at, status")
      .eq("user_id", userId)
      .limit(1000);

    for (const a of actions || []) {
      const row = a as any;
      if (row.archived_at) continue;
      // Skip anything already represented by a calendar entry above.
      if (row.calendar_event_id) continue;
      const date: string | null = row.scheduled_date || row.start_date || row.end_date || null;
      if (!date || date < from || date > to) continue;
      items.push({
        uid: `action-${row.id}`,
        title: row.action_text || "My next step",
        date,
        time: row.scheduled_time || null,
        allDay: !row.scheduled_time,
        durationMinutes: 30,
        description: [
          row.reference_code ? `Reference: ${row.reference_code}` : null,
          row.end_date ? `Finish by ${row.end_date}` : null,
          "From MyRhythm.",
        ].filter(Boolean).join("\n\n"),
      });
    }

    const body = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//MyRhythm//Feed//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:MyRhythm",
      "X-WR-CALDESC:My dated steps from MyRhythm",
      "X-PUBLISHED-TTL:PT1H",
      "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
      ...items.flatMap(vevent),
      "END:VCALENDAR",
    ].map(fold).join("\r\n");

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'inline; filename="myrhythm.ics"',
        "Cache-Control": "public, max-age=900",
      },
    });
  } catch (error) {
    console.error("calendar-feed error:", error);
    return new Response("Could not build the calendar feed.", { status: 500 });
  }
});
