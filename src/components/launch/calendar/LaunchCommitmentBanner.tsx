import React, { useEffect, useId, useState } from 'react';
import { Star, Zap, Target, Sparkles, Compass, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { useLaunchFocusDisplay, useLaunchSavedVision, readLocalFocusValue, writeLocalFocusValue } from '@/hooks/useLaunchFocusDisplay';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
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
  { key: 'core' as const, label: 'Core', sublabel: 'My main step towards my vision', icon: Star, iconColor: 'text-launch-ink' },
  { key: 'key' as const, label: 'Key', sublabel: 'Another step towards it', icon: Zap, iconColor: 'text-launch-ink' },
  { key: 'stretch' as const, label: 'Stretch', sublabel: 'Only if I feel up to it', icon: Target, iconColor: 'text-launch-ink' },
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

  const handleChange = (field: 'vision' | 'core' | 'key' | 'stretch', value: string) => {
    if (field === 'core' || field === 'vision') confirmConnection(false);
    setLocal((prev) => ({ ...prev, [field]: value }));
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
      className="min-h-14 px-3 text-launch-ink hover:bg-launch-gold/10 hover:text-launch-ink"
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
    <section aria-labelledby={`${detailsId}-title`} className={cn('border-y border-launch-gold/30 py-5 text-launch-ink', className)}>
      <div className="flex items-center gap-2 mb-3">
        <Compass className="h-5 w-5 shrink-0" />
        <h2 id={`${detailsId}-title`} className="text-xl font-semibold font-display">{title}</h2>
      </div>
      {vision ? (
        <details className="mb-3">
          <summary className="cursor-pointer min-h-11 leading-relaxed break-words text-base marker:text-launch-moss">
            <span className="font-medium">My vision: </span>
            {vision.length > 120 ? `${vision.slice(0, 120)}…` : vision}
          </summary>
          <p className="text-base leading-relaxed break-words pt-2">{vision}</p>
        </details>
      ) : (
        <Button asChild variant="ghost" className="min-h-11 text-launch-ink hover:text-launch-ink hover:bg-launch-gold/10">
          <Link to="/launch/vision-statement">Add my vision</Link>
        </Button>
      )}
      {local.core.trim() && <p className="text-lg font-medium leading-relaxed break-words">{local.core}</p>}
      {linked && <p className="text-base text-launch-ink mt-2">This supports my vision</p>}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
        <Button variant="ghost" aria-expanded={expanded} aria-controls={detailsId}
          onClick={() => setExpanded(!expanded)}
          className="min-h-14 h-auto py-3 px-0 whitespace-normal text-left text-launch-ink hover:text-launch-ink hover:bg-launch-gold/10">
          {expanded ? 'Hide my focus details' : 'Show my focus details'}
          <ChevronDown className={cn('h-5 w-5', expanded && 'rotate-180')} />
        </Button>
        {AssistChip}
      </div>
      {expanded && (
      <div id={detailsId} className="pt-4 space-y-4">
        {row?.source === 'ai_assisted' && <p className="text-base">Suggested plan — check its fit with my vision.</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {commitmentTypes.map((type) => (
            <div key={type.key} className="space-y-2">
              <label htmlFor={`${detailsId}-${type.key}`} className="flex items-center gap-2 text-base font-medium">
                <type.icon className={cn('h-4 w-4', type.iconColor)} />
                <span>{type.label}</span>
              </label>
              <p className="text-base leading-relaxed">{type.sublabel}</p>
              <Input
                id={`${detailsId}-${type.key}`}
                value={local[type.key]}
                onChange={(e) => handleChange(type.key, e.target.value)}
                placeholder={type.sublabel}
                className="min-h-14 bg-launch-ivory border-launch-gold/40 text-launch-ink placeholder:text-launch-ink/70 text-base"
              />
            </div>
          ))}
        </div>
        {vision && local.core.trim() && (
          <label className="flex items-center gap-3 min-h-14 text-base cursor-pointer">
            <Checkbox checked={linked} onCheckedChange={value => confirmConnection(value === true)} />
            My Core step supports this vision
          </label>
        )}
      </div>
      )}

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
