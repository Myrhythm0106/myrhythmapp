import { useLaunchFocusDisplay } from '@/hooks/useLaunchFocusDisplay';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function LaunchFocusDisplaySettings() {
  const { startOpen, setStartOpen } = useLaunchFocusDisplay();
  return (
    <section className="border-b border-launch-gold/30 py-5 space-y-3" aria-labelledby="focus-display-title">
      <h3 id="focus-display-title" className="font-semibold text-base text-launch-ink">Vision in ACTion details</h3>
      <Select value={startOpen ? 'open' : 'closed'} onValueChange={value => setStartOpen(value === 'open')}>
        <SelectTrigger className="min-h-14 w-full sm:max-w-xs text-base" aria-label="Vision in ACTion details"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="closed">Start closed</SelectItem>
          <SelectItem value="open">Start open</SelectItem>
        </SelectContent>
      </Select>
    </section>
  );
}