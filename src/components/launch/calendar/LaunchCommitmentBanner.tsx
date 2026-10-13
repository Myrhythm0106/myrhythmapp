import React, { useEffect, useId, useState } from 'react';
import { Star, Zap, Target, Sparkles, Compass, ChevronDown, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { useLaunchFocusDisplay, useLaunchSavedVision, readLocalFocusValue, writeLocalFocusValue } from '@/hooks/useLaunchFocusDisplay';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePlanningScope, usePlanningDay } from '@/hooks/usePlanningScope';
import { LaunchAiPlanAssist } from './LaunchAiPlanAssist';

type ViewScope = 'day' | 'week' | 'month' | 'year';

interface LaunchCommitmentBannerProps {
  scope: ViewScope;
  date?: Date;
  className?: string;
  /** @deprecated inherited context is now read from the persistence layer */
  inheritedVision?: string;
  /** @deprecated inherited context is now read from the persistence layer */
  inheritedFocus?: string;
  /** @deprecated vision persists automatically */
  onVisionChange?: (vision: string) => void;
}

const scopeTitles: Record<ViewScope, (date: Date) => string> = {
  day: () => 'My Vision in ACTion',
  week: () => 'My Vision in ACTion · This week',
  month: (date) => `My Vision in ACTion · ${date.toLocaleDateString('en-US', { month: 'long' })}`,
  year: (date) => `${date.getFullYear()} Vision`,
};

const empoweringMessages = [
  'Your rhythm, your rules',
  'Every small step builds momentum',
  'Progress, not perfection',
  "You're building something meaningful",
  'One moment at a time',
  'Trust your journey',
  'Small wins add up',
  "You've got this",
];

const commitmentTypes = [
  { key: 'core' as const, label: 'Core Goal', sublabel: 'My main step towards my vision', icon: Star, iconColor: 'text-launch-ink' },
  { key: 'key' as const, label: 'Key Goal', sublabel: 'Another step towards it', icon: Zap, iconColor: 'text-launch-ink' },
  { key: 'stretch' as const, label: 'Stretch Goal', sublabel: 'Only if I feel up to it', icon: Target, iconColor: 'text-launch-ink' },
];

