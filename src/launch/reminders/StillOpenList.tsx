import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useReminderEngine } from './useReminderEngine';

/** End-of-day wrap-up of anything not yet answered. Hidden when empty, with a calm clear-plate line once settled. */
export function StillOpenList() {
  const { stillOpen, respond } = useReminderEngine();
  const [settled, setSettled] = useState(0);
  const answer = async (item: (typeof stillOpen)[number], a: 'done' | 'tomorrow' | 'let_go', msg: string) => {
    if (await respond(item, a)) { toast.success(msg); setSettled((n) => n + 1); }
    else toast.error("Couldn't save that. Please try again.");
  };
  if (stillOpen.length === 0) {
    if (settled === 0) return null;
    return (
      <section aria-label="Today is settled" className="rounded-2xl border border-border bg-card/80 p-5">
        <h2 className="text-lg font-semibold text-foreground">Today is settled</h2>
        <p className="text-base text-muted-foreground">Nothing left hanging. Tomorrow is ready when I am.</p>
      </section>
    );
  }
  const count = stillOpen.length;
  return (
    <section aria-label="Still open today" className="rounded-2xl border border-border bg-card/80 p-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Still open today</h2>
        <p className="text-base text-muted-foreground">
          {count === 1 ? '1 step to settle' : `${count} steps to settle`} before tomorrow. Each choice closes it calmly.
        </p>
      </div>
      {stillOpen.map((item) => (
        <div key={item.id} className="border-t border-border pt-4">
          <p className="text-base font-medium text-foreground">{item.title}{item.time ? ` · ${item.time.slice(0, 5)}` : ''}</p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
            <Button variant="action" className="min-h-14" onClick={() => answer(item, 'done', 'Done. One more promise kept.')}>Done</Button>
            <Button variant="outline" className="min-h-14" onClick={() => answer(item, 'tomorrow', 'Moved to tomorrow. It is in my diary.')}>Move to tomorrow</Button>
            <Button variant="ghost" className="min-h-14" onClick={() => answer(item, 'let_go', 'Let go. No more reminders for this.')}>Let it go</Button>
          </div>
        </div>
      ))}
    </section>
  );
}
