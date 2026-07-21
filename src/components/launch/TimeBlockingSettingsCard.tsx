import React, { useMemo, useState } from 'react';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Blocks, Plus, Trash2, RotateCcw, Copy } from 'lucide-react';
import { useBrainHealthyPrefs } from '@/hooks/useBrainHealthyPrefs';
import { useTimeBlocks, TimeBlock } from '@/hooks/useTimeBlocks';
import { buildTemplate, TemplateKey, TEMPLATE_LABELS } from '@/launch/scheduling/timeBlockTemplates';
import { DAY_LABELS, DAY_LABELS_FULL, BlockType, BlockColor, RepeatRule } from '@/launch/scheduling/defaults';
import { toast } from 'sonner';

const BLOCK_TYPES: { value: BlockType; label: string; defaultColor: BlockColor; meetings: boolean }[] = [
  { value: 'focus', label: 'Focus', defaultColor: 'moss', meetings: false },
  { value: 'meetings', label: 'Meetings', defaultColor: 'gold', meetings: true },
  { value: 'admin', label: 'Admin', defaultColor: 'slate', meetings: false },
  { value: 'rest', label: 'Rest', defaultColor: 'ember', meetings: false },
  { value: 'personal', label: 'Personal', defaultColor: 'ink', meetings: false },
  { value: 'custom', label: 'Custom', defaultColor: 'slate', meetings: true },
];

const COLORS: { value: BlockColor; swatch: string }[] = [
  { value: 'moss', swatch: 'bg-emerald-500' },
  { value: 'gold', swatch: 'bg-amber-500' },
  { value: 'ember', swatch: 'bg-orange-600' },
  { value: 'ink', swatch: 'bg-slate-900' },
  { value: 'slate', swatch: 'bg-slate-400' },
];

