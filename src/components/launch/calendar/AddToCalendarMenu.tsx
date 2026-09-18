import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CalendarPlus, Download, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  ExternalCalendarItem,
  googleCalendarUrl,
  outlookCalendarUrl,
  downloadIcs,
  safeFilename,
  localTimeZone,
} from '@/launch/calendar/externalCalendarLinks';

interface AddToCalendarMenuProps {
  item: ExternalCalendarItem;
  /** Optional trigger override; defaults to a quiet icon button. */
  children?: React.ReactNode;
  align?: 'start' | 'end';
}

/**
 * "Add to my calendar" — Google, Outlook, Apple/other, or emailed to me.
 * Nothing here needs an account link: every route is one the calendar apps
 * already understand.
 */
export function AddToCalendarMenu({ item, children, align = 'end' }: AddToCalendarMenuProps) {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);

  const openExternal = (url: string, name: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success(`Opening ${name}`, {
      description: 'Save it there and it lands in your diary.',
    });
  };

  const emailToMe = async () => {
    if (!user?.email) {
      toast.error("I can't find your email address", {
        description: 'Add it in Settings and try again.',
      });
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-event-invitation', {
        body: {
          actionText: item.title,
          startDate: item.date,
          startTime: (item.time || '09:00').slice(0, 5),
          durationMinutes: item.durationMinutes || 30,
          context: item.description,
          timeZone: localTimeZone(),
          invites: [{ email: user.email }],
        },
      });
      if (error) throw error;
      toast.success('Sent to your inbox', {
        description: `Open the email and tap accept — it goes straight into your calendar.`,
      });
    } catch (err) {
      console.error('Failed to email calendar invite:', err);
      toast.error("That didn't send", {
        description: 'Try the Google, Outlook or download option instead.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children ?? (
          <button
            type="button"
            aria-label="Add to my calendar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CalendarPlus className="h-4 w-4" />
            )}
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-60">
        <DropdownMenuLabel className="text-xs font-normal text-gray-500">
          Add to my calendar
        </DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => openExternal(googleCalendarUrl(item), 'Google Calendar')}>
          <CalendarPlus className="mr-2 h-4 w-4" /> Google Calendar
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => openExternal(outlookCalendarUrl(item), 'Outlook')}>
          <CalendarPlus className="mr-2 h-4 w-4" /> Outlook
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => downloadIcs([item], safeFilename(item.title))}>
          <Download className="mr-2 h-4 w-4" /> Apple Calendar or other
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => { void emailToMe(); }} disabled={sending}>
          <Mail className="mr-2 h-4 w-4" /> Email it to me
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
