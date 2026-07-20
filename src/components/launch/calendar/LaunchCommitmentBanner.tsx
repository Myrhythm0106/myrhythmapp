import React, { useEffect, useState } from 'react';
import { Star, Zap, Target, Sparkles } from 'lucide-react';
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
  day: () => "Today's Focus",
  week: () => "This Week's Focus",
  month: (date) => `${date.toLocaleDateString('en-US', { month: 'long' })} Focus`,
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
  { key: 'core' as const, label: 'Core', sublabel: 'This is non-negotiable', icon: Star, iconColor: 'text-amber-300' },
  { key: 'key' as const, label: 'Key', sublabel: 'Important to me', icon: Zap, iconColor: 'text-white' },
  { key: 'stretch' as const, label: 'Stretch', sublabel: 'When energy allows', icon: Target, iconColor: 'text-brand-teal-200' },
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
    const timer = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % empoweringMessages.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const title = scopeTitles[scope](date);

  const handleChange = (field: 'vision' | 'core' | 'key' | 'stretch', value: string) => {
    setLocal((prev) => ({ ...prev, [field]: value }));
    if (field === 'vision') saveDebounced({ vision_text: value, source: 'user' });
    else saveDebounced({ [field]: value, source: 'user' } as any);
  };

  const acceptAiDraft = (draft: { core: string; key: string; stretch: string }) => {
    setLocal((prev) => ({ ...prev, ...draft }));
    save({ core: draft.core, key: draft.key, stretch: draft.stretch, source: 'ai_assisted' });
  };

  const AssistChip = scope !== 'year' && (
    <button
      onClick={() => setAiOpen(true)}
      className="text-xs px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white flex items-center gap-1 transition-colors"
      aria-label="Help me plan with AI"
    >
      <Sparkles className="h-3 w-3" /> Help me plan
    </button>
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
    <div className={cn('rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-brand-emerald-500 to-brand-teal-500', className)}>
      <div className="p-6 text-white">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-300" />
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/80 text-sm italic hidden sm:inline">{empoweringMessages[currentMessageIndex]}</span>
            {AssistChip}
          </div>
        </div>

        {row?.source === 'ai_assisted' && (
          <p className="text-white/70 text-xs mb-3 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> AI-assisted draft — edit anytime
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {commitmentTypes.map((type) => (
            <div key={type.key} className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <type.icon className={cn('h-4 w-4', type.iconColor)} />
                <span>{type.label}</span>
                <span className="text-white/60 text-xs">- {type.sublabel}</span>
              </label>
              <Input
                value={local[type.key]}
                onChange={(e) => handleChange(type.key, e.target.value)}
                placeholder={type.sublabel}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 text-sm"
              />
            </div>
          ))}
        </div>
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
