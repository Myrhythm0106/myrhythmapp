import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useReminderEngine } from './useReminderEngine';

/** End-of-day list of anything not yet answered. Hidden when empty. */
export function StillOpenList() {
  const { stillOpen, respond } = useReminderEngine();
  const answer = async (item: (typeof stillOpen)[number], a: 'done' | 'tomorrow' | 'let_go', msg: string) => {
    if (await respond(item, a)) toast.success(msg);
    else toast.error("Couldn't save that. Please try again.");
  };
  if (stillOpen.length === 0) return null;
  return (
    <section aria-label="Still open today" className="rounded-2xl border border-border bg-card/80 p-4 space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Still open today</h2>
      <p className="text-base text-muted-foreground">No pressure. Choose what fits.</p>
      {stillOpen.map((item) => (
        <div key={item.id} className="border-t border-border pt-3">
          <p className="text-base font-medium text-foreground">{item.title}{item.time ? ` · ${item.time.slice(0, 5)}` : ''}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button variant="action" className="min-h-14" onClick={() => answer(item, 'done', 'Marked done')}>Done</Button>
            <Button variant="outline" className="min-h-14" onClick={() => answer(item, 'tomorrow', 'Moved to tomorrow')}>Move to tomorrow</Button>
            <Button variant="ghost" className="min-h-14" onClick={() => answer(item, 'let_go', 'Let go')}>Let it go</Button>
          </div>
        </div>
      ))}
    </section>
  );
}
