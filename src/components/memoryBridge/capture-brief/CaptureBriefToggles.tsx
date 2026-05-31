import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SectionKey } from './model/types';
import { FileText, ListChecks, Lightbulb, HelpCircle, ScrollText, CalendarClock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface Props {
  sections: Record<SectionKey, boolean>;
  onChange: (s: Record<SectionKey, boolean>) => void;
  includeSchedule?: boolean;
  onIncludeScheduleChange?: (v: boolean) => void;
}

const ITEMS: { key: SectionKey; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'summary', label: 'Executive summary', desc: 'Cover + 1-page synthesis', icon: FileText },
  { key: 'actions', label: 'Action register', desc: 'Owners, due, priority, confidence', icon: ListChecks },
  { key: 'decisions', label: 'Decisions & themes', desc: 'What was agreed', icon: Lightbulb },
  { key: 'questions', label: 'Open questions', desc: 'Unresolved follow-ups', icon: HelpCircle },
  { key: 'transcript', label: 'Annotated transcript', desc: 'Speaker turns + quotes', icon: ScrollText },
];

const QUICK_MODES = {
  full: { summary: true, actions: true, decisions: true, questions: true, transcript: false } as Record<SectionKey, boolean>,
  actions: { summary: false, actions: true, decisions: false, questions: false, transcript: false } as Record<SectionKey, boolean>,
  transcript: { summary: true, actions: false, decisions: false, questions: false, transcript: true } as Record<SectionKey, boolean>,
  everything: { summary: true, actions: true, decisions: true, questions: true, transcript: true } as Record<SectionKey, boolean>,
};

export function CaptureBriefToggles({
  sections,
  onChange,
  includeSchedule = true,
  onIncludeScheduleChange,
}: Props) {
  const currentMode = (Object.entries(QUICK_MODES).find(([, v]) =>
    (Object.keys(v) as SectionKey[]).every(k => v[k] === sections[k]),
  )?.[0]) || 'custom';

  return (
    <div className="space-y-6">
      <Card className="p-5 backdrop-blur-sm bg-card/80 border-border">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Quick mode
        </Label>
        <RadioGroup
          value={currentMode}
          onValueChange={(v) => {
            if (v in QUICK_MODES) onChange({ ...QUICK_MODES[v as keyof typeof QUICK_MODES] });
          }}
          className="mt-3 space-y-2"
        >
          {[
            { v: 'full', label: 'Full pack', desc: 'Summary + actions + decisions + questions' },
            { v: 'actions', label: 'Actions only', desc: 'Just the action register' },
            { v: 'transcript', label: 'Transcript only', desc: 'Summary + full transcript' },
            { v: 'everything', label: 'Everything', desc: 'All five sections' },
          ].map(opt => (
            <Label
              key={opt.v}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-brand-orange-500/50 cursor-pointer transition-colors has-[:checked]:border-brand-orange-500 has-[:checked]:bg-brand-orange-500/5"
            >
              <RadioGroupItem value={opt.v} className="mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground">{opt.label}</div>
                <div className="text-xs text-muted-foreground">{opt.desc}</div>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </Card>

      <Card className="p-5 backdrop-blur-sm bg-card/80 border-border">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Include sections
        </Label>
        <div className="mt-3 space-y-2">
          {ITEMS.map(({ key, label, desc, icon: Icon }) => (
            <Label
              key={key}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-brand-orange-500/50 cursor-pointer transition-colors has-[:checked]:border-brand-orange-500 has-[:checked]:bg-brand-orange-500/5"
            >
              <Checkbox
                checked={sections[key]}
                onCheckedChange={(checked) => onChange({ ...sections, [key]: Boolean(checked) })}
                className="mt-0.5"
              />
              <Icon className="h-4 w-4 text-brand-orange-600 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground">{label}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
            </Label>
          ))}
        </div>
      </Card>

      <Card className="p-5 backdrop-blur-sm bg-card/80 border-border">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Smart scheduling
        </Label>
        <div className="mt-3 flex items-start gap-3 p-3 rounded-lg border border-border">
          <CalendarClock className="h-4 w-4 text-brand-orange-600 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground">AI scheduling suggestions</div>
            <div className="text-xs text-muted-foreground">
              Inline Start · Remind · Due slot per action, with one-tap commit.
            </div>
          </div>
          <Switch
            checked={includeSchedule}
            onCheckedChange={(v) => onIncludeScheduleChange?.(v)}
          />
        </div>
      </Card>
    </div>
  );
}
