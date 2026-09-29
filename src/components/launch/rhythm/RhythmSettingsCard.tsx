import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { onRhythmConsentChange, readRhythmConsent, saveRhythmConsent } from '@/launch/calendar/rhythmConsent';
import { RhythmCalendarConsent } from './RhythmCalendarConsent';

/** Settings: "My rhythm on my calendar" master switch + editor. */
export function RhythmSettingsCard() {
  const [consent, setConsent] = useState(readRhythmConsent);
  const [open, setOpen] = useState(() => window.location.hash === '#rhythm');
  useEffect(() => onRhythmConsentChange(() => setConsent(readRhythmConsent())), []);
  const on = consent.status === 'yes';

  return (
    <div id="rhythm" className="rounded-xl border border-launch-gold/30 bg-launch-ivory p-5">
      <label className="flex min-h-[56px] items-center justify-between gap-3">
        <span>
          <span className="block text-base font-semibold text-launch-ink-deep">My rhythm on my calendar</span>
          <span className="block text-sm text-launch-ink-deep/70">Best time to work, productive window and breaks, as soft bands.</span>
        </span>
        <Switch
          checked={on}
          onCheckedChange={(v) =>
            saveRhythmConsent({
              ...consent,
              status: v ? 'yes' : 'no',
              items: v && !Object.values(consent.items).some(Boolean) ? { work: true, productive: true, breaks: true } : consent.items,
            })
          }
          aria-label="My rhythm on my calendar"
        />
      </label>
      <button onClick={() => setOpen((o) => !o)} className="min-h-11 text-sm font-semibold text-launch-teal underline">
        {open ? 'Hide details' : 'Choose items and regular appointments'}
      </button>
      {open && <div className="-mx-4 mt-3"><RhythmCalendarConsent key={consent.status} /></div>}
    </div>
  );
}
