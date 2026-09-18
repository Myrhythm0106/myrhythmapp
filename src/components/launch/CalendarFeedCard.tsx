import React, { useState } from 'react';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { Button } from '@/components/ui/button';
import { Copy, Check, CalendarRange, Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useCalendarFeed } from '@/launch/calendar/useCalendarFeed';

/**
 * One private link that puts every dated step into Google, Outlook or Apple
 * Calendar and keeps it up to date. No sign-in, no account linking.
 */
export function CalendarFeedCard() {
  const { url, isLoading, isWorking, createLink, revokeLink } = useCalendarFeed();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied. Paste it into your calendar.');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("I couldn't copy it — press and hold the link to copy it by hand.");
    }
  };

  const create = async () => {
    const value = await createLink();
    if (value) {
      toast.success('My calendar link is ready', {
        description: 'Copy it, then paste it into Google, Outlook or Apple Calendar.',
      });
    } else {
      toast.error("I couldn't create the link just now. Try again in a moment.");
    }
  };

  const replace = async () => {
    const value = await createLink();
    if (value) {
      toast.success('New link created', {
        description: 'The old one has stopped working. Paste the new one into your calendar.',
      });
    }
  };

  const turnOff = async () => {
    await revokeLink();
    toast.success('Link turned off', {
      description: 'Nothing new will appear in the calendars it was pasted into.',
    });
  };

  return (
    <LaunchCard className="bg-launch-ivory border-launch-gold/30">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-launch-teal/15 flex items-center justify-center shrink-0">
          <CalendarRange className="h-5 w-5 text-launch-teal" />
        </div>
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <h3 className="font-semibold text-launch-ink">See my plan in my own calendar</h3>
            <p className="text-sm text-launch-ink/70 mt-1">
              Paste one link into Google, Outlook or Apple Calendar. Every dated step shows up
              there and keeps itself current — I never have to add anything twice.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-launch-ink/60">
              <Loader2 className="h-4 w-4 animate-spin" /> Checking…
            </div>
          ) : url ? (
            <>
              <div className="rounded-lg border border-launch-ink/10 bg-white/70 p-3">
                <p className="text-xs uppercase tracking-wide text-launch-ink/50 mb-1">My calendar link</p>
                <p className="text-sm font-mono break-all text-launch-ink/80">{url}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={copy} className="min-h-11">
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? 'Copied' : 'Copy my link'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => void replace()}
                    disabled={isWorking}
                    className="min-h-11"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" /> Create a new link
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => void turnOff()}
                    disabled={isWorking}
                    className="min-h-11 text-launch-ink/60"
                  >
                    Turn it off
                  </Button>
                </div>
              </div>

              <div className="space-y-3 text-sm text-launch-ink/80">
                <div>
                  <p className="font-medium text-launch-ink">Google Calendar</p>
                  <p className="mt-1">
                    On a computer, open Google Calendar. Next to <strong>Other calendars</strong> click{' '}
                    <strong>+</strong>, choose <strong>From URL</strong>, paste the link, then{' '}
                    <strong>Add calendar</strong>.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-launch-ink">Outlook</p>
                  <p className="mt-1">
                    Open Outlook Calendar, click <strong>Add calendar</strong> →{' '}
                    <strong>Subscribe from web</strong>, paste the link, name it{' '}
                    <strong>MyRhythm</strong> and import.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-launch-ink">Apple Calendar / iPhone</p>
                  <p className="mt-1">
                    On iPhone go to <strong>Settings → Apps → Calendar → Calendar Accounts → Add
                    Account → Other → Add Subscribed Calendar</strong> and paste the link. On a Mac,
                    it's <strong>File → New Calendar Subscription</strong>.
                  </p>
                </div>
              </div>

              <p className="text-xs text-launch-ink/55">
                The link is private to me and read-only — anything I paste it into can show my steps,
                but nothing can change them. If I ever share it by mistake, I can create a new one above.
              </p>
            </>
          ) : (
            <>
              <Button
                type="button"
                onClick={() => void create()}
                disabled={isWorking}
                className="min-h-11"
              >
                {isWorking ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Create my calendar link
              </Button>
              <p className="text-xs text-launch-ink/55">
                Nothing to sign in to, and it's free. I can turn it off again at any time.
              </p>
            </>
          )}
        </div>
      </div>
    </LaunchCard>
  );
}
