// Utility for generating ICS (iCalendar) files for calendar integration

interface CalendarEvent {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  uid?: string;
}

export function generateICS(events: CalendarEvent[]): string {
  const icsHeader = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Memory Bridge//ACTs Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ].join('\r\n');

  const icsFooter = 'END:VCALENDAR';

  const icsEvents = events.map(event => generateICSEvent(event)).join('\r\n');

  return [icsHeader, icsEvents, icsFooter].join('\r\n');
}

function generateICSEvent(event: CalendarEvent): string {
  const uid = event.uid || generateUID();
  const created = formatICSDate(new Date());
  const dtstart = formatICSDate(event.start);
  const dtend = formatICSDate(event.end);
  
  // Escape special characters in text fields
  const title = escapeICSText(event.title);
  const description = event.description ? escapeICSText(event.description) : '';
  const location = event.location ? escapeICSText(event.location) : '';

  const eventLines = [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${created}`,
    `CREATED:${created}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${title}`,
  ];

  if (description) {
    eventLines.push(`DESCRIPTION:${description}`);
  }

  if (location) {
    eventLines.push(`LOCATION:${location}`);
  }

  // Add reminders (15 minutes before)
  eventLines.push(
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${title}`,
    'END:VALARM'
  );

  eventLines.push('END:VEVENT');

  return eventLines.join('\r\n');
}

function formatICSDate(date: Date): string {
  // Format: YYYYMMDDTHHMMSSZ (UTC)
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/;/g, '\\;')   // Escape semicolons
    .replace(/,/g, '\\,')   // Escape commas
    .replace(/\n/g, '\\n')  // Escape newlines
    .replace(/\r/g, '');    // Remove carriage returns
}

function generateUID(): string {
  // Generate a unique identifier
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `${timestamp}-${random}@memorybridge.app`;
}

// Utility function to create Google Calendar deep link
export function generateGoogleCalendarLink(event: CalendarEvent): string {
  const baseUrl = 'https://calendar.google.com/calendar/render';
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatGoogleDate(event.start)}/${formatGoogleDate(event.end)}`,
    details: event.description || '',
    location: event.location || ''
  });

  return `${baseUrl}?${params.toString()}`;
}

function formatGoogleDate(date: Date): string {
  // Format: YYYYMMDDTHHMMSSZ
  return formatICSDate(date).replace(/[-:]/g, '');
}

// Generate Apple Calendar deep link for iOS/macOS
export function generateAppleCalendarLink(event: CalendarEvent): string {
  // Create data URL with ICS content
  const icsContent = generateICS([event]);
  const dataUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
  return dataUrl;
}

// Utility to create multiple calendar format options
export function generateCalendarLinks(event: CalendarEvent) {
  return {
    ics: generateICS([event]),
    google: generateGoogleCalendarLink(event),
    apple: generateAppleCalendarLink(event),
    outlook: generateOutlookLink(event)
  };
}

function generateOutlookLink(event: CalendarEvent): string {
  const baseUrl = 'https://outlook.live.com/calendar/0/deeplink/compose';
  
  const params = new URLSearchParams({
    subject: event.title,
    startdt: event.start.toISOString(),
    enddt: event.end.toISOString(),
    body: event.description || '',
    location: event.location || ''
  });

  return `${baseUrl}?${params.toString()}`;
}