const REPEATS: { value: RepeatRule; label: string }[] = [
  { value: 'none', label: 'No repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'custom', label: 'Custom' },
];

function hmToTime(hm: string) { return hm.length === 5 ? `${hm}:00` : hm; }
function timeToHm(t: string) { return t.slice(0, 5); }

export function TimeBlockingSettingsCard() {
  const { prefs, update: updatePrefs } = useBrainHealthyPrefs();
  const { blocks, create, update, remove, clearAll, loading } = useTimeBlocks();
  const [seedingTpl, setSeedingTpl] = useState<TemplateKey>('blank');

  const byDay = useMemo(() => {
    const map: Record<number, TimeBlock[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    blocks.forEach(b => {
      const d = b.day_of_week ?? 0;
      if (!map[d]) map[d] = [];
      map[d].push(b);
    });
    return map;
  }, [blocks]);

  const seedFromTemplate = async () => {
    const items = buildTemplate(seedingTpl);
    if (items.length === 0) { toast('Blank template — add blocks manually.'); return; }
    for (const it of items) { await create(it); }
    toast.success(`Seeded ${items.length} blocks. All editable.`);
    updatePrefs({ time_block_template: seedingTpl });
  };

  const addBlock = async (day: number) => {
    const t = BLOCK_TYPES[0];
    await create({
      day_of_week: day, date: null,
      start_time: '09:00:00', end_time: '10:00:00',
      name: 'New block', block_type: t.value, color: t.defaultColor,
      meetings_allowed: t.meetings, repeat_rule: 'weekly', is_active: true,
    });
  };

  const duplicateToAllWeekdays = async (b: TimeBlock) => {
    for (const d of [1,2,3,4,5]) {
      if (d === b.day_of_week) continue;
      await create({
        day_of_week: d, date: null,
        start_time: b.start_time, end_time: b.end_time,
        name: b.name, block_type: b.block_type, color: b.color,
        meetings_allowed: b.meetings_allowed, repeat_rule: b.repeat_rule, is_active: b.is_active,
      });
    }
    toast.success('Duplicated across weekdays');
  };

  return (
    <LaunchCard>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <Blocks className="h-5 w-5 text-amber-700" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Time-blocking</h3>
          <p className="text-xs text-gray-500">Reserve chunks for focus, admin, rest. Fully editable.</p>
        </div>
        <Switch
          checked={prefs.time_blocking_enabled}
          onCheckedChange={(v) => updatePrefs({ time_blocking_enabled: v })}
        />
      </div>

      {prefs.time_blocking_enabled && (
        <div className="space-y-4">
          {/* Template seeder */}
          <div className="rounded-xl border border-dashed border-gray-200 p-3">
            <Label className="text-xs text-gray-700">Starting template</Label>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <Select value={seedingTpl} onValueChange={(v) => setSeedingTpl(v as TemplateKey)}>
                <SelectTrigger className="h-9 rounded-xl flex-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="blank">Blank</SelectItem>
                  <SelectItem value="classic_focus">Classic Focus</SelectItem>
                  <SelectItem value="meeting_heavy">Meeting-heavy</SelectItem>
                  <SelectItem value="recovery_friendly">Recovery-friendly</SelectItem>
                </SelectContent>
              </Select>
              <button
                type="button"
                onClick={seedFromTemplate}
                className="h-9 px-3 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
              >
                Seed blocks
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              Templates only seed the grid. Rename, move, or delete anything afterwards.
            </p>
          </div>

          {/* Weekly grid — one column per day, blocks listed */}
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
            {[1,2,3,4,5,6,0].map(d => (
              <div key={d} className="rounded-xl border border-gray-200 p-2 min-h-[140px] bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-gray-700">{DAY_LABELS_FULL[d]}</span>
                  <button
                    type="button"
                    onClick={() => addBlock(d)}
                    className="p-1 text-gray-400 hover:text-emerald-700"
                    aria-label={`Add block on ${DAY_LABELS_FULL[d]}`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {(byDay[d] ?? []).length === 0 && (
                    <p className="text-[11px] text-gray-400 italic">No blocks</p>
                  )}
                  {(byDay[d] ?? []).map(b => (
                    <BlockEditor
                      key={b.id}
                      block={b}
                      onChange={(patch) => update(b.id, patch)}
                      onDelete={() => remove(b.id)}
                      onDuplicate={() => duplicateToAllWeekdays(b)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {blocks.length > 0 && (
            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-gray-100">
              <span className="text-gray-500">{blocks.length} block{blocks.length === 1 ? '' : 's'} · all editable</span>
              <button
                type="button"
                onClick={() => { if (confirm('Delete all time-blocks?')) clearAll(); }}
                className="text-gray-500 hover:text-red-600 flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" /> Clear all
              </button>
            </div>
          )}

          {loading && <p className="text-[11px] text-gray-400">Loading…</p>}
        </div>
      )}
    </LaunchCard>
  );
}

function BlockEditor({
  block, onChange, onDelete, onDuplicate,
}: {
  block: TimeBlock;
  onChange: (patch: Partial<TimeBlock>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const color = COLORS.find(c => c.value === block.color) ?? COLORS[0];
  return (
    <div className={`rounded-lg border ${block.is_active ? 'border-gray-200' : 'border-dashed border-gray-200 opacity-60'} bg-white`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 p-2 text-left"
      >
        <span className={`w-2 h-6 rounded-full ${color.swatch}`} />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-900 truncate">{block.name}</div>
          <div className="text-[10px] text-gray-500 tabular-nums">
            {timeToHm(block.start_time)}–{timeToHm(block.end_time)}
          </div>
        </div>
      </button>
      {open && (
        <div className="p-2 space-y-2 border-t border-gray-100">
          <Input
            value={block.name}
            onChange={(e) => onChange({ name: e.target.value.slice(0, 40) })}
            className="h-8 text-xs"
          />
          <div className="flex items-center gap-1">
            <Input
              type="time"
              value={timeToHm(block.start_time)}
              onChange={(e) => onChange({ start_time: hmToTime(e.target.value) })}
              className="h-8 text-xs"
            />
            <Input
              type="time"
              value={timeToHm(block.end_time)}
              onChange={(e) => onChange({ end_time: hmToTime(e.target.value) })}
              className="h-8 text-xs"
            />
          </div>
          <Select value={block.block_type} onValueChange={(v) => {
            const t = BLOCK_TYPES.find(x => x.value === v)!;
            onChange({ block_type: v as BlockType, meetings_allowed: t.meetings, color: t.defaultColor });
          }}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {BLOCK_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            {COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => onChange({ color: c.value })}
                className={`h-5 w-5 rounded-full ${c.swatch} ${block.color === c.value ? 'ring-2 ring-offset-1 ring-emerald-600' : ''}`}
                aria-label={c.value}
              />
            ))}
          </div>
          <Select value={block.repeat_rule} onValueChange={(v) => onChange({ repeat_rule: v as RepeatRule })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {REPEATS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <label className="flex items-center justify-between text-[11px] text-gray-700 pt-1">
            Meetings allowed inside
            <Switch checked={block.meetings_allowed} onCheckedChange={(v) => onChange({ meetings_allowed: v })} />
          </label>
          <label className="flex items-center justify-between text-[11px] text-gray-700">
            Active
            <Switch checked={block.is_active} onCheckedChange={(v) => onChange({ is_active: v })} />
          </label>
          <div className="flex items-center gap-1 pt-1">
            <button
              type="button"
              onClick={onDuplicate}
              className="flex-1 h-7 rounded-md border border-gray-200 text-[11px] flex items-center justify-center gap-1 hover:border-emerald-500"
            >
              <Copy className="h-3 w-3" /> Duplicate → weekdays
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="h-7 w-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-300"
              aria-label="Delete block"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
