import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ChevronRight, Sparkles } from 'lucide-react';
import { useContinuityThread } from './useContinuityThread';
import { usePersona, PERSONA_LABEL } from '@/launch/persona/usePersona';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

const ENERGY_TONE: Record<string, string> = {
  low: 'bg-amber-100 text-amber-800',
  steady: 'bg-teal-100 text-teal-800',
  strong: 'bg-emerald-100 text-emerald-800',
  unknown: 'bg-stone-100 text-stone-700',
};

export function ContinuityRail({ className }: Props) {
  const { latest, daysSinceLastActivity, loading } = useContinuityThread();
  const { persona, label } = usePersona();

  if (loading) return null;

  const fromLabel = latest ? PERSONA_LABEL[latest.persona] ?? label : label;
  const energyBand = latest?.snapshot?.energyBand ?? 'unknown';
  const openCommits = latest?.snapshot?.openCommits ?? 0;
  const carryCount = latest?.carry_forward?.length ?? 0;
  const nextAnchor = latest?.snapshot?.nextAnchor;

  const samePersona = !latest || latest.persona === persona;

  return (
    <Link
      to="/launch/continuity"
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/80 backdrop-blur border border-brain-health-100 hover:border-brain-health-200 transition-colors min-h-[56px]',
        className,
      )}
      aria-label="Cognitive continuity thread"
    >
      <div className="w-9 h-9 rounded-xl bg-brain-health-50 flex items-center justify-center shrink-0">
        <Activity className="h-4 w-4 text-brain-health-600" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-brain-health-500 font-medium">
          Continuity
        </div>
        <div className="text-sm text-brain-health-900 truncate">
          {samePersona ? (
            <>In <span className="font-semibold">{label}</span> mode</>
          ) : (
            <>Coming from <span className="font-semibold">{fromLabel}</span> · now in {label}</>
          )}
          {' · '}
          <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium', ENERGY_TONE[energyBand])}>
            energy {energyBand}
          </span>
          {openCommits > 0 && <span className="text-brain-health-700"> · {openCommits} open</span>}
          {carryCount > 0 && <span className="text-brain-health-700"> · {carryCount} carrying forward</span>}
          {daysSinceLastActivity > 1 && (
            <span className="text-amber-700"> · {daysSinceLastActivity}d gap</span>
          )}
          {nextAnchor && (
            <span className="text-brain-health-700"> · next: {nextAnchor.title}</span>
          )}
        </div>
      </div>
      <Sparkles className="h-4 w-4 text-brain-health-400 shrink-0" strokeWidth={1.75} />
      <ChevronRight className="h-4 w-4 text-brain-health-400 shrink-0" />
    </Link>
  );
}
