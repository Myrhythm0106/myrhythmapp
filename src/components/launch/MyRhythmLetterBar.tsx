import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { LetterId } from '@/data/launchAssessmentBanks';
import { bandFor, getLetterInsight } from '@/data/myrhythmLetterInsights';
import { foundingMemberConfig, isFoundingMemberActive } from '@/config/pricing';
import type { Persona } from '@/launch/persona/usePersona';
import { getSnapshotTeaser } from '@/launch/persona/snapshotTeasers';

const SERIF: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif" };

interface Props {
  id: LetterId;
  letter: string;
  score: number; // 0..3
  tone?: 'light' | 'dark';
  height?: string; // tailwind height class for the bar track
  persona?: Persona;
}

export const MyRhythmLetterBar: React.FC<Props> = ({ id, letter, score, tone = 'light', height = 'h-12', persona = 'recovery' }) => {
  const insight = getLetterInsight(id);
  const band = bandFor(score);
  const pct = Math.round((band / 3) * 100);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isDark = tone === 'dark';

  const price = isFoundingMemberActive()
    ? foundingMemberConfig.currentPrice.monthly.toFixed(0)
    : foundingMemberConfig.regularPrice.monthly.toFixed(0);

  const label = `${letter} — ${insight.word}, score ${band} of 3. Tap for your personal read.`;
  const teaser = getSnapshotTeaser(persona, id);
  const ctaLabel = isFoundingMemberActive()
    ? `Become a Founding Member — £${price}/mo`
    : `Unlock your full plan — £${price}/mo`;

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={label}
      className={`group flex flex-col items-center gap-2 w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm transition-transform hover:-translate-y-0.5 ${
        isDark ? 'focus-visible:ring-[#c9a84c] focus-visible:ring-offset-[#064e3b]' : 'focus-visible:ring-teal-600'
      }`}
    >

      <div
        className={`w-full ${height} rounded-sm relative overflow-hidden transition-shadow ring-1 ring-transparent ${
          isDark
            ? 'bg-[#f5f0e0]/10 group-hover:ring-[#c9a84c]/50'
            : 'bg-stone-200 group-hover:shadow-sm group-hover:ring-teal-600/30'
        }`}
      >
        <div
          className={`absolute bottom-0 left-0 right-0 transition-[height] duration-700 ease-out ${
            isDark
              ? 'bg-[#c9a84c] shadow-[0_0_15px_rgba(201,168,76,0.35)]'
              : 'bg-teal-600/70'
          }`}
          style={{ height: `${pct}%` }}
        />
      </div>
      <span
        className={`text-xs font-bold uppercase tracking-wide ${
          isDark ? 'text-[#f5f0e0]' : 'text-stone-600 group-hover:text-teal-700'
        }`}
        style={isDark ? { fontFamily: "'Sora', sans-serif" } : undefined}
      >
        {letter}
        <span className={isDark ? 'ml-1 text-[9px] opacity-60' : 'ml-1 text-[9px] text-stone-400'}>
          {band}/3
        </span>
      </span>
    </button>
  );

  return (
    <>
      <HoverCard openDelay={100} closeDelay={80}>
        <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
        <HoverCardContent side="top" align="center" className="w-72 p-4 bg-white border-stone-200">
          <div className="flex items-baseline justify-between mb-1.5">
            <span style={SERIF} className="text-lg text-stone-900">
              {insight.letter} · <span className="italic">{insight.word}</span>
            </span>
            <span style={SERIF} className="text-teal-700 text-lg">
              {band}<span className="text-xs text-stone-400">/3</span>
            </span>
          </div>
          <p className="text-[10px] tracking-[0.16em] uppercase text-stone-400 mb-2">{insight.lens}</p>
          <p className="text-sm text-stone-700 leading-relaxed mb-2">{insight.bands[band]}</p>
          <p className="text-[10px] text-teal-700 uppercase tracking-[0.14em] font-bold">Tap for your personal read →</p>
        </HoverCardContent>
      </HoverCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-baseline justify-between gap-4">
              <DialogTitle style={SERIF} className="text-2xl text-stone-900">
                {insight.letter} · <span className="italic">{insight.word}</span>
              </DialogTitle>
              <span style={SERIF} className="text-3xl text-teal-700">
                {band}<span className="text-sm text-stone-400">/3</span>
              </span>
            </div>
            <DialogDescription className="text-[10px] tracking-[0.16em] uppercase text-stone-500 pt-1">
              {insight.lens}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* FREE TIER — band meaning + persona line */}
            <div>
              <h4 className="text-[10px] tracking-[0.18em] uppercase font-medium text-stone-500 mb-2">
                What this facet means
              </h4>
              <p className="text-sm text-stone-800 leading-relaxed">{insight.bands[band]}</p>
              <p className="mt-3 text-xs text-teal-700 leading-relaxed border-l-2 border-teal-600/30 pl-3 italic">
                {teaser}
              </p>
            </div>

            {/* PREMIUM TIER — structured teaser, not blur */}
            <div className="rounded-sm border border-[#c9a84c]/40 bg-[#f5f0e0]/40 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] tracking-[0.18em] uppercase font-medium text-stone-500">
                  Your personal read
                </h4>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#064e3b] text-[#f5f0e0] text-[9px] uppercase tracking-[0.18em] font-bold">
                  <Lock className="w-2.5 h-2.5" /> Premium
                </span>
              </div>

              <div className="space-y-3">
                <TeaserRow
                  number="01"
                  title="Your pattern"
                  teaser={`Based on your ${persona} context, this facet tends to show up in a specific way.`}
                />
                <TeaserRow
                  number="02"
                  title="What's driving your score"
                  teaser={`There are usually 2-3 forces behind a ${band}/3 score. Your personalised breakdown explains them.`}
                />
                <TeaserRow
                  number="03"
                  title={band === 3 ? 'How to protect this' : 'Your first move this week'}
                  teaser={`A focused ${band === 3 ? 'protect' : 'raise'}-it playbook with steps matched to your rhythm.`}
                />
              </div>

              <div className="pt-3 border-t border-[#c9a84c]/30 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate('/launch/payment');
                  }}
                  className="px-5 py-3 bg-[#064e3b] hover:bg-[#0d7a5f] text-[#f5f0e0] text-[10px] uppercase tracking-[0.24em] font-bold transition-colors min-h-[44px] w-full sm:w-auto"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {ctaLabel} →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate('/launch/payment');
                  }}
                  className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#064e3b]/70 hover:text-[#064e3b] underline underline-offset-4 decoration-[#c9a84c]/60"
                >
                  See what's included
                </button>
              </div>
            </div>

            <p className="text-[10px] text-stone-400 leading-relaxed border-t border-stone-100 pt-3">
              A snapshot only — not a clinical score. MyRhythm does not diagnose, treat, or cure any condition.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

function TeaserRow({ number, title, teaser }: { number: string; title: string; teaser: string }) {
  return (
    <div className="flex gap-3">
      <span style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-xs italic text-teal-700 shrink-0 pt-0.5">
        {number}
      </span>
      <div>
        <p className="text-sm font-semibold text-stone-800">{title}</p>
        <p className="text-xs text-stone-500 leading-relaxed">{teaser}</p>
      </div>
    </div>
  );
}

export default MyRhythmLetterBar;
