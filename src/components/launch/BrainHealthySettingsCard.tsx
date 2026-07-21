import React from 'react';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { HeartPulse, RotateCcw, Minus, Plus } from 'lucide-react';
import {
  BRAIN_HEALTHY_DEFAULTS,
  BREAK_STYLE_OPTIONS,
  BreakStyle,
  RANGES,
  clampToRange,
  formatMinutes,
} from '@/launch/scheduling/defaults';
import { useBrainHealthyPrefs } from '@/hooks/useBrainHealthyPrefs';
import { ProtectedWindowsEditor } from '@/components/launch/ProtectedWindowsEditor';

function Stepper({
  value, onChange, range, format = (v: number) => `${v} ${range.unit}`,
}: {
  value: number; onChange: (v: number) => void; range: typeof RANGES.min_meeting_gap_minutes;
  format?: (v: number) => string;
}) {
  const dec = () => onChange(clampToRange(value - range.step, range));
  const inc = () => onChange(clampToRange(value + range.step, range));
  return (
    <div className="flex items-center gap-2">
      <button
        type="button" onClick={dec}
        className="h-9 w-9 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gray-400 disabled:opacity-40"
        disabled={value <= range.min}
        aria-label="Decrease"
      >
        <Minus className="h-4 w-4" />
      </button>
      <div className="min-w-[6.5rem] text-center text-sm font-medium tabular-nums">{format(value)}</div>
      <button
        type="button" onClick={inc}
        className="h-9 w-9 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gray-400 disabled:opacity-40"
        disabled={value >= range.max}
        aria-label="Increase"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function Row({
  label, hint, control, defaultHint,
}: { label: React.ReactNode; hint?: string; defaultHint?: string; control: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 py-3 border-b border-gray-100 last:border-0">
      <div className="pr-3 flex-1">
        <Label className="text-sm text-gray-900">{label}</Label>
        {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
        {defaultHint && <p className="text-[11px] text-gray-400 mt-0.5">{defaultHint}</p>}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

export function BrainHealthySettingsCard() {
  const { prefs, update, reset, loading } = useBrainHealthyPrefs();

  if (loading) {
    return (
      <LaunchCard>
        <div className="animate-pulse h-32" />
      </LaunchCard>
    );
  }

  const D = BRAIN_HEALTHY_DEFAULTS;

  return (
    <LaunchCard>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
          <HeartPulse className="h-5 w-5 text-emerald-700" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Brain-Healthy Scheduling</h3>
          <p className="text-xs text-gray-500">Defaults are set — adjust anything, any time, within safe ranges.</p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="text-[11px] text-gray-500 hover:text-emerald-700 flex items-center gap-1"
          title="Reset all to defaults"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset all
        </button>
      </div>

      <div>
        <Row
          label="Protect my day from back-to-back meetings"
          hint="Nudges (never blocks) when meetings pile up."
          control={
            <Switch
              checked={prefs.brain_healthy_enabled}
              onCheckedChange={(v) => update({ brain_healthy_enabled: v })}
            />
          }
        />

        <div className={prefs.brain_healthy_enabled ? '' : 'opacity-50 pointer-events-none'}>
          <Row
            label="Min gap between meetings"
            defaultHint={`Default ${D.min_meeting_gap_minutes} min · range 0–60 min`}
            control={
              <div className="w-full sm:w-64 space-y-2">
                <Stepper
                  value={prefs.min_meeting_gap_minutes}
                  onChange={(v) => update({ min_meeting_gap_minutes: v })}
                  range={RANGES.min_meeting_gap_minutes}
                />
                <Slider
                  value={[prefs.min_meeting_gap_minutes]}
                  min={RANGES.min_meeting_gap_minutes.min}
                  max={RANGES.min_meeting_gap_minutes.max}
                  step={RANGES.min_meeting_gap_minutes.step}
                  onValueChange={([v]) => update({ min_meeting_gap_minutes: v })}
                />
              </div>
            }
          />

          <Row
            label="Longer-break trigger"
            hint="Max consecutive meeting time before a bigger reset is suggested."
            defaultHint={`Default ${formatMinutes(D.longer_break_trigger_minutes)} · range 30 min – 4 h`}
            control={
              <Stepper
                value={prefs.longer_break_trigger_minutes}
                onChange={(v) => update({ longer_break_trigger_minutes: v })}
                range={RANGES.longer_break_trigger_minutes}
                format={formatMinutes}
              />
            }
          />

          <Row
            label="Longer-break length"
            defaultHint={`Default ${D.longer_break_length_minutes} min · range 10–60 min`}
            control={
              <Stepper
                value={prefs.longer_break_length_minutes}
                onChange={(v) => update({ longer_break_length_minutes: v })}
                range={RANGES.longer_break_length_minutes}
              />
            }
          />

          <Row
            label="Daily meeting cap"
            hint={prefs.no_daily_cap ? 'No cap set — MyRhythm won\'t warn about volume.' : 'You\'ll get a gentle heads-up when you cross this.'}
            defaultHint={`Default ${D.daily_meeting_cap} · range 1–20 or No cap`}
            control={
              <div className="flex flex-col items-end gap-2">
                <div className={prefs.no_daily_cap ? 'opacity-40 pointer-events-none' : ''}>
                  <Stepper
                    value={prefs.daily_meeting_cap}
                    onChange={(v) => update({ daily_meeting_cap: v })}
                    range={RANGES.daily_meeting_cap}
                    format={(v) => `${v}`}
                  />
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-600">
                  <Switch
                    checked={prefs.no_daily_cap}
                    onCheckedChange={(v) => update({ no_daily_cap: v })}
                  />
                  No cap
                </label>
              </div>
            }
          />

          <Row
            label="Auto-insert Recovery breaks"
            hint="Slot short resets on days that break your gap rule."
            control={
              <Switch
                checked={prefs.auto_insert_breaks}
                onCheckedChange={(v) => update({ auto_insert_breaks: v })}
              />
            }
          />

          <div className={prefs.auto_insert_breaks ? '' : 'opacity-50 pointer-events-none'}>
            <Row
              label="Recovery break length"
              defaultHint={`Default ${D.break_length_minutes} min · range 5–30 min`}
              control={
                <Stepper
                  value={prefs.break_length_minutes}
                  onChange={(v) => update({ break_length_minutes: v })}
                  range={RANGES.break_length_minutes}
                />
              }
            />

            <Row
              label="Break style"
              hint="How the reset feels. Change any time."
              control={
                <div className="flex flex-col items-end gap-2 w-full sm:w-64">
                  <Select
                    value={prefs.break_style}
                    onValueChange={(v) => update({ break_style: v as BreakStyle })}
                  >
                    <SelectTrigger className="w-full rounded-xl h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {BREAK_STYLE_OPTIONS.map(o => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {prefs.break_style === 'custom' && (
                    <Input
                      placeholder="My custom reset"
                      value={prefs.break_style_custom_label ?? ''}
                      onChange={(e) => update({ break_style_custom_label: e.target.value.slice(0, 40) })}
                      className="h-9 w-full"
                    />
                  )}
                </div>
              }
            />
          </div>

          <Row
            label="Reminder buffer before meetings"
            defaultHint={`Default ${D.reminder_buffer_minutes} min · range 0–60 min`}
            control={
              <Stepper
                value={prefs.reminder_buffer_minutes}
                onChange={(v) => update({ reminder_buffer_minutes: v })}
                range={RANGES.reminder_buffer_minutes}
              />
            }
          />

          <div className="pt-4">
            <ProtectedWindowsEditor
              windows={prefs.protected_windows}
              onChange={(w) => update({ protected_windows: w })}
            />
          </div>
        </div>

        <p className="text-[11px] text-gray-500 italic leading-relaxed pt-3 border-t border-gray-100 mt-2">
          These are gentle guides, not rules. MyRhythm never cancels or moves your meetings without you.
        </p>
      </div>
    </LaunchCard>
  );
}
