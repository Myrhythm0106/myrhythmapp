import React from 'react';
import { CheckCircle2, Flame, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCompletionStats } from '@/hooks/useCompletionStats';

interface CompletionStatsStripProps {
  className?: string;
}

/**
 * Three honest numbers, quietly. Finished this week, current streak, still open.
 * Nothing here shames an empty week.
 */
export function CompletionStatsStrip({ className }: CompletionStatsStripProps) {
  const { stats, isLoading } = useCompletionStats();

  if (isLoading || !stats) return null;

  const nothingYet = stats.doneThisWeek === 0 && stats.currentStreak === 0;

  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card/70 px-4 py-3 backdrop-blur-sm',
        className
      )}
      aria-label="My follow-through this week"
    >
      {nothingYet ? (
        <p className="text-base text-muted-foreground">
          Nothing finished yet this week — one small step counts.
          {stats.openSteps > 0 && (
            <span className="ml-1 text-foreground">
              I have {stats.openSteps} open {stats.openSteps === 1 ? 'step' : 'steps'}.
            </span>
          )}
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Stat
            icon={<CheckCircle2 className="h-4 w-4 text-primary" strokeWidth={1.75} />}
            value={stats.doneThisWeek}
            label="done this week"
          />
          <Stat
            icon={<Flame className="h-4 w-4 text-brand-orange-600" strokeWidth={1.75} />}
            value={stats.currentStreak}
            label={stats.currentStreak === 1 ? 'day streak' : 'day streak'}
          />
          <Stat
            icon={<ListTodo className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />}
            value={stats.openSteps}
            label="still open"
          />
        </div>
      )}
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-lg font-semibold tabular-nums text-foreground">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
