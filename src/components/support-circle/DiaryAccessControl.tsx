import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { DIARY_LEVELS, diaryLevel, withDiaryLevel, type DiaryLevel } from '@/launch/circle/diaryAccess';

/** Per-person choice: can this circle member see my diary, and how much. Off by default. */
export function DiaryAccessControl({ memberId, memberName, permissions, onSaved }: {
  memberId: string; memberName: string; permissions: Record<string, unknown> | null; onSaved?: () => void;
}) {
  const [level, setLevel] = useState<DiaryLevel>(diaryLevel(permissions));
  const [saving, setSaving] = useState(false);
  const first = memberName.split(' ')[0] || memberName;

  const save = async (next: DiaryLevel) => {
    const prev = level;
    setLevel(next); setSaving(true);
    const { error } = await supabase.from('support_circle_members')
      .update({ permissions: withDiaryLevel(permissions, next) as never }).eq('id', memberId);
    setSaving(false);
    if (error) { setLevel(prev); toast.error('Could not save that just now'); return; }
    toast(next === 'none' ? `${first} can no longer see my diary.` : `Saved. ${first} can now: ${DIARY_LEVELS.find(l => l.value === next)?.label}.`,
      { action: { label: 'Undo', onClick: () => void save(prev) } });
    onSaved?.();
  };

  return (
    <div className="mt-3 rounded-2xl border border-launch-gold/25 bg-launch-cream-light/70 p-3">
      <label className="flex min-h-[48px] items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-base text-launch-ink">
          <CalendarDays className="h-4 w-4 text-launch-teal" /> Share my diary with {first}
        </span>
        <Switch checked={level !== 'none'} disabled={saving} onCheckedChange={on => void save(on ? 'busy' : 'none')} aria-label={`Share my diary with ${first}`} />
      </label>
      {level !== 'none' && (
        <div role="radiogroup" aria-label={`What ${first} can see`} className="mt-2 grid gap-2 sm:grid-cols-3">
          {DIARY_LEVELS.map(l => (
            <button key={l.value} type="button" role="radio" aria-checked={level === l.value} disabled={saving}
              onClick={() => level !== l.value && void save(l.value)}
              className={cn('min-h-[56px] rounded-xl border px-3 py-2 text-left transition-colors',
                level === l.value ? 'border-launch-teal bg-launch-ivory' : 'border-launch-gold/30 hover:bg-launch-ivory')}>
              <span className="block text-sm font-semibold text-launch-ink">{l.label}</span>
              <span className="block text-xs text-launch-ink/60">{l.hint}</span>
            </button>
          ))}
        </div>
      )}
      {level !== 'none' && <p className="mt-2 text-xs text-launch-ink/55">Anything I mark private shows only as "Busy". I can switch this off any time.</p>}
    </div>
  );
}
