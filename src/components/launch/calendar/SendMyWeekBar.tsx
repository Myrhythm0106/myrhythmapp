import React from 'react';
import { CalendarPlus, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  downloadIcs,
  ExternalCalendarItem,
} from '@/launch/calendar/externalCalendarLinks';
import type { LaunchCalendarEvent } from '@/hooks/useLaunchCalendarEvents';

interface SendMyWeekBarProps {
  events: LaunchCalendarEvent[];
  /** Anchor day; the week runs from here for the next seven days. */
  from: Date;
}

function toKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * One tap puts everything dated in the next seven days into Google, Outlook,
 * Apple Calendar or anything else that reads a standard calendar file.
 */
export function SendMyWeekBar({ events, from }: SendMyWeekBarProps) {
  const start = toKey(from);
  const endDate = new Date(from);
  endDate.setDate(endDate.getDate() + 7);
  const end = toKey(endDate);

  const inWindow = (events || []).filter((e) => {
    const date = (e as any).date as string | undefined;
    return !!date && date >= start && date <= end && (e as any).status !== 'cancelled';
  });

  const send = () => {
    if (!inWindow.length) {
      toast('Nothing dated in the next seven days yet', {
        description: 'Schedule a step and it will be ready to send.',
      });
      return;
    }
    const items: ExternalCalendarItem[] = inWindow.map((e) => ({
      title: (e as any).title || 'My next step',
      date: (e as any).date,
      time: (e as any).time || '09:00',
      durationMinutes: (e as any).duration_minutes || 30,
      description: (e as any).description || undefined,
      uid: `event-${(e as any).id}`,
    }));
    downloadIcs(items, 'myrhythm-my-week.ics');
    toast.success(`My week is ready — ${items.length} ${items.length === 1 ? 'item' : 'items'}`, {
      description: 'Open the downloaded file and your calendar will add them all.',
    });
  };

  return (
    <div className="mb-4 rounded-xl border border-launch-gold/30 bg-launch-ivory p-3 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-sm text-launch-ink/80">
        <CalendarPlus className="h-4 w-4 text-launch-teal shrink-0" />
        <span>Send the next seven days to my own calendar.</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={send}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-launch-teal px-4 text-sm font-semibold text-white hover:opacity-90"
        >
          <Download className="h-4 w-4" /> Send my week
        </button>
        <Link
          to="/launch/settings"
          className="text-sm font-medium text-launch-ink/60 hover:underline"
        >
          Or subscribe once
        </Link>
      </div>
    </div>
  );
}