export function LaunchCommitmentBanner({
  scope,
  date = new Date(),
  className = '',
}: LaunchCommitmentBannerProps) {
  const { dayOfWeek } = usePlanningDay();
  const { row, save, saveDebounced, periodStart } = usePlanningScope(scope, date, dayOfWeek);

  // Local mirror for controlled inputs (avoids input lag while debouncing).
  const [local, setLocal] = useState({ vision: '', core: '', key: '', stretch: '' });
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [aiOpen, setAiOpen] = useState(false);
  const { expanded, setExpanded, userKey } = useLaunchFocusDisplay();
  const savedVision = useLaunchSavedVision();
  const vision = savedVision || row?.vision_text?.trim() || '';
  const detailsId = useId();
  const connectionKey = `launch.vision-connection:${userKey}:${scope}:${periodStart.toISOString()}`;
  const [connection, setConnection] = useState<{ vision: string; core: string } | null>(null);
  useEffect(() => {
    setConnection(readLocalFocusValue(connectionKey, null));
  }, [connectionKey]);
  const linked = Boolean(vision && local.core.trim() && connection?.vision === vision && connection.core === local.core);
  const confirmConnection = (checked: boolean) => {
    const next = checked ? { vision, core: local.core } : null;
    setConnection(next);
    writeLocalFocusValue(connectionKey, next);
  };

  // Hydrate from persistence when the row changes.
  useEffect(() => {
    setLocal({
      vision: row?.vision_text ?? '',
      core: row?.core ?? '',
      key: row?.key ?? '',
      stretch: row?.stretch ?? '',
    });
  }, [row?.id, row?.vision_text, row?.core, row?.key, row?.stretch]);

  useEffect(() => {
    setCurrentMessageIndex(0);
  }, []);

  const title = scopeTitles[scope](date);

  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!row?.updated_at) return;
    setDirty(false);
    setSavedAt(new Date(row.updated_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
  }, [row?.updated_at]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const saveNow = async () => {
    setSaving(true);
    await save({
      ...(scope === 'year' ? { vision_text: local.vision } : {}),
      core: local.core, key: local.key, stretch: local.stretch, source: 'user',
    } as any);
    setSaving(false);
    setDirty(false);
    setSavedAt(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
  };

  const order = ['core', 'key', 'stretch'] as const;
  const saveAndNext = async () => {
    await saveNow();
    const active = document.activeElement?.id ?? '';
    const idx = order.findIndex((k) => active === `${detailsId}-${k}`);
    const next = order[idx + 1];
    if (next) document.getElementById(`${detailsId}-${next}`)?.focus();
    else if (scope !== 'year') setExpanded(false);
  };

  const SaveBar = (light: boolean) => (
    <div className="flex flex-wrap items-center gap-3 pt-4">
      <Button onClick={saveNow} disabled={saving}
        className={cn('min-h-14 px-6 text-base', light ? 'bg-white text-brand-teal-700 hover:bg-white/90' : 'bg-launch-teal text-launch-cream hover:bg-launch-teal/90')}>
        <Check className="h-5 w-5" /> {saving ? 'Saving…' : 'Save'}
      </Button>
      {scope !== 'year' && (
        <Button variant="ghost" onMouseDown={(e) => e.preventDefault()} onClick={saveAndNext} disabled={saving}
          className="min-h-14 px-5 text-base border border-launch-cream/40 text-launch-cream hover:bg-launch-cream/10 hover:text-launch-cream">
          Save and next <ArrowRight className="h-5 w-5" />
        </Button>
      )}
      <span className="text-base" aria-live="polite">
        {dirty ? 'Changes not saved yet' : savedAt ? `Saved ✓ ${savedAt}` : ''}
      </span>
    </div>
  );

  const handleChange = (field: 'vision' | 'core' | 'key' | 'stretch', value: string) => {
    if (field === 'core' || field === 'vision') confirmConnection(false);
    setLocal((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
    if (field === 'vision') saveDebounced({ vision_text: value, source: 'user' });
    else saveDebounced({ [field]: value, source: 'user' } as any);
  };

  const acceptAiDraft = (draft: { core: string; key: string; stretch: string }) => {
    confirmConnection(false);
    setExpanded(true);
    setLocal((prev) => ({ ...prev, ...draft }));
    save({ core: draft.core, key: draft.key, stretch: draft.stretch, source: 'ai_assisted' });
  };

  const AssistChip = scope !== 'year' && (
    <Button variant="ghost"
      onClick={() => setAiOpen(true)}
      className="min-h-14 px-4 border border-launch-cream/30 bg-launch-cream/10 text-launch-cream hover:bg-launch-cream/20 hover:text-launch-cream"
      aria-label="Help me plan with AI"
    >
      <Sparkles className="h-3 w-3" /> Help me plan
    </Button>
  );

  // Year vision surface
  if (scope === 'year') {
    return (
      <div className={cn('rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-brand-emerald-500 to-brand-teal-500', className)}>
        <div className="p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-300" />
              <h2 className="text-xl font-bold">{title}</h2>
            </div>
            <button
              onClick={() => setAiOpen(true)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" /> Help me plan
            </button>
          </div>
          <p className="text-white/80 text-sm mb-4">What do you want this year to be about?</p>
          <Input
            value={local.vision}
            onChange={(e) => handleChange('vision', e.target.value)}
            placeholder="My year of abundance & growth..."
            className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
          />
          {SaveBar(true)}
          <p className="text-white/70 text-xs mt-3 italic">{empoweringMessages[currentMessageIndex]}</p>
        </div>
        <LaunchAiPlanAssist
          isOpen={aiOpen}
          onClose={() => setAiOpen(false)}
          scope={scope}
          periodStart={periodStart}
          onAccept={acceptAiDraft}
        />
      </div>
    );
  }

  return (
    <section aria-labelledby={`${detailsId}-title`} className={cn('bg-gradient-to-br from-launch-ink-deep to-launch-ink text-launch-cream px-5 py-6 sm:p-7 border-t-2 border-launch-gold', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
        <Compass className="h-6 w-6 shrink-0 text-launch-gold" />
        <h2 id={`${detailsId}-title`} className="text-xl font-semibold font-display">{title}</h2>
        </div>
        {AssistChip}
      </div>
      {vision ? (
        <details className="mb-5">
          <summary className="cursor-pointer min-h-11 leading-relaxed break-words text-lg marker:text-launch-gold">
            <span className="font-medium">My vision: </span>
            {vision.length > 120 ? `${vision.slice(0, 120)}…` : vision}
          </summary>
          <p className="text-base leading-relaxed break-words pt-2">{vision}</p>
        </details>
      ) : (
        <Button asChild variant="ghost" className="min-h-14 text-launch-cream hover:text-launch-cream hover:bg-launch-cream/10">
          <Link to="/launch/vision-statement">Add my vision</Link>
        </Button>
      )}
      <div id={detailsId} className="grid grid-cols-1 md:grid-cols-3 border-y border-launch-cream/25 divide-y md:divide-y-0 md:divide-x divide-launch-cream/25">
          {commitmentTypes.map((type) => (
            <div key={type.key} className={cn('min-w-0 py-4 md:px-5 first:md:pl-0 last:md:pr-0 space-y-3', type.key === 'core' && 'bg-launch-cream/5')}>
              <label htmlFor={expanded ? `${detailsId}-${type.key}` : undefined} className="flex items-center gap-2 text-base font-semibold">
                <type.icon className="h-5 w-5 text-launch-gold shrink-0" />
                <span>{type.label}</span>
              </label>
              {expanded ? <>
              <p className="text-base leading-relaxed">{type.sublabel}</p>
              <Textarea
                id={`${detailsId}-${type.key}`}
                value={local[type.key]}
                onChange={(e) => handleChange(type.key, e.target.value)}
                placeholder={type.sublabel}
                className="min-h-24 bg-launch-cream border-launch-gold/40 text-launch-ink-deep placeholder:text-launch-ink/70 text-base leading-relaxed resize-y"
              />
              </> : local[type.key].trim() ? (
                local[type.key].length > 180 ? <details>
                  <summary className="cursor-pointer text-lg leading-relaxed break-words marker:text-launch-gold">{local[type.key].slice(0, 180)}… <span className="text-base underline">Read full target</span></summary>
                  <p className="pt-3 text-lg leading-relaxed break-words">{local[type.key]}</p>
                </details> : <p className="text-lg leading-relaxed break-words">{local[type.key]}</p>
              ) : <p className="text-base italic">{type.key === 'stretch' ? 'Only if I feel up to it' : 'Not chosen yet'}</p>}
            </div>
          ))}
      </div>
      {expanded && (<div className="pt-4 space-y-4">
        {row?.source === 'ai_assisted' && <p className="text-base">Suggested plan — check its fit with my vision.</p>}
        {vision && local.core.trim() && (
          <label className="flex items-center gap-3 min-h-14 text-base cursor-pointer">
            <Checkbox checked={linked} onCheckedChange={value => confirmConnection(value === true)} />
            My Core Goal supports this vision
          </label>
        )}
      </div>
      )}
      {expanded ? SaveBar(false) : (
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <Button onClick={() => setExpanded(true)}
            className="min-h-14 px-6 text-base bg-launch-teal text-launch-cream hover:bg-launch-teal/90">
            Edit my goals
          </Button>
          <span className="text-base" aria-live="polite">
            {savedAt ? `Saved ✓ ${savedAt}` : ''}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between gap-3 pt-3">
        <Button variant="ghost" aria-expanded={expanded} aria-controls={detailsId}
          onClick={() => setExpanded(!expanded)}
          className="min-h-14 px-0 text-base text-launch-cream hover:text-launch-cream hover:bg-launch-cream/10">
          {expanded ? 'Done editing' : 'Edit goals'}
          <ChevronDown className={cn('h-5 w-5', expanded && 'rotate-180')} />
        </Button>
        {linked && <span className="text-base">This supports my vision</span>}
      </div>

      <LaunchAiPlanAssist
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        scope={scope}
        periodStart={periodStart}
        vision={vision}
        onAccept={acceptAiDraft}
      />
    </section>
  );
}
