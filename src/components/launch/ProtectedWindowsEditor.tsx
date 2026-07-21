import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import { BRAIN_HEALTHY_DEFAULTS, DAY_LABELS, ProtectedWindow } from '@/launch/scheduling/defaults';

interface Props {
  windows: ProtectedWindow[];
  onChange: (next: ProtectedWindow[]) => void;
}

function uid() { return `pw-${Date.now()}-${Math.random().toString(36).slice(2,7)}`; }

export function ProtectedWindowsEditor({ windows, onChange }: Props) {
  const updateOne = (id: string, patch: Partial<ProtectedWindow>) =>
    onChange(windows.map(w => w.id === id ? { ...w, ...patch } : w));

  const remove = (id: string) => onChange(windows.filter(w => w.id !== id));

  const add = () => onChange([
    ...windows,
    { id: uid(), name: 'New window', start: '09:00', end: '09:30', days: [1,2,3,4,5], active: true },
  ]);

  const toggleDay = (id: string, d: number) => {
    const w = windows.find(x => x.id === id);
    if (!w) return;
    const next = w.days.includes(d) ? w.days.filter(x => x !== d) : [...w.days, d].sort();
    updateOne(id, { days: next });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-700">Protected windows</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(BRAIN_HEALTHY_DEFAULTS.protected_windows)}
            className="text-[11px] text-gray-500 hover:text-gray-800 flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" /> Restore seeded
          </button>
          {windows.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-[11px] text-gray-500 hover:text-red-600"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {windows.length === 0 && (
        <p className="text-xs text-gray-500 italic">No protected windows. Add one to reserve time you don't want touched.</p>
      )}

      {windows.map(w => (
        <div key={w.id} className="rounded-xl border border-gray-200 p-3 space-y-2 bg-white">
          <div className="flex items-center gap-2">
            <Input
              value={w.name}
              onChange={(e) => updateOne(w.id, { name: e.target.value.slice(0, 40) })}
              className="h-9 flex-1"
            />
            <Switch checked={w.active} onCheckedChange={(v) => updateOne(w.id, { active: v })} />
            <button
              type="button"
              onClick={() => remove(w.id)}
              className="p-2 text-gray-400 hover:text-red-500"
              aria-label="Delete window"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="time"
              value={w.start}
              onChange={(e) => updateOne(w.id, { start: e.target.value })}
              className="h-9 w-28"
            />
            <span className="text-xs text-gray-500">to</span>
            <Input
              type="time"
              value={w.end}
              onChange={(e) => updateOne(w.id, { end: e.target.value })}
              className="h-9 w-28"
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {DAY_LABELS.map((label, i) => {
              const on = w.days.includes(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(w.id, i)}
                  className={`h-7 w-7 rounded-full text-[11px] font-medium border transition-colors ${
                    on
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                  aria-pressed={on}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-gray-300 text-sm text-gray-600 hover:border-emerald-500 hover:text-emerald-700"
      >
        <Plus className="h-4 w-4" /> Add window
      </button>
    </div>
  );
}
