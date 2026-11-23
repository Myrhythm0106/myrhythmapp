import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReminderEngine } from './useReminderEngine';
import { toast } from 'sonner';

const HEAD = { prep: 'Getting ready', due: "It's time", followup: 'Did this happen?' } as const;

/** One calm reminder card at the top of the app; at most three choices at a time. */
export function ReminderCard() {
  const { current, respond, markShown } = useReminderEngine();
  const [snoozing, setSnoozing] = useState(false);
  if (!current || current.stage === 'still_open' || current.stage === 'none') return null;
  const { item, stage } = current;
  const people = (item.watchers ?? []).filter((w) => w.startsWith('email:')).map((w) => w.slice(6));
  const when = item.time ? item.time.slice(0, 5) : '';
  const answer = async (a: Parameters<typeof respond>[1], msg?: string) => {
    setSnoozing(false);
    await respond(item, a);
    if (msg) toast.success(msg);
  };

  return (
    <div role="alert" aria-live="polite" className="mx-auto max-w-3xl m-3 rounded-2xl border border-border bg-card/90 backdrop-blur p-4 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{HEAD[stage]}{stage === 'prep' ? (item.date === new Date().toISOString().slice(0, 10) ? ' · today' : ' · tomorrow') : ''}</p>
          <p className="text-lg font-semibold text-foreground">{item.title}{when && ` · ${when}`}</p>
          {people.length > 0 && <p className="text-base text-muted-foreground">With {people.join(', ')}</p>}
          {item.description && <p className="text-base text-muted-foreground mt-1">{item.description}</p>}
        </div>
        <Button variant="ghost" size="icon" className="min-h-14 min-w-14" aria-label="Close for now" onClick={() => markShown(item.id, stage)}><X className="h-5 w-5" /></Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {stage === 'prep' ? (
          <Button variant="action" className="min-h-14 text-base" onClick={() => answer('ready', "Ready. I'll remind you when it's time.")}>I'm ready</Button>
        ) : snoozing ? (
          <>
            <Button variant="outline" className="min-h-14 text-base" onClick={() => answer('snooze10', 'Reminding you in 10 minutes')}>10 minutes</Button>
            <Button variant="outline" className="min-h-14 text-base" onClick={() => answer('snooze60', 'Reminding you in 1 hour')}>1 hour</Button>
            <Button variant="outline" className="min-h-14 text-base" onClick={() => answer('tomorrow', 'Moved to tomorrow')}>Tomorrow</Button>
          </>
        ) : (
          <>
            <Button variant="action" className="min-h-14 text-base" onClick={() => answer('done', 'Done. Well followed through.')}>Done</Button>
            <Button variant="outline" className="min-h-14 text-base" onClick={() => setSnoozing(true)}>Snooze</Button>
            <Button variant="ghost" className="min-h-14 text-base" onClick={() => answer('cant', 'Moved to tomorrow')}>Can't make it</Button>
          </>
        )}
      </div>
    </div>
  );
}
