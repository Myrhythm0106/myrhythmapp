import React, { useEffect, useState } from 'react';
import { Sparkles, Sunrise, Sun, Moon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface LaunchDailyBriefProps {
  date: Date;
  eventCount: number;
  focusTitle?: string | null;
  className?: string;
}

function greeting(): { label: string; Icon: React.ComponentType<{ className?: string }> } {
  const h = new Date().getHours();
  if (h < 12) return { label: 'Good morning', Icon: Sunrise };
  if (h < 18) return { label: 'Good afternoon', Icon: Sun };
  return { label: 'Good evening', Icon: Moon };
}

export function LaunchDailyBrief({ date, eventCount, focusTitle, className }: LaunchDailyBriefProps) {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState<string>('');
  const [energyNote, setEnergyNote] = useState<string | null>(null);
  const { label, Icon } = greeting();

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      const [{ data: profile }, { data: moods }] = await Promise.all([
        supabase.from('profiles').select('name').eq('id', user.id).maybeSingle(),
        supabase
          .from('mood_entries')
          .select('energy_level, mood_score, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1),
      ]);

      if (cancelled) return;

      const raw = (profile?.name || '').trim();
      setFirstName(raw ? raw.split(' ')[0] : '');

      const latest = moods?.[0];
      if (latest) {
        const e = (latest as any).energy_level as number | null;
        const m = (latest as any).mood_score as number | null;
        if (typeof e === 'number' && e <= 2) {
          setEnergyNote('Energy is low — protect one high-value task, park the rest.');
        } else if (typeof e === 'number' && e >= 4) {
          setEnergyNote('Energy is strong — tackle your focus item first.');
        } else if (typeof m === 'number' && m <= 2) {
          setEnergyNote('Go gentle today — one thing done well beats three rushed.');
        } else {
          setEnergyNote(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, date]);

  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  if (!isToday) return null;

  const countLine =
    eventCount === 0
      ? "Nothing scheduled yet — a clear day is a choice."
      : `You have ${eventCount} thing${eventCount === 1 ? '' : 's'} today.`;

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/40 bg-gradient-to-br from-brand-emerald-50 via-white to-brand-teal-50 shadow-sm p-4 mb-3',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl bg-white/80 p-2 shadow-sm">
          <Icon className="h-5 w-5 text-brand-teal-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            {label}
            {firstName ? `, ${firstName}` : ''}.
          </p>
          <p className="text-sm text-gray-700 mt-0.5">{countLine}</p>
          {focusTitle && (
            <p className="text-sm mt-1.5 flex items-center gap-1.5 text-brand-teal-700">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="font-medium">Focus:</span>
              <span className="truncate">{focusTitle}</span>
            </p>
          )}
          {energyNote && (
            <p className="text-xs text-gray-500 mt-1.5 italic">{energyNote}</p>
          )}
        </div>
      </div>
    </div>
  );
}
