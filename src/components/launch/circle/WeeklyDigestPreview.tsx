import React from 'react';
import { Mail, TrendingUp, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DigestStat {
  sent: number;
  accepted: number;
  topSender?: string;
}

interface Props {
  weekLabel?: string; // e.g. "Week of 27 May"
  stats: DigestStat;
  onAdjustPermissions?: () => void;
}

/**
 * Sunday roll-up summary preview. Turns Consent Capture into a relationship
 * instrument, not a notes app.
 */
export function WeeklyDigestPreview({ weekLabel = 'This week', stats, onAdjustPermissions }: Props) {
  const acceptRate = stats.sent === 0 ? 0 : Math.round((stats.accepted / stats.sent) * 100);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-brand-teal-50 via-white to-memory-emerald-50/40 border border-brand-teal-200/50 p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-brand-teal-700">
        <Mail className="h-4 w-4" />
        <p className="text-xs font-semibold uppercase tracking-wide">{weekLabel} · Capture digest</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat value={stats.sent} label="Sent by circle" />
        <Stat value={stats.accepted} label="You accepted" />
        <Stat value={`${acceptRate}%`} label="Accept rate" />
      </div>

      {stats.topSender && (
        <p className="text-sm text-brain-health-700 flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-memory-emerald-600" />
          <span className="font-semibold">{stats.topSender}</span> sends most for you.
        </p>
      )}

      {onAdjustPermissions && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onAdjustPermissions}
          className="w-full justify-center text-brand-teal-700 hover:bg-brand-teal-100/60"
        >
          <Settings2 className="h-3.5 w-3.5 mr-1.5" />
          Adjust who can capture for you
        </Button>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-brain-health-900">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-brain-health-500 mt-0.5">{label}</div>
    </div>
  );
}
