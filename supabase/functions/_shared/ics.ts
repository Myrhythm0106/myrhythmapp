/**
 * Shared iCalendar builder for MyRhythm invitations.
 *
 * Produces a METHOD:REQUEST invitation with real ATTENDEE lines so Gmail,
 * Outlook and Apple Mail show Yes / No / Maybe buttons instead of a plain
 * "add to calendar" file.
 */

export interface IcsAttendee {
  email: string;
  name?: string;
  /** 'REQ-PARTICIPANT' (must reply) or 'OPT-PARTICIPANT' */
  role?: "REQ-PARTICIPANT" | "OPT-PARTICIPANT";
}

export interface IcsInput {
  uid: string;
  sequence?: number;
  title: string;
  description?: string;
  /** YYYY-MM-DD, in the organiser's timezone */
  startDate: string;
  /** HH:mm, in the organiser's timezone */
  startTime: string;
  /** Length of the slot in minutes */
  durationMinutes?: number;
  /** IANA timezone of the organiser, e.g. "Europe/London" */
  timeZone?: string;
  organiserName: string;
  organiserEmail: string;
  attendees: IcsAttendee[];
  /** Optional YYYY-MM-DD shown in the description as the finish date */
  dueDate?: string;
  method?: "REQUEST" | "CANCEL";
}

export function icsEscape(s: string): string {
  return String(s ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Offset in minutes between the given IANA timezone and UTC at that instant.
 */
function tzOffsetMinutes(utcDate: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(utcDate).filter((p) => p.type !== "literal").map((p) => [p.type, p.value]),
  ) as Record<string, string>;
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );
  return (asUtc - utcDate.getTime()) / 60000;
}

/**
 * Convert a wall-clock date/time in an IANA timezone to a real UTC instant.
 * Without this, a 09:00 step booked in London arrives in someone else's
 * calendar an hour out during British Summer Time.
 */
export function toUtcInstant(date: string, time: string, timeZone?: string): Date {
  const [y, m, d] = (date || "").split("-").map(Number);
  const [hh, mm] = (time || "09:00").split(":").map(Number);
  const naive = Date.UTC(y || 1970, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0);
  if (!timeZone) return new Date(naive);
  try {
    // Two passes handle the DST boundary correctly.
    let offset = tzOffsetMinutes(new Date(naive), timeZone);
    let guess = new Date(naive - offset * 60000);
    offset = tzOffsetMinutes(guess, timeZone);
    guess = new Date(naive - offset * 60000);
    return guess;
  } catch {
    return new Date(naive);
  }
}

export function utcStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function fold(line: string): string {
  if (line.length <= 73) return line;
  const chunks: string[] = [];
  let rest = line;
  chunks.push(rest.slice(0, 73));
  rest = rest.slice(73);
  while (rest.length) {
    chunks.push(" " + rest.slice(0, 72));
    rest = rest.slice(72);
  }
  return chunks.join("\r\n");
}

export function buildInviteIcs(input: IcsInput): string {
  const start = toUtcInstant(input.startDate, input.startTime, input.timeZone);
  const end = new Date(start.getTime() + (input.durationMinutes ?? 30) * 60000);
  const method = input.method ?? "REQUEST";

  const descriptionParts: string[] = [];
  if (input.description) descriptionParts.push(input.description);
  if (input.dueDate) descriptionParts.push(`Finish by ${input.dueDate}`);
  descriptionParts.push("Shared from MyRhythm.");

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MyRhythm//Capture//EN",
    "CALSCALE:GREGORIAN",
    `METHOD:${method}`,
    "BEGIN:VEVENT",
    `UID:${input.uid}`,
    `SEQUENCE:${input.sequence ?? 0}`,
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${utcStamp(start)}`,
    `DTEND:${utcStamp(end)}`,
    `SUMMARY:${icsEscape(input.title.slice(0, 160))}`,
    `DESCRIPTION:${icsEscape(descriptionParts.join("\n\n"))}`,
    `ORGANIZER;CN=${icsEscape(input.organiserName)}:mailto:${input.organiserEmail}`,
    method === "CANCEL" ? "STATUS:CANCELLED" : "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
  ];

  for (const a of input.attendees) {
    if (!a.email) continue;
    lines.push(
      `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=${a.role ?? "REQ-PARTICIPANT"};PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${
        icsEscape(a.name || a.email)
      }:mailto:${a.email}`,
    );
  }

  lines.push(
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(input.title.slice(0, 100))}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  );

  return lines.map(fold).join("\r\n");
}

/** Base64 for the Resend attachment payload (UTF-8 safe). */
export function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

/** Parse a METHOD:REPLY body back into an answer we can store. */
export function parseIcsReply(
  body: string,
): { uid?: string; email?: string; status?: "accepted" | "declined" | "maybe" } {
  const unfolded = body.replace(/\r\n[ \t]/g, "");
  const uid = unfolded.match(/^UID:(.+)$/m)?.[1]?.trim();
  const attendee = unfolded.match(/^ATTENDEE[^:\n]*:mailto:(.+)$/mi);
  const email = attendee?.[1]?.trim().toLowerCase();
  const partstat = unfolded.match(/PARTSTAT=([A-Z-]+)/i)?.[1]?.toUpperCase();
  const status = partstat === "ACCEPTED"
    ? "accepted"
    : partstat === "DECLINED"
    ? "declined"
    : partstat === "TENTATIVE"
    ? "maybe"
    : undefined;
  return { uid, email, status };
}
