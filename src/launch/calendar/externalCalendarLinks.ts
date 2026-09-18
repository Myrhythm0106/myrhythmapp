/**
 * Send a dated step to any outside calendar — no account, no sign-in.
 *
 * Three routes from one record:
 *  - Google Calendar  (pre-filled "save event" page)
 *  - Outlook on the web (pre-filled compose page)
 *  - A standard .ics file, which Apple Calendar, iPhone, Mac, Fastmail and
 *    most work calendars open directly.
 *
 * Times are written as real UTC instants derived from the user's own local
 * clock, so a 09:00 step stays 09:00 wherever it lands.
 */

export interface ExternalCalendarItem {
  title: string;
  /** YYYY-MM-DD in the user's local timezone */
  date: string;
  /** HH:mm in the user's local timezone. Omitted means an all-day entry. */
  time?: string | null;
  durationMinutes?: number;
  description?: string;
  location?: string;
  /** MB-YYMMDD-XX style traceability code, appended to the notes. */
  referenceCode?: string | null;
  /** Deep link back into MyRhythm for the source of this step. */
  sourceUrl?: string;
  /** Stable id so re-adding replaces rather than duplicates. */
  uid?: string;
}

const DEFAULT_DURATION = 30;

function localInstant(date: string, time?: string | null): Date {
  const [y, m, d] = (date || '').split('-').map(Number);
  const [hh, mm] = (time || '09:00').split(':').map(Number);
  return new Date(y || 1970, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
}

export function itemRange(item: ExternalCalendarItem): { start: Date; end: Date } {
  const start = localInstant(item.date, item.time);
  const end = new Date(
    start.getTime() + (item.durationMinutes || DEFAULT_DURATION) * 60_000,
  );
  return { start, end };
}

/** YYYYMMDDTHHMMSSZ */
export function utcStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function buildNotes(item: ExternalCalendarItem): string {
  const parts: string[] = [];
  if (item.description) parts.push(item.description);
  if (item.referenceCode) parts.push(`Reference: ${item.referenceCode}`);
  if (item.sourceUrl) parts.push(`Where this came from: ${item.sourceUrl}`);
  parts.push('Added from MyRhythm.');
  return parts.join('\n\n');
}

export function googleCalendarUrl(item: ExternalCalendarItem): string {
  const { start, end } = itemRange(item);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: item.title,
    dates: `${utcStamp(start)}/${utcStamp(end)}`,
    details: buildNotes(item),
  });
  if (item.location) params.set('location', item.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(item: ExternalCalendarItem): string {
  const { start, end } = itemRange(item);
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: item.title,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: buildNotes(item),
  });
  if (item.location) params.set('location', item.location);
  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function escapeIcs(text: string): string {
  return String(text ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function fold(line: string): string {
  if (line.length <= 73) return line;
  const out: string[] = [line.slice(0, 73)];
  let rest = line.slice(73);
  while (rest.length) {
    out.push(' ' + rest.slice(0, 72));
    rest = rest.slice(72);
  }
  return out.join('\r\n');
}

function uidFor(item: ExternalCalendarItem): string {
  if (item.uid) return `${item.uid}@myrhythmapp.com`;
  const slug = (item.referenceCode || item.title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 40);
  return `${slug}-${item.date}@myrhythmapp.com`;
}

/**
 * A plain PUBLISH calendar entry — no attendees, no RSVP. This is the
 * "put it in my own diary" file, distinct from the REQUEST invitations we
 * email to other people.
 */
export function buildSelfIcs(items: ExternalCalendarItem[]): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MyRhythm//Steps//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:MyRhythm',
  ];

  for (const item of items) {
    const { start, end } = itemRange(item);
    lines.push(
      'BEGIN:VEVENT',
      `UID:${uidFor(item)}`,
      `DTSTAMP:${utcStamp(new Date())}`,
      `DTSTART:${utcStamp(start)}`,
      `DTEND:${utcStamp(end)}`,
      `SUMMARY:${escapeIcs(item.title.slice(0, 180))}`,
      `DESCRIPTION:${escapeIcs(buildNotes(item))}`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
    );
    if (item.location) lines.push(`LOCATION:${escapeIcs(item.location)}`);
    lines.push(
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeIcs(item.title.slice(0, 100))}`,
      'END:VALARM',
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n');
}

/** Downloads the .ics so Apple Calendar (or anything else) can open it. */
export function downloadIcs(items: ExternalCalendarItem[], filename = 'myrhythm-step.ics') {
  const blob = new Blob([buildSelfIcs(items)], {
    type: 'text/calendar;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function safeFilename(title: string): string {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
  return `${slug || 'myrhythm-step'}.ics`;
}

/** The timezone we tell the invitation email to use. */
export function localTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}
