import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Calendar, Sparkles, Brain, Users } from 'lucide-react';
import { useDemoOrLive } from '@/contexts/DemoModeContext';
import { cn } from '@/lib/utils';

interface Tile {
  key: string;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  to: string;
  tone: string;
}

export function Scaffolds() {
  const navigate = useNavigate();
  const { fixtures } = useDemoOrLive();
  const supporter = fixtures.supportCircle[0];
  const supporterCount = fixtures.supportCircle.length;

  const peopleSub =
    supporterCount === 0
      ? 'Invite the one person who has your back'
      : supporterCount === 1
      ? `${supporter.name} is with you`
      : `You + ${supporterCount}`;

  const peopleLabel = supporterCount <= 1 ? 'My Person' : 'My Circle';

  const tiles: Tile[] = [
    { key: 'capture', label: 'Capture', sub: `${fixtures.capturesToday} today`, icon: Mic, to: '/launch/capture', tone: 'from-brand-orange-50 to-brand-orange-100/60 text-brand-orange-700 border-brand-orange-200/60' },
    { key: 'today', label: 'Today', sub: 'Your gentle plan', icon: Calendar, to: '/launch/calendar', tone: 'from-clarity-teal-50 to-clarity-teal-100/60 text-clarity-teal-700 border-clarity-teal-200/60' },
    { key: 'wins', label: 'Wins', sub: `${fixtures.wins.length} so far`, icon: Sparkles, to: '/launch/gratitude', tone: 'from-memory-emerald-50 to-memory-emerald-100/60 text-memory-emerald-700 border-memory-emerald-200/60' },
    { key: 'lens', label: 'Lens', sub: 'How your brain feels', icon: Brain, to: '/launch/analytics', tone: 'from-neural-purple-50 to-neural-purple-100/60 text-neural-purple-700 border-neural-purple-200/60' },
    { key: 'people', label: peopleLabel, sub: peopleSub, icon: Users, to: '/launch/support', tone: 'from-brain-health-50 to-brain-health-100/60 text-brain-health-700 border-brain-health-200/60' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {tiles.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.key}
            onClick={() => navigate(t.to)}
            className={cn(
              'min-h-[88px] rounded-2xl border bg-gradient-to-br p-4 text-left transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
              t.tone
            )}
          >
            <Icon className="h-5 w-5 mb-2 opacity-80" />
            <div className="font-semibold text-sm">{t.label}</div>
            <div className="text-xs opacity-75 mt-0.5 line-clamp-1">{t.sub}</div>
          </button>
        );
      })}
    </div>
  );
}
