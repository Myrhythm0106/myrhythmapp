import React, { useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { LetterId } from '@/data/launchAssessmentBanks';
import { bandFor, getLetterInsight } from '@/data/myrhythmLetterInsights';

const SERIF: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif" };

interface Props {
  id: LetterId;
  letter: string;
  score: number; // 0..3
  tone?: 'light' | 'dark';
  height?: string; // tailwind height class for the bar track
}

export const MyRhythmLetterBar: React.FC<Props> = ({ id, letter, score, tone = 'light', height = 'h-12' }) => {
  const insight = getLetterInsight(id);
  const band = bandFor(score);
  const pct = Math.round((band / 3) * 100);
  const [open, setOpen] = useState(false);
  const isDark = tone === 'dark';

  const label = `${letter} — ${insight.word}, score ${band} of 3. Tap for what it means and how to raise it.`;

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={label}
      className={`group flex flex-col items-center gap-2 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm ${
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
          <p className="text-[10px] text-stone-400 uppercase tracking-[0.14em]">Tap for more</p>
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
            <p className="text-sm text-stone-600 italic">{insight.short}</p>

            <div>
              <h4 className="text-[10px] tracking-[0.18em] uppercase font-medium text-stone-500 mb-2">
                What your score means
              </h4>
              <p className="text-sm text-stone-800 leading-relaxed">{insight.bands[band]}</p>
            </div>

            <div>
              <h4 className="text-[10px] tracking-[0.18em] uppercase font-medium text-stone-500 mb-2">
                {band === 3 ? 'Ways to protect this' : 'Ways to raise this'}
              </h4>
              <ul className="space-y-2">
                {insight.suggestions[band].map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-stone-800 leading-relaxed">
                    <span style={SERIF} className="italic text-teal-700 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
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

export default MyRhythmLetterBar;
