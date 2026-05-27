import React from 'react';
import { User } from 'lucide-react';

interface Props {
  name: string;
  relationship?: string;
  lastCaptureLabel?: string;
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('') || '·';
}

export function RecipientHeader({ name, relationship, lastCaptureLabel }: Props) {
  return (
    <div className="flex items-center gap-4 px-6 py-5 bg-white/70 backdrop-blur-sm border-b border-stone-200/70">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-base shadow-sm"
        style={{ background: 'linear-gradient(135deg,#0D9488,#3FB6A8)' }}
        aria-hidden="true"
      >
        {initials(name) || <User className="h-5 w-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-0.5">
          Capturing for
        </p>
        <p className="text-base font-semibold text-stone-900 truncate">
          {name}
          {relationship && (
            <span className="ml-2 text-xs font-normal text-stone-500">· {relationship}</span>
          )}
        </p>
        {lastCaptureLabel && (
          <p className="text-xs text-stone-500 mt-0.5">{lastCaptureLabel}</p>
        )}
      </div>
    </div>
  );
}